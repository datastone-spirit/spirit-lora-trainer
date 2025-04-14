import dacite
from typing import Tuple
from flask import request
from flask_restful import Resource
from app.service.wan_dataset import WanDatasetService
from app.api.common.utils import use_swagger_config, res
from app.api.model.wan_paramter import WanDataSetConfig, FrameExtractionMethod
from app.api.swagger.swagger_config import wan_dataset_estimate

from utils.util import setup_logging
setup_logging()
import logging
logger = logging.getLogger(__name__)

class WanDatasets(Resource):
    
    @use_swagger_config(wan_dataset_estimate)
    def post(self):
        data = request.get_json()
        dataset = dacite.from_dict(data_class=WanDataSetConfig, data=data, 
                        config=dacite.Config(
                            type_hooks={
                                Tuple[int, int]: lambda x: tuple(x), 
                                FrameExtractionMethod: lambda x: FrameExtractionMethod(x) if x else None
                            }
                        )
                    )
        try:
            total_images, total_batches = WanDatasetService().eastimate_video_dataset_count(dataset)  
            return res(data={"total_images": total_images, "total_batches": total_batches},)
        except Exception as e:
            logger.error(f"eastimate frame in dataset {data} failed ", exc_info=e)
            return res(message=f"Server interal error: {str(e)}", code=500)