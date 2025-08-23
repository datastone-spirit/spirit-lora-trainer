#!/bin/bash

set -e

SCRIPTPATH=$(dirname $(realpath ${BASH_SOURCE[0]}))

MUSUBI_TUNER_HOME=${SCRIPTPATH}/../musubi-tuner

export PYTHONPATH=${MUSUBI_TUNER_HOME}:${MUSUBI_TUNER_HOME}/src
source ${MUSUBI_TUNER_HOME}/venv/bin/activate

cd ${MUSUBI_TUNER_HOME}/

python ${SCRIPTPATH}/$@
