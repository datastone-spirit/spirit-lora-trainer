import pathlib
import logging


def getmodelpath() -> str:
     return  getprojectpath() + "/models"


def getprojectpath() -> str:
     return str(pathlib.Path(__file__).parent.parent)

def setup_logging(args=None, log_level=None, reset=False):
     if logging.root.handlers:
          if reset:
            # remove all handlers
               for handler in logging.root.handlers[:]:
                    logging.root.removeHandler(handler)
          else:
               return

    # log_level can be set by the caller or by the args, the caller has priority. If not set, use INFO
     if log_level is None:
        log_level = "INFO"
     log_level = getattr(logging, log_level)
     msg_init = None
     handler = None
     try:
          from rich.logging import RichHandler
          from rich.console import Console
          from rich.logging import RichHandler

          handler = RichHandler(console=Console(stderr=True))
     except ImportError:
            # print("rich is not installed, using basic logging")
            msg_init = "rich is not installed, using basic logging"

     if handler is None:
          handler = logging.StreamHandler(sys.stdout)  # same as print
          handler.propagate = False

     formatter = logging.Formatter(
        fmt="%(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
     )
     handler.setFormatter(formatter)
     logging.root.setLevel(log_level)
     logging.root.addHandler(handler)

     if msg_init is not None:
        logger = logging.getLogger(__name__)
        logger.info(msg_init)

