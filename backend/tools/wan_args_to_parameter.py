from args2models import init_advanced, loop_advanced_component
from hv_train_network import setup_parser_common
from wan_train_network import wan_setup_parser
from typing import List




def to_classe(advanced_component: List) -> str:
    return '@dataclass\nclass WanI2VTrainingConfig:\n    ' + '\n    '.join(loop_advanced_component(advanced_component))

if __name__ == '__main__':
    print(to_classe(init_advanced(wan_setup_parser(setup_parser_common()))))