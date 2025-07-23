from task.task import TrainingTask, KontextTrainingTask, logger
from app.api.model.kontext_parameter import KontextTrainingParameter, KontextConfig
import time

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

def test_kontext_training_task_parse_progress_line_prepare_stage():
    """Test parsing of preparation stage lines"""
    # Create mock kontext parameters
    config = KontextConfig()
    config.name = "test_flux_kontext_lora_v1"
    
    kontext_params = KontextTrainingParameter()
    kontext_params.config = config
    
    task = KontextTrainingTask()
    task.kontext_parameters = kontext_params
    task.detail = {}
    task.start_time = time.time()
    
    # Test preparation stage lines
    prepare_lines = [
        "Loading Flux Kontext model",
        "Loading transformer",
        "Loading checkpoint shards: 100%|████████████████████████████████████████████████████████████████████████████████| 3/3 [00:00<00:00,  9.97it/s]",
        "Loading T5", 
        "Loading CLIP",
        "Loading VAE",
        "Making pipe",
        "Preparing Model",
        "create LoRA network. base dim (rank): 16, alpha: 16",
        "Dataset: /home/ubuntu/zhaokun/kontext-dataset/dataset/target",
        "  -  Preprocessing image dimensions",
        "  -  Found 8 images",
        "Bucket sizes for /home/ubuntu/zhaokun/kontext-dataset/dataset/target:",
        "Caching latents for /home/ubuntu/zhaokun/kontext-dataset/dataset/target",
        "Generating baseline samples before training"
    ]
    
    for line in prepare_lines:
        task.parse_kontext_progress_line(line)
        assert task.detail['stage'] == 'prepare'
    
    # Test dataset path extraction
    task.parse_kontext_progress_line("Dataset: /home/ubuntu/zhaokun/kontext-dataset/dataset/target")
    assert task.detail['dataset_path'] == "/home/ubuntu/zhaokun/kontext-dataset/dataset/target"
    
    # Test image count extraction
    task.parse_kontext_progress_line("  -  Found 8 images")
    assert task.detail['total_images'] == 8

def test_kontext_training_task_parse_progress_line_training_stage():
    """Test parsing of training stage progress line with detailed metric validation"""
    # Create mock kontext parameters
    config = KontextConfig()
    config.name = "my_first_flux_kontext_lora_v1"
    
    kontext_params = KontextTrainingParameter()
    kontext_params.config = config
    
    task = KontextTrainingTask()
    task.kontext_parameters = kontext_params
    task.detail = {}
    task.start_time = time.time() - 10  # Simulate 10 seconds elapsed
    
    # Test training progress line
    progress_line = "my_first_flux_kontext_lora_v1:   0%|                                          | 2/3000 [00:06<1:42:04,  2.04s/it, lr: 1.0e-04 loss: 1.628e-01]"
    
    task.parse_kontext_progress_line(progress_line)
    
    # Verify parsed values
    assert task.detail['stage'] == 'training'
    assert task.detail['model_name'] == 'my_first_flux_kontext_lora_v1'
    assert task.detail['progress_percent'] == 0
    assert task.detail['current'] == 2
    assert task.detail['total'] == 3000
    assert task.detail['elapsed_time_str'] == '00:06'
    assert task.detail['remaining_time_str'] == '1:42:04'
    assert task.detail['speed_str'] == '2.04s/it'
    assert abs(task.detail['learning_rate'] - 1.0e-04) < 1e-10
    assert abs(task.detail['loss'] - 1.628e-01) < 1e-10
    assert 'estimated_total_time_seconds' in task.detail
    assert task.detail['seconds_per_step'] == 2.04

def test_kontext_training_task_detailed_metrics_validation():
    """Test detailed validation of all extracted metrics including loss, learning rate, and timing"""
    # Create mock kontext parameters
    config = KontextConfig()
    config.name = "detailed_test_model"
    
    kontext_params = KontextTrainingParameter()
    kontext_params.config = config
    
    task = KontextTrainingTask()
    task.kontext_parameters = kontext_params
    task.detail = {}
    
    # Test various progress lines with different metrics
    test_cases = [
        {
            'line': 'detailed_test_model:   5%|██                                        | 150/3000 [05:05<1:37:10,  2.04s/it, lr: 9.5e-05 loss: 1.234e-01]',
            'expected': {
                'progress_percent': 5,
                'current': 150,
                'total': 3000,
                'elapsed_time_str': '05:05',
                'remaining_time_str': '1:37:10',
                'speed_str': '2.04s/it',
                'learning_rate': 9.5e-05,
                'loss': 1.234e-01,
                'seconds_per_step': 2.04
            }
        },
        {
            'line': 'detailed_test_model:  25%|██████████                                | 750/3000 [25:30<1:16:30,  2.04s/it, lr: 7.5e-05 loss: 8.976e-02]',
            'expected': {
                'progress_percent': 25,
                'current': 750,
                'total': 3000,
                'elapsed_time_str': '25:30',
                'remaining_time_str': '1:16:30',
                'speed_str': '2.04s/it',
                'learning_rate': 7.5e-05,
                'loss': 8.976e-02,
                'seconds_per_step': 2.04
            }
        },
        {
            'line': 'detailed_test_model:  50%|████████████████████                     | 1500/3000 [51:00<51:00,  2.04s/it, lr: 5.0e-05 loss: 6.543e-02]',
            'expected': {
                'progress_percent': 50,
                'current': 1500,
                'total': 3000,
                'elapsed_time_str': '51:00',
                'remaining_time_str': '51:00',
                'speed_str': '2.04s/it',
                'learning_rate': 5.0e-05,
                'loss': 6.543e-02,
                'seconds_per_step': 2.04
            }
        },
        {
            'line': 'detailed_test_model:  75%|██████████████████████████████            | 2250/3000 [76:30<25:30,  2.04s/it, lr: 2.5e-05 loss: 4.321e-02]',
            'expected': {
                'progress_percent': 75,
                'current': 2250,
                'total': 3000,
                'elapsed_time_str': '76:30',
                'remaining_time_str': '25:30',
                'speed_str': '2.04s/it',
                'learning_rate': 2.5e-05,
                'loss': 4.321e-02,
                'seconds_per_step': 2.04
            }
        },
        {
            'line': 'detailed_test_model: 100%|██████████████████████████████████████████| 3000/3000 [102:00<00:00,  2.04s/it, lr: 1.0e-06 loss: 2.109e-02]',
            'expected': {
                'progress_percent': 100,
                'current': 3000,
                'total': 3000,
                'elapsed_time_str': '102:00',
                'remaining_time_str': '00:00',
                'speed_str': '2.04s/it',
                'learning_rate': 1.0e-06,
                'loss': 2.109e-02,
                'seconds_per_step': 2.04
            }
        }
    ]
    
    for i, test_case in enumerate(test_cases):
        # Reset task for each test case
        task.detail = {}
        task.start_time = time.time() - (test_case['expected']['current'] * 2.04)  # Simulate realistic elapsed time
        
        task.parse_kontext_progress_line(test_case['line'])
        
        # Verify all extracted metrics
        assert task.detail['stage'] == 'training', f"Test case {i}: Stage should be 'training'"
        assert task.detail['model_name'] == 'detailed_test_model', f"Test case {i}: Model name mismatch"
        assert task.detail['progress_percent'] == test_case['expected']['progress_percent'], f"Test case {i}: Progress percent mismatch"
        assert task.detail['current'] == test_case['expected']['current'], f"Test case {i}: Current step mismatch"
        assert task.detail['total'] == test_case['expected']['total'], f"Test case {i}: Total steps mismatch"
        assert task.detail['elapsed_time_str'] == test_case['expected']['elapsed_time_str'], f"Test case {i}: Elapsed time string mismatch"
        assert task.detail['remaining_time_str'] == test_case['expected']['remaining_time_str'], f"Test case {i}: Remaining time string mismatch"
        assert task.detail['speed_str'] == test_case['expected']['speed_str'], f"Test case {i}: Speed string mismatch"
        assert abs(task.detail['learning_rate'] - test_case['expected']['learning_rate']) < 1e-10, f"Test case {i}: Learning rate mismatch"
        assert abs(task.detail['loss'] - test_case['expected']['loss']) < 1e-10, f"Test case {i}: Loss value mismatch"
        assert task.detail['seconds_per_step'] == test_case['expected']['seconds_per_step'], f"Test case {i}: Seconds per step mismatch"
        
        # Verify estimated total time calculation
        if test_case['expected']['current'] > 0:
            assert 'estimated_total_time_seconds' in task.detail, f"Test case {i}: Missing estimated total time"
            expected_total_time = (time.time() - task.start_time) / test_case['expected']['current'] * test_case['expected']['total']
            assert abs(task.detail['estimated_total_time_seconds'] - expected_total_time) < 5, f"Test case {i}: Estimated total time calculation error"

def test_kontext_training_task_edge_cases_and_precision():
    """Test edge cases with various number formats and precision requirements"""
    config = KontextConfig()
    config.name = "precision_test_model"
    
    kontext_params = KontextTrainingParameter()
    kontext_params.config = config
    
    task = KontextTrainingTask()
    task.kontext_parameters = kontext_params
    task.detail = {}
    task.start_time = time.time() - 100
    
    # Test edge cases with different number formats - using more realistic progress bar patterns
    edge_cases = [
        {
            'description': 'Very small learning rate and loss',
            'line': 'precision_test_model:  10%|████                                      | 100/1000 [03:24<30:36,  2.04s/it, lr: 1.23e-07 loss: 9.87e-04]',
            'expected_lr': 1.23e-07,
            'expected_loss': 9.87e-04,
            'expected_speed': 2.04
        },
        {
            'description': 'Regular decimal numbers',
            'line': 'precision_test_model:  50%|████████████████████                     | 500/1000 [34:00<34:00,  2.04s/it, lr: 0.0001 loss: 0.123]',
            'expected_lr': 0.0001,
            'expected_loss': 0.123,
            'expected_speed': 2.04
        },
        {
            'description': 'Different time formats',
            'line': 'precision_test_model:  90%|████████████████████████████████████      | 900/1000 [30:36<03:24,  2.04s/it, lr: 1.5e-06 loss: 1.234e-03]',
            'expected_lr': 1.5e-06,
            'expected_loss': 1.234e-03,
            'expected_speed': 2.04
        },
        {
            'description': 'Very fast iteration speed',
            'line': 'precision_test_model:  75%|██████████████████████████████            | 750/1000 [12:30<04:10,  0.5s/it, lr: 2.0e-04 loss: 7.89e-02]',
            'expected_lr': 2.0e-04,
            'expected_loss': 7.89e-02,
            'expected_speed': 0.5
        },
        {
            'description': 'Very slow iteration speed with detailed analysis',
            'line': 'precision_test_model:  25%|██████████                                | 250/1000 [41:40<2:05:00,  10.0s/it, lr: 8.75e-05 loss: 3.456e-01]',
            'expected_lr': 8.75e-05,
            'expected_loss': 3.456e-01,
            'expected_speed': 10.0,
            'expected_progress': 25,
            'expected_current': 250,
            'expected_total': 1000,
            'expected_elapsed': '41:40',
            'expected_remaining': '2:05:00'
        }
    ]
    
    for case in edge_cases:
        # Reset task for each test case
        task.detail = {}
        task.start_time = time.time() - 100
        
        task.parse_kontext_progress_line(case['line'])
        
        # Debug information if the test fails
        if 'learning_rate' not in task.detail:
            print(f"DEBUG: Failed to parse line: {case['line']}")
            print(f"DEBUG: Task detail after parsing: {task.detail}")
        
        # Verify that the line was parsed successfully
        assert 'learning_rate' in task.detail, f"{case['description']}: Learning rate not extracted from line: {case['line']}"
        assert 'loss' in task.detail, f"{case['description']}: Loss not extracted from line: {case['line']}"
        
        # Verify precision of extracted values
        assert abs(task.detail['learning_rate'] - case['expected_lr']) < 1e-12, f"{case['description']}: Learning rate precision error. Expected {case['expected_lr']}, got {task.detail['learning_rate']}"
        assert abs(task.detail['loss'] - case['expected_loss']) < 1e-12, f"{case['description']}: Loss precision error. Expected {case['expected_loss']}, got {task.detail['loss']}"
        
        if 'expected_speed' in case:
            assert task.detail['seconds_per_step'] == case['expected_speed'], f"{case['description']}: Speed extraction error. Expected {case['expected_speed']}, got {task.detail.get('seconds_per_step')}"
        
        # Test the detailed case with all metrics
        if case['description'] == 'Very slow iteration speed with detailed analysis':
            assert task.detail['progress_percent'] == case['expected_progress'], f"Progress percent mismatch"
            assert task.detail['current'] == case['expected_current'], f"Current step mismatch"
            assert task.detail['total'] == case['expected_total'], f"Total steps mismatch"
            assert task.detail['elapsed_time_str'] == case['expected_elapsed'], f"Elapsed time mismatch"
            assert task.detail['remaining_time_str'] == case['expected_remaining'], f"Remaining time mismatch"
            assert task.detail['stage'] == 'training', f"Should be in training stage"
            assert task.detail['model_name'] == 'precision_test_model', f"Model name mismatch"
            
            # Verify time calculations are reasonable
            assert 'estimated_total_time_seconds' in task.detail, f"Missing estimated total time"

def test_kontext_specific_progress_line_metrics():
    """Test specific progress line: 25%|██████████ | 250/1000 [41:40<2:05:00, 10.0s/it, lr: 8.75e-05 loss: 3.456e-01]"""
    config = KontextConfig()
    config.name = "test_model"
    
    kontext_params = KontextTrainingParameter()
    kontext_params.config = config
    
    task = KontextTrainingTask()
    task.kontext_parameters = kontext_params
    task.detail = {}
    task.start_time = time.time() - 100
    
    # The exact progress line to test
    progress_line = "test_model: 25%|██████████ | 250/1000 [41:40<2:05:00, 10.0s/it, lr: 8.75e-05 loss: 3.456e-01]"
    
    # Parse the line
    task.parse_kontext_progress_line(progress_line)
    
    # Validate all the specific metrics requested:
    
    # 1. Already run step: 250
    assert task.detail['current'] == 250, f"Expected current step 250, got {task.detail.get('current')}"
    
    # 2. Total step: 1000
    assert task.detail['total'] == 1000, f"Expected total steps 1000, got {task.detail.get('total')}"
    
    # 3. Already run time elapse: 41:40
    assert task.detail['elapsed_time_str'] == "41:40", f"Expected elapsed time '41:40', got {task.detail.get('elapsed_time_str')}"
    
    # 4. Estimated need time to finish: 2:05:00
    assert task.detail['remaining_time_str'] == "2:05:00", f"Expected remaining time '2:05:00', got {task.detail.get('remaining_time_str')}"
    
    # 5. Time elapse per iteration: 10.0s
    assert task.detail['seconds_per_step'] == 10.0, f"Expected 10.0s per iteration, got {task.detail.get('seconds_per_step')}"
    
    # 6. Current learning rate: 8.75e-05
    assert abs(task.detail['learning_rate'] - 8.75e-05) < 1e-12, f"Expected learning rate 8.75e-05, got {task.detail.get('learning_rate')}"
    
    # Additional validation: loss value (parsing converts 3.456e-01 to 0.3456)
    assert abs(task.detail['loss'] - 0.3456) < 1e-12, f"Expected loss 0.3456, got {task.detail.get('loss')}"
    
    # Additional validation: progress percentage
    assert task.detail['progress_percent'] == 25, f"Expected progress 25%, got {task.detail.get('progress_percent')}"
    
    # Verify that we have the estimated total time
    assert 'estimated_total_time_seconds' in task.detail, f"Missing estimated total time"
    
    print(f"✅ All metrics validated successfully:")
    print(f"   Already run steps: {task.detail['current']}")
    print(f"   Total steps: {task.detail['total']}")
    print(f"   Already run time: {task.detail['elapsed_time_str']}")
    print(f"   Estimated time to finish: {task.detail['remaining_time_str']}")
    print(f"   Time per iteration: {task.detail['seconds_per_step']}s")
    print(f"   Current learning rate: {task.detail['learning_rate']}")
    print(f"   Current loss: {task.detail['loss']}")
    print(f"   Progress percentage: {task.detail['progress_percent']}%")
    print(f"   Stage: {task.detail['stage']}")
    print(f"   Model name: {task.detail['model_name']}")

def test_kontext_training_task_time_calculations():
    """Test accurate time calculations and elapsed time tracking"""
    config = KontextConfig()
    config.name = "time_test_model"
    
    kontext_params = KontextTrainingParameter()
    kontext_params.config = config
    
    task = KontextTrainingTask()
    task.kontext_parameters = kontext_params
    task.detail = {}
    
    # Test with known start time
    start_time = time.time() - 3600  # 1 hour ago
    task.start_time = start_time
    
    progress_line = "time_test_model:  33%|█████████████▍                            | 1000/3000 [20:24<40:48,  1.224s/it, lr: 5.0e-05 loss: 1.0e-01]"
    
    task.parse_kontext_progress_line(progress_line)
    
    # Verify time calculations
    current_step = task.detail['current']
    total_steps = task.detail['total']
    actual_elapsed = time.time() - start_time
    
    # Check estimated total time calculation
    expected_total_time = (actual_elapsed / current_step) * total_steps
    assert abs(task.detail['estimated_total_time_seconds'] - expected_total_time) < 1, "Estimated total time calculation error"
    
    # Check seconds per step extraction
    assert task.detail['seconds_per_step'] == 1.224, "Seconds per step extraction error"
    
    # Verify that actual elapsed time is reasonable
    assert actual_elapsed > 3500 and actual_elapsed < 3700, "Actual elapsed time should be around 1 hour"

def test_kontext_training_task_loss_and_lr_trends():
    """Test that loss generally decreases and learning rate follows expected patterns"""
    config = KontextConfig()
    config.name = "trend_test_model"
    
    kontext_params = KontextTrainingParameter()
    kontext_params.config = config
    
    task = KontextTrainingTask()
    task.kontext_parameters = kontext_params
    
    # Simulate training progression with decreasing loss and learning rate
    training_progression = [
        ("trend_test_model:   5%|██                                        | 50/1000 [01:42<32:18,  2.04s/it, lr: 1.0e-04 loss: 2.5e-01]", 1.0e-04, 2.5e-01),
        ("trend_test_model:  25%|██████████                                | 250/1000 [08:30<25:30,  2.04s/it, lr: 8.0e-05 loss: 1.8e-01]", 8.0e-05, 1.8e-01),
        ("trend_test_model:  50%|████████████████████                     | 500/1000 [17:00<17:00,  2.04s/it, lr: 6.0e-05 loss: 1.2e-01]", 6.0e-05, 1.2e-01),
        ("trend_test_model:  75%|██████████████████████████████            | 750/1000 [25:30<08:30,  2.04s/it, lr: 4.0e-05 loss: 8.5e-02]", 4.0e-05, 8.5e-02),
        ("trend_test_model: 100%|██████████████████████████████████████████| 1000/1000 [34:00<00:00,  2.04s/it, lr: 1.0e-05 loss: 5.2e-02]", 1.0e-05, 5.2e-02)
    ]
    
    previous_lr = float('inf')
    previous_loss = float('inf')
    
    for line, expected_lr, expected_loss in training_progression:
        task.detail = {}
        task.start_time = time.time() - 100
        
        task.parse_kontext_progress_line(line)
        
        # Verify extracted values match expected
        assert abs(task.detail['learning_rate'] - expected_lr) < 1e-10, f"Learning rate mismatch for line: {line}"
        assert abs(task.detail['loss'] - expected_loss) < 1e-10, f"Loss mismatch for line: {line}"
        
        # Verify trends (learning rate and loss should generally decrease)
        if previous_lr != float('inf'):
            assert task.detail['learning_rate'] <= previous_lr, "Learning rate should decrease or stay constant"
        if previous_loss != float('inf'):
            assert task.detail['loss'] <= previous_loss, "Loss should decrease over training"
        
        previous_lr = task.detail['learning_rate']
        previous_loss = task.detail['loss']

def test_kontext_training_task_parse_progress_line_different_model_names():
    """Test parsing with different model names including special characters"""
    test_cases = [
        {
            'model_name': 'simple_model',
            'line': 'simple_model:  50%|████████████████████                    | 1500/3000 [15:30<15:30,  1.62s/it, lr: 5.0e-05 loss: 8.234e-02]'
        },
        {
            'model_name': 'model-with-dashes',
            'line': 'model-with-dashes:  75%|██████████████████████████████          | 2250/3000 [23:15<07:45,  1.61s/it, lr: 2.5e-05 loss: 5.123e-02]'
        },
        {
            'model_name': 'model_with_underscores_123',
            'line': 'model_with_underscores_123: 100%|████████████████████████████████████████| 3000/3000 [31:00<00:00,  1.61s/it, lr: 1.0e-06 loss: 3.456e-02]'
        }
    ]
    
    for test_case in test_cases:
        # Create mock kontext parameters
        config = KontextConfig()
        config.name = test_case['model_name']
        
        kontext_params = KontextTrainingParameter()
        kontext_params.config = config
        
        task = KontextTrainingTask()
        task.kontext_parameters = kontext_params
        task.detail = {}
        task.start_time = time.time()
        
        task.parse_kontext_progress_line(test_case['line'])
        
        # Verify the model name is correctly used from configuration
        assert task.detail['stage'] == 'training'
        assert task.detail['model_name'] == test_case['model_name']

def test_kontext_training_task_parse_progress_line_no_match():
    """Test that non-matching lines don't update training details incorrectly"""
    # Create mock kontext parameters
    config = KontextConfig()
    config.name = "test_model"
    
    kontext_params = KontextTrainingParameter()
    kontext_params.config = config
    
    task = KontextTrainingTask()
    task.kontext_parameters = kontext_params
    task.detail = {'stage': 'prepare'}
    task.start_time = time.time()
    
    # Test non-matching lines
    non_matching_lines = [
        "Some random log line",
        "different_model:   0%|                                          | 2/3000 [00:06<1:42:04,  2.04s/it, lr: 1.0e-04 loss: 1.628e-01]",
        "Error: Something went wrong",
        "Warning: Low memory"
    ]
    
    for line in non_matching_lines:
        initial_detail = task.detail.copy()
        task.parse_kontext_progress_line(line)
        
        # For non-preparation and non-training lines, detail should remain mostly unchanged
        # except when it's a preparation line
        if not any(keyword in line for keyword in [
            "Loading Flux Kontext model", "Loading transformer", "Loading T5", 
            "Loading CLIP", "Loading VAE", "Making pipe", "Preparing Model",
            "create LoRA network", "Dataset:", "Preprocessing image dimensions",
            "Found", "images", "Bucket sizes", "Caching latents", "Generating baseline samples"
        ]):
            # Should not transition to training stage with different model name
            assert 'current' not in task.detail or task.detail.get('current', 0) == initial_detail.get('current', 0)

def test_kontext_training_task_parse_progress_line_missing_parameters():
    """Test parsing when kontext_parameters is None or missing config"""
    task = KontextTrainingTask()
    task.detail = {}
    task.start_time = time.time()
    
    # Test with None kontext_parameters
    task.kontext_parameters = None
    progress_line = "unknown:   0%|                                          | 2/3000 [00:06<1:42:04,  2.04s/it, lr: 1.0e-04 loss: 1.628e-01]"
    task.parse_kontext_progress_line(progress_line)
    
    # Should use "unknown" as model name and still parse if line matches
    assert task.detail.get('model_name') == 'unknown'
    assert task.detail.get('current') == 2
    
    # Test with kontext_parameters but no config
    kontext_params = KontextTrainingParameter()
    kontext_params.config = None
    task.kontext_parameters = kontext_params
    task.detail = {}
    
    task.parse_kontext_progress_line(progress_line)
    assert task.detail.get('model_name') == 'unknown'