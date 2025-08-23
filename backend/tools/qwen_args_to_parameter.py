from args2models import init_advanced, loop_advanced_component
from musubi_tuner.hv_train_network import setup_parser_common
from musubi_tuner.qwen_image_train_network import qwen_image_setup_parser
from typing import List




def to_classe(advanced_component: List) -> str:
    return '@dataclass\nclass QWenImageTrainingConfig:\n    ' + '\n    '.join(loop_advanced_component(advanced_component))

if __name__ == '__main__':
    print(to_classe(init_advanced(qwen_image_setup_parser(setup_parser_common()))))