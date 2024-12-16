from enum import Enum
from typing import Optional
from subprocess import Popen
from dataclasses import dataclass
from app.api.model.training_paramter import TrainingParameter
from subprocess import Popen, PIPE, TimeoutExpired, CalledProcessError, CompletedProcess
import uuid


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
            logger.info("beging to running proc comunication with training process")
            stdout, stderr = self.proc.communicate(input)
        except TimeoutExpired as exc:
            self.proc.kill()
            self.proc.wait()
            raise
        except:
            self.proc.kill()
            raise

        retcode = self.proc.poll()
        logger.info(f"training subprocess run complete successfully, retcode is {retcode}")
        return CompletedProcess(self.proc.args, retcode, stdout, stderr)