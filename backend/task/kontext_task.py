from dataclasses import dataclass, asdict, field
from app.api.model.kontext_parameter import KontextTrainingParameter
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
class KontextTrainingTask(Task):
    proc: Popen = None
    kontext_parameters: KontextTrainingParameter = None

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
            logger.info("beginning to run proc communication with kontext training process")
            linestr = ''
            line = bytearray()
            while True:
                ch = self.proc.stdout.read(1)
                if ch == b'' and self.proc.poll() is not None:
                    break
                line.extend(ch)
                if ch == b'\n' or ch == b'\r':
                    linestr = line.decode('utf-8', errors='ignore')
                    print(linestr, end='')
                    self.parse_kontext_progress_line(linestr)
                    self.stdout_lines.append(linestr)
                    line = bytearray()
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
            logger.error(f"kontext training subprocess run failed, retcode is {retcode}")
            raise Exception(f"kontext training subprocess run failed, retcode is {retcode}")

        logger.info(f"kontext training subprocess run complete successfully, retcode is {retcode}")
        return

    def parse_kontext_progress_line(self, line):
        """Parse Kontext training output to extract training status"""
        import re
        
        line = line.strip()
        
        # Check if we're still in preparation stage
        if any(keyword in line for keyword in [
            "Loading Flux Kontext model", "Loading transformer", "Loading T5", 
            "Loading CLIP", "Loading VAE", "Making pipe", "Preparing Model",
            "create LoRA network", "Dataset:", "Preprocessing image dimensions",
            "Found", "images", "Bucket sizes", "Caching latents", "Generating baseline samples"
        ]):
            self.detail['stage'] = 'prepare'
            # Extract dataset information
            if "Dataset:" in line:
                dataset_path = line.split("Dataset:")[-1].strip()
                self.detail['dataset_path'] = dataset_path
            elif "Found" in line and "images" in line:
                # Extract number of images found
                match = re.search(r'Found (\d+) images', line)
                if match:
                    self.detail['total_images'] = int(match.group(1))
            return

        # Get model name from configuration
        model_name = self.kontext_parameters.config.name if self.kontext_parameters and self.kontext_parameters.config else "unknown"
        
        # Parse the main training progress line using the specific model name from configuration
        # Format: model_name: progress% |progress_bar| step/total_steps [elapsed<remaining, speed, lr: learning_rate loss: loss_value]
        # Use model name from configuration to create specific pattern
        escaped_model_name = re.escape(model_name)
        progress_pattern = rf'{escaped_model_name}:\s*(\d+)%\|[^|]*\|\s*(\d+)/(\d+)\s*\[([^,]+)<([^,]+),\s*([^,]+),\s*lr:\s*([\d.e-]+)\s+loss:\s*([\d.e-]+)\]'
        
        match = re.search(progress_pattern, line)
        if match:
            progress_percent = int(match.group(1))
            current_step = int(match.group(2))
            total_steps = int(match.group(3))
            elapsed_time = match.group(4).strip()
            remaining_time = match.group(5).strip()
            speed = match.group(6).strip()
            learning_rate = float(match.group(7))
            loss_value = float(match.group(8))
            
            # Update detail dictionary using model name from configuration
            self.detail.update({
                'stage': 'training',
                'model_name': model_name,  # Use model name from configuration
                'progress_percent': progress_percent,
                'current': current_step,
                'total': total_steps,
                'elapsed_time_str': elapsed_time,
                'remaining_time_str': remaining_time,
                'speed_str': speed,
                'learning_rate': learning_rate,
                'loss': loss_value
            })
            
            # Calculate estimated total training time
            if current_step > 0:
                elapsed_seconds = time.time() - self.start_time
                estimated_total_seconds = (elapsed_seconds / current_step) * total_steps
                self.detail['estimated_total_time_seconds'] = estimated_total_seconds
                
                # Parse speed to get actual step time
                speed_match = re.search(r'([\d.]+)s/it', speed)
                if speed_match:
                    seconds_per_step = float(speed_match.group(1))
                    self.detail['seconds_per_step'] = seconds_per_step

    def to_dict(self, verbose: bool = False, show_config: bool = False):
        """Override to_dict to handle Popen serialization"""
        # Create shallow copy of self.__dict__
        d = dict(self.__dict__)
        d.pop('kontext_parameters', None)
        d.pop('proc', None)
        d.pop('stdout_lines', None)
        
        # Replace proc with safe dict
        if verbose is True and self.proc:
            d['proc'] = self._get_proc_info()
        
        # Convert status enum
        d['status'] = self.status.value
        # Convert task_type enum 
        d['task_type'] = self.task_type.value
        
        # Convert training parameters
        if verbose is True and self.kontext_parameters:
            d['kontext_parameters'] = asdict(self.kontext_parameters)
        
        if show_config is True and self.kontext_parameters:
            d['frontend_config'] = self.kontext_parameters.frontend_config
        
        return d

    def update_detail_with_tb(self):
        # Kontext training doesn't use tensorboard by default
        # The progress is parsed from stdout directly
        pass

    @classmethod
    def from_parameter(cls, proc: Popen, training_parameter: KontextTrainingParameter, task_id: str) -> 'Task':
        task = KontextTrainingTask()
        task.status = TaskStatus.CREATED
        task.proc = proc
        task.kontext_parameters = training_parameter
        task.detail = {
            'current': 0,
            'stage': 'prepare'
        }
        
        if task_id is not None and task_id != '':
            task.id = task_id
        else:
            task.id = uuid.uuid4().hex

        task.task_type = TaskType.KONTEXT_TRAINING
        task.start_time = time.time()
        task.stdout_lines = []
        task.is_sampling = training_parameter.is_sampling()
        task.sampling_path = training_parameter.sampling_path()
        return task
