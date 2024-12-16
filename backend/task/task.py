from enum import Enum
from typing import Optional
from subprocess import Popen
from dataclasses import dataclass
from app.api.model.training_paramter import TrainingParameter
from subprocess import Popen, PIPE, TimeoutExpired, CalledProcessError, CompletedProcess
import uuid
import re


from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class TaskStatus(Enum):
    CREATED = "created"
    RUNNING = "running"
    COMPLETE = "complete"
    FAILED = "failed"

@dataclass
class Task:
    status = TaskStatus.CREATED
    id: str = None
    detail: Optional[dict] = None

    @staticmethod
    def wrap_training(proc : Popen, training_paramter: TrainingParameter) -> 'Task':
        task = TrainingTask()
        task.status = TaskStatus.CREATED
        task.proc = proc
        task.training_parameters = training_paramter
        task.detail = {}
        task.id = uuid.uuid4().hex
        return task
    
    def run(self):
        self.status = TaskStatus.RUNNING
        try:
            self._run()
        except Exception as e:
            logger.error(f"task {self.id} running failed {e}")
            self.status = TaskStatus.FAILED
            self.detail = str(e)
            return 
        self.status = TaskStatus.COMPLETE
        return
    
    def __str__(self):
        return f"task_id:{self.id}, status: {self.status}, detail: {self.detail}"

@dataclass
class TrainingTask(Task):
    proc: Popen = None
    training_parameters: TrainingParameter = None 

    def _run(self):
        try:
            logger.info("beginning to run proc communication with training process")
            #self.proc = subprocess.Popen(self.proc.args, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            stdout_lines = []
            while True:
                output = self.proc.stdout.readline()
                if output == '' and self.proc.poll() is not None:
                    break
                if output:
                    stdout_lines.append(output.strip())
                    self.parse_stdout(output.strip())
                    print(output.strip())
            stdout, stderr = self.proc.communicate()
        except TimeoutExpired as exc:
            self.proc.kill()
            self.proc.wait()
            raise
        except:
            self.proc.kill()
            raise

        retcode = self.proc.poll()
        logger.info(f"training subprocess run complete successfully, retcode is {retcode}")
        return CompletedProcess(self.proc.args, retcode, "\n".join(stdout_lines), stderr)
    
    
    def parse_stdout(self, stdout):
        """_summary_

        Args:
            stdout (_type_): _description_

need to parse the following information, include number of train images, number of reg images, number of batches per epoch, number of epochs, batch size per device, gradient accumulation steps, total optimization steps
running training / 学習開始
num train images * repeats / 学習画像の数×繰り返し回数: 10
num reg images / 正則化画像の数: 0
num batches per epoch / 1epochのバッチ数: 10
num epochs / epoch数: 10
batch size per device / バッチサイズ: 1
gradient accumulation steps / 勾配を合計するステップ数 = 1
total optimization steps / 学習ステップ数: 100
        """
        pattern = {
             "num_train_images": r"num train images \* repeats .*?: (\d+)",
             "num_reg_images": r"num reg images .*?: (\d+)",
             "num_batches_per_epoch": r"num batches per epoch .*?: (\d+)",
             "num_epochs": r"num epochs .*?: (\d+)",
             "batch_size_per_device": r"batch size per device .*?: (\d+)",
             "gradient_accumulation_steps": r"gradient accumulation steps .*?=? (\d+)",
             "total_optimization_steps": r"total optimization steps .*?: (\d+)"
         }
         
        for key, regex in pattern.items():
            match = re.search(regex, stdout)
            if match:
                self.detail[key] = int(match.group(1))
        pass