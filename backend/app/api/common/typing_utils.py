import sys

def is_generic(klass):
    """ Determine whether klass is a generic class """
    return hasattr(klass, '__origin__')

def is_dict(klass):
    """ Determine whether klass is a Dict """
    return klass.__origin__ == dict

def is_list(klass):
    """ Determine whether klass is a List """
    return klass.__origin__ == list
