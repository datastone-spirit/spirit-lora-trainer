from argparse  import ArgumentParser
from typing import List, Any, Generator

def init_advanced(parser: ArgumentParser) -> List[dict]:
    # if basic_args
    basic_args = {
    }

    # generate a UI config
    # if not in basic_args, create a simple form
    #parser = flux_train_network.setup_parser()
    #flux_train_utils.add_flux_train_arguments(parser)
    #train_util.add_optimizer_arguments(parser)
    args_info = {}
    for action in parser._actions:
        if action.dest != 'help':  # Skip the default help argument
            # if the dest is included in basic_args
            args_info[action.dest] = {
                "action": action.option_strings,  # Option strings like '--use_8bit_adam'
                "type": action.type,              # Type of the argument
                "help": action.help,              # Help message
                "default": action.default,        # Default value, if any
                "required": action.required       # Whether the argument is required
            }
    temp = []
    for key in args_info:
        temp.append({ 'key': key, 'action': args_info[key] })
    temp.sort(key=lambda x: x['key'])
    advanced_component = []
    for item in temp:
        key = item['key']
        action = item['action']
        action_type = str(action['type'])
        advanced_component.append({
            'key': key,
            'action': action['action'],
            'type': action_type,
            'help': action['help'].split('/')[0].strip(),  # Remove the part after the first '/'
            'default': action['default'],
        })
    return advanced_component

def loop_advanced_component(advanced_component: List) :
    for item in advanced_component:
        key = item['key']
        action = item['action']
        action_type = item['type']
        help = item['help']
        if action_type is str or action_type == "<class 'str'>":
            default_value = item['default'] if item['default'] is None else f'"{item["default"]}"'
            yield f'{key}: str  = "{default_value}" # {help}'
        elif action_type is int or action_type == "<class 'int'>":
            default_value = item['default'] 
            yield f'{key}: int = {default_value} # {help}'
        elif action_type is float or action_type == "<class 'float'>":
            default_value = item['default'] 
            yield f'{key}: float = {default_value} # {help}'
        elif action_type is bool or action_type == "<class 'bool'>":
            default_value = False if item['default'] is None else item['default']
            yield f'{key}: bool = {default_value} # {help}'
        elif item['default'] is None: 
          yield f'{key} = None # {help}'
        else:
            if isinstance(item['default'], str):
                yield f'{key}: str = "{item["default"]}" # {help}'
            elif isinstance(item['default'], bool): 
                yield f'{key}: bool = {item["default"]} # {help}'
            elif isinstance(item['default'], int):
                yield f'{key}: int = {item["default"]} # {help}'
            elif isinstance(item['default'], float):
                yield f'{key}: float = {item["default"]} # {help}'
            else:
                yield f'{key}: {action_type} = {item["default"]} # {item["help"]}' 