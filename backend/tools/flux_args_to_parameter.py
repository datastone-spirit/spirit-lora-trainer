from args2models import init_advanced, loop_advanced_component
from library import flux_train_utils



def to_classe(advanced_component: List) -> str:
    return '@dataclass\nclass TrainingConfig:\n    ' + '\n    '.join(loop_advanced_component(advanced_component))

if __name__ == '__main__':
    print(to_classe(init_advanced(flux_train_network.setup_parser())))