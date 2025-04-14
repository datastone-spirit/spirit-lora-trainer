#!/bin/bash

set -e

SCRIPTPATH=$(dirname $(realpath ${BASH_SOURCE[0]}))

export PYTHONPATH=${SCRIPTPATH}/../musubi-tuner
source ${PYTHONPATH}/venv/bin/activate

cd ${PYTHONPATH}/

python ${SCRIPTPATH}/wan_args_to_parameter.py