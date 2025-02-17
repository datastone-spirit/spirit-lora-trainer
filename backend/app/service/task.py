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
        return result 

    def get(self, task_id=None, show_config=False):
        if task_id == None or task_id == "":
            return self.all()

        current_task = tm.current_task
        if current_task != None and current_task.id == task_id:
            return res(
                data=current_task.to_dict(show_config=show_config)
            )

        for task in tm.history:
            if task.id == task_id:
                return res(
                    data=task.to_dict(show_config=show_config)
                )

        raise FileNotFoundError(f"task id {task_id} not found")

    def all(self):
        data=[task.to_dict() for task in tm.history]
        current_task = tm.current_task
        if current_task is not None:
            data.append(current_task.to_dict())
        return res(data=data)

    