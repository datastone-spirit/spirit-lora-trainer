from task.task import TrainingTask, logger

def test_task_parse_progress_line():
    task = TrainingTask()
    task.detail = {}
    task.parse_progress_line("steps: 100%|██████████| 40/40 [00:42<00:00,  1.07s/it, avr_loss=0.145]")
    logger.info(task.detail)
    assert task.detail['progress'] == 100
    assert task.detail['current'] == 40
    assert task.detail['total'] == 40
    assert task.detail['elapsed'] == '00:42'
    assert task.detail['remaining'] == '00:00'
    assert task.detail['speed'] == 1.07
    assert task.detail['loss'] == 0.145
    