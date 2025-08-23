from dataclasses import dataclass, asdict, field
from app.api.model.hunyuan_paramter import HunyuanTrainingParameter
from app.api.common.utils import dataset2toml
from task.task import Task, SubTask, TaskChian, TaskType, TaskStatus
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
class HunyuanTrainingTask(Task):
    proc: Popen = None
    hunyuan_parameters: HunyuanTrainingParameter = None 

    def _run(self):
        try:
            logger.info("beginning to run proc communication with hunyuan training process")
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
                    self.stdout_lines.append(linestr)
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
        """Override to_dict to enum """
        # Create shallow copy of self.__dict__
        d = dict(self.__dict__)
        # Convert status enum
        d['status'] = self.status.value
        # Convert task_type enum 
        d['task_type'] = self.task_type.value
        d.pop('hunyuan_parameters') 
        d.pop('proc') 
        d.pop('stdout_lines', None)
        if show_config is True and self.hunyuan_parameters:
            d['frontend_config'] = self.hunyuan_parameters.frontend_config
        return d

    def update_detail_with_tb(self):
        logdir = self.hunyuan_parameters.config.log_dir
        reader = SummaryReader(logdir)
        df=reader.scalars
        current_step = max(df.get('step', [0]))
        if current_step == 0:
            return 

        def get_value(step=None, tag=None):
            try:
                return df.query('step==@step and tag==@tag')['value'].iloc[0]
            except Exception as e:
                logger.warning(f"get value failed with step {step} and tag {tag}, error: {e}")
                return 0

        self.detail['current'] = current_step
        self.detail['elapsed'] = time.time() - self.start_time
        self.detail['loss'] = get_value(step=current_step, tag="train/loss")
        self.detail['total_epoch'] = self.hunyuan_parameters.config.epochs

        epoch_seq = df.query('tag=="train/epoch_loss"').get('step', None)
        if epoch_seq is None or len(epoch_seq) == 0:
            return
        current_epoch = max(epoch_seq.values)
        self.detail['current_epoch'] = int(current_epoch)
        if current_epoch == 1:
            self.detail['estimate_steps_per_epoch'] = current_step
        self.detail['epoch_loss']=get_value(step=current_epoch, tag="train/epoch_loss")

    @classmethod
    def from_parameter(cls, proc : Popen, training_paramter: HunyuanTrainingParameter, task_id: str) -> 'Task':
        task = cls()
        task.status = TaskStatus.CREATED
        task.proc = proc 
        task.hunyuan_parameters = training_paramter
        if not task_id:
            task.id = uuid.uuid4().hex
        else:
            task.id = task_id
        task.detail = {
            #total': caculate_image_steps([(dir.path, dir.num_repeats) for dir in training_paramter.dataset.directory]) * training_paramter.config.epochs,
            'current': 0
        }
        task.task_type = TaskType.HUNYUAN_TRAINING
        task.start_time = time.time()
        task.stdout_lines = []
        return task