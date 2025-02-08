from flask import request
from flask_restful import Resource, reqparse
from ..common.utils import use_swagger_config,res
from ..swagger.swagger_config import tag_config,tag_manual_config
from ..schema.common_valid import tagging_args_valid, manual_tagging_args_valid
from app.service.captioning import CaptioningService
from task.task import Task 

is_processing = False
from utils.util import setup_logging, pathFormat
setup_logging()
import logging
logger = logging.getLogger(__name__)

class Tagging(Resource):
    @use_swagger_config(tag_config)
    def post(self):
        """
        自动打标数据集
        """
        model_name = ""
        image_path = ""
        try:
        
            json = request.get_json()
            # todo 增加joycaption模型反推，现在默认florence2
            model_name = json["model_name"]
            image_path = json["image_path"]
            class_token = json.get("class_token", None)
            prompt_type = json.get("prompt_type", None)
            global_prompt = json.get("global_prompt", None)
            is_append = json.get("is_append", False)
            images = CaptioningService().load_images_from_directory(image_path)
            result = CaptioningService().run_captioning(images,image_path, 
                                                        model_name=model_name, 
                                                        class_token=class_token, 
                                                        prompt_type=prompt_type,
                                                        global_prompt=global_prompt,
                                                        is_append=is_append)
            if isinstance(result, Task):
                return res(data={"task_id": result.id}, message=f"task {result.id} started successfully.")
                
            return res(success=True, data=result)
        except ValueError as ve:
            return res(success=False, message=f"captioning failed : {ve}",code=400)
        except Exception as e:
            # 异常处理可以记录日志等
            logger.warning(f"runing captioning with model:{model_name}, and image_path{image_path} error", exc_info=e)
            return res(success=False, message=f"Server Internal Error: {e}",code=500)


    
class ManualTagging(Resource):
    @use_swagger_config(tag_manual_config)
    def post(self):
        """
        手动打标数据集
        """
        parser = reqparse.RequestParser()
        manual_tagging_args_valid(parser)
        args = parser.parse_args()
        image_path = args["image_path"] 
        caption_text = args["caption_text"]

        if not image_path or not caption_text:
            return res(success=False, message="Invalid parameters. `image_path` and `caption_text` are required.")

        # 手动打标
        return CaptioningService().manual_captioning(pathFormat(image_path), caption_text)

    