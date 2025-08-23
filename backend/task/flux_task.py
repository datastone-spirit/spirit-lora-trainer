from dataclasses import dataclass, asdict
from app.api.model.training_paramter import TrainingParameter
from app.api.common.utils import is_flux_sampling
from task.task import Task, get_logdir, TaskStatus, TaskType
from subprocess import Popen, TimeoutExpired, PIPE, STDOUT
from utils.util import parse_kohya_stdout, parse_kohya_progress_line
import uuid
from tbparse import SummaryReader
import time
import os
import tempfile

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

@dataclass
class TrainingTask(Task):
    proc: Popen = None
    training_parameters: TrainingParameter = None 
    is_sampling :bool =  True

    def _get_proc_info(self):
        """Extract relevant info from Popen object"""
        if not self.proc:
            return None
        return {
            'pid': self.proc.pid if self.proc.pid else None,
            'returncode': self.proc.returncode,
            'args': self.proc.args
        }

    def _run(self):
        try:
            logger.info("beginning to run proc communication with training process")
            #self.proc = subprocess.Popen(self.proc.args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            linestr = ''
            line = bytearray()
            while True:
                ch = self.proc.stdout.read(1)
                if ch == b'' and self.proc.poll() is not None:
                    break
                line.extend(ch)
                if ch == b'\n':
                    linestr = line.decode('utf-8', errors='ignore')
                    print(linestr, end='')
                    self.parse_progress_line(linestr) 
                    self.stdout_lines.append(linestr)
                    self.parse_stdout(linestr)
                    line = bytearray()  #
            stdout, stderr = self.proc.communicate()
        except TimeoutExpired as exc:
            self.proc.kill()
            self.proc.wait()
            raise
        except:
            self.proc.kill()
            raise

        retcode = self.proc.poll()
        if retcode != 0:
            logger.error(f"training subprocess run failed, retcode is {retcode}")
            raise Exception(f"training subprocess run failed, retcode is {retcode}")

        logger.info(f"training subprocess run complete successfully, retcode is {retcode}")
        return 

    def to_dict(self, verbose: bool = False, show_config: bool = False):
        """Override to_dict to handle Popen serialization"""
        # Create shallow copy of self.__dict__
        d = dict(self.__dict__)
        d.pop('training_parameters') 
        d.pop('proc') 
        d.pop('stdout_lines', None)
        # Replace proc with safe dict
        if verbose is True and self.proc:
            d['proc'] = self._get_proc_info()
        # Convert status enum
        d['status'] = self.status.value
        # Convert task_type enum 
        d['task_type'] = self.task_type.value
        # Convert training parameters
        if verbose is True and self.training_parameters:
            d['training_parameters'] = asdict(self.training_parameters)
        
        if show_config is True and self.training_parameters:
            d['frontend_config'] = self.training_parameters.frontend_config
        return d

    def parse_stdout(self, stdout):
        parse_kohya_stdout(stdout, self.detail)

    def parse_progress_line(self, line):
        parse_kohya_progress_line(line, self.detail)


    def update_detail_with_tb(self):
        import os
        log_path = get_logdir(self.training_parameters.config.logging_dir, self.training_parameters.config.log_prefix)
        if log_path is None:
            #logger.warning(f"task {self.id} log path is not found")
            return
        if not os.path.exists(log_path):
            #logger.warning(f"task {self.id} log path {log_path} is not exists, waiting the training start")
            return
        reader = SummaryReader(log_path)
        df=reader.scalars
        current = max(df['step'])
        self.detail['current'] = current
        
        # Replace chained indexing with single filter query operation to suppress warning messages
        
        self.detail['loss_avr'] = float(df.query('step==@current and tag=="loss/average"')['value'].iloc[0])
        self.detail['loss'] = float(df.query('step==@current and tag=="loss/current"')['value'].iloc[0]) 
        self.detail['lr_unet'] = float(df.query('step==@current and tag=="lr/unet"')['value'].iloc[0])        
        
        #self.detail['loss_avr'] = float(df[df['step']==current][df['tag']=='loss/average']['value'].values[0])
        #self.detail['loss'] = float(df[df['step']==current][df['tag']=='loss/current']['value'].values[0])
        #self.detail['lr_unet'] = float(df[df['step']==current][df['tag']=='lr/unet']['value'].values[0])
        
        total = int(self.detail.get('total', 0))
        if total > 0:
            self.detail['progress'] = round((current / total * 100), 2)

    @classmethod
    def from_parameter(cls, proc : Popen, training_paramter: TrainingParameter, task_id: str) -> 'Task':
        task = cls()
        task.status = TaskStatus.CREATED
        task.proc = proc
        task.training_parameters = training_paramter
        task.detail = {}
        if training_paramter.config.log_prefix is None or training_paramter.config.log_prefix == '':
            raise Exception("[Bug] log_prefix should not be empty or none")

        if task_id is not None or task_id != '':
            task.id = task_id
        elif training_paramter.config.log_prefix is not None or training_paramter.config.log_prefix != '':
            task.id = training_paramter.config.log_prefix
        else:
            task.id = uuid.uuid3().hex

        task.task_type = TaskType.TRAINING
        task.start_time = time.time()
        task.is_sampling = is_flux_sampling(training_paramter.config)
        if task.is_sampling:
            task.sampling_path = os.path.join(training_paramter.config.output_dir, "sample")
        task.stdout_lines = []
        return task

