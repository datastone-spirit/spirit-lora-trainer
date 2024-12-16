from flask_restful import Resource, reqparse
from ..common.utils import use_swagger_config,res
from ..swagger.swagger_config import tag_config,tag_manual_config
from ..schema.common_valid import tagging_args_valid, manual_tagging_args_valid
from app.service.tagging import TaggingService

is_processing = False

class Tagging(Resource):
    @use_swagger_config(tag_config)
    def post(self):
        """
        自动打标数据集
        """
        global is_processing
        if is_processing:
            return res(success=False,message="正在打标，请稍后再试")
        try:
            is_processing = True
        
            parser = reqparse.RequestParser()
            tagging_args_valid(parser)
            args = parser.parse_args()

            # todo 增加joycaption模型反推，现在默认florence2
            model_name = args["model_name"]
            image_path = args["image_path"]
            images = TaggingService().load_images_from_directory(image_path)
            resule = TaggingService().run_captioning(images,image_path)
            return res(success=True, data=resule)
        except Exception as e:
            # 异常处理可以记录日志等
            return res(success=False, data=str(e))
        finally:
             is_processing = False


    
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
        return TaggingService().manual_captioning(image_path, caption_text)

    