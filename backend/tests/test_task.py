from task.task import TrainingTask, logger

def test_task_parse_progress_line():
    task = TrainingTask()
    task.detail = {}
    task.parse_progress_line("steps: 100%|██████████| 40/40 [00:42<00:00,  1.07s/it, avr_loss=0.145]")
    logger.info(task.detail)
    assert task.detail['total'] == 40
    assert task.detail['elapsed'] == '00:42'
    assert task.detail['remaining'] == '00:00'
    assert task.detail['speed'] == 1.07

def test_task_parse_stdout():
    task = TrainingTask()
    task.detail = {}
    
    # Test Japanese format
    for line in [
        "running training / 学習開始",
        "num train images * repeats / 学習画像の数×繰り返し回数: 10",
        "num reg images / 正則化画像の数: 0", 
        "num batches per epoch / 1epochのバッチ数: 10",
        "num epochs / epoch数: 10",
        "batch size per device / バッチサイズ: 1",
        "gradient accumulation steps / 勾配を合計するステップ数 = 1",
        "total optimization steps / 学習ステップ数: 100"
    ]:
        task.parse_stdout(line)

    logger.info(task.detail)
    assert task.detail['num_train_images'] == 10
    assert task.detail['num_reg_images'] == 0
    assert task.detail['num_batches_per_epoch'] == 10
    assert task.detail['num_epochs'] == 10
    assert task.detail['batch_size_per_device'] == 1
    assert task.detail['gradient_accumulation_steps'] == 1
    assert task.detail['total_optimization_steps'] == 100