from task.manager import tm
from app.api.common.utils import res

class TaskService:

    def current(self):
        current_task = tm.current_task
        if current_task == None:
            raise FileNotFoundError("current has no task to run")
        return res(
            data=current_task.to_dict()
        )
        


    def get_history_tasks(self):
        result = []
        for task in tm.history:
            result.append(task.to_dict())
        return 

    def get_task_id(self, task_id):
        current_task = tm.current_task
        if current_task != None and current_task.id == task_id:
            return current_task.to_dict()

        for task in tm.history:
            if task.id == task_id:
                return task.to_dict()

        raise FileNotFoundError(f"task id {task_id} not found")

    