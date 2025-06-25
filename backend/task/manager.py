from typing import Optional, List
from task.task import Task, TaskStatus, TaskType, TrainingTask
from time import sleep
from functools import wraps
import logging
import threading

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class TaskManager:
    current_task: Optional[Task] = None
    history: Optional[List[Task]] = []

    def add_task(self, func, *args, **kwargs):

        if self.current_task is not None:
            logger.warning(f"current task {self.current_task.id} is not None, status is {self.current_task.status}")
            raise Exception(f"Current task {self.current_task.id} is not None, and Running")

        logger.info(f"begin to run wrapped function {func}")
        result = func(*args, **kwargs)
        logger.info(f"wrapped function {func} has done")
        if isinstance(result, Task):
            self.current_task = result
        return result

    def remove_task(self, task):
        self.tasks.remove(task)

    def get_tasks(self):
        return self.tasks

    def get_task_by_id(self, task_id):
        for task in self.tasks:
            if task.id == task_id:
                return task
        return None
    
    def get_current_task(self):
        return self.current_task
    
    def task_run_loop(self):
        while True:
            try:
                if self.current_task is not None:
                    if self.current_task.status == TaskStatus.CREATED:
                        logger.info(f"task id{self.current_task.id} is created, now runing")
                        self.current_task.run()
                    elif self.current_task.status == TaskStatus.COMPLETE:
                        logger.info(f"task id{self.current_task.id} running complete, added it to history task list")
                        self.history.append(self.current_task)
                        self.current_task = None
                    elif self.current_task.status == TaskStatus.FAILED:
                        logger.info(f"task id{self.current_task.id} running failed, added it to history task list")
                        self.history.append(self.current_task)
                        self.current_task = None
            except Exception as e:
                logger.error(f"TaskManager task_run_loop error: {e}")
                if self.current_task is not None:
                    self.current_task.status = TaskStatus.FAILED
                    self.history.append(self.current_task)
                    self.current_task = None
            sleep(0.5)
    
    def tensor_board_run_loop(self):
        while True:
            try:
                if self.current_task is not None:
                    task = self.current_task
                    if task is not None and task.status == TaskStatus.RUNNING:
                        #logger.info(f"task id {task.id} is running, update stats with tensorboard log")
                        task.update_detail_with_tb()
            except KeyError:
                logger.warning(f"TensorBoard log not found for task {self.current_task.id}, ignored")
            except Exception as e:
                logger.warning(f"TaskManager tensor_board_run_loop error {self.current_task}, ignored", exc_info=e)
            sleep(5)



def task_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return tm.add_task(func, *args, **kwargs)
    return wrapper

tm = TaskManager()
threading.Thread(target=tm.task_run_loop, daemon=True).start()

threading.Thread(target=tm.tensor_board_run_loop, daemon=True).start()