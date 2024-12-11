import typing
from dataclasses import dataclass

T = typing.TypeVar('T')


@dataclass
class Model:

    def _from_dict(self, d=None):
        if d is not None:
            for key, value in d.items():
                setattr(self, key, value)

