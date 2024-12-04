from flask import jsonify
from flask_restful import Resource, reqparse

sample_data = [
    {
        "image_path": "/images/image1.jpg",
        "marking_text": "A beautiful sunset over the mountains.",
    },
    {"image_path": "/images/image2.jpg", "marking_text": "A dog playing in the park."},
    {
        "image_path": "/images/image3.jpg",
        "marking_text": "A group of people at a concert.",
    },
]


class Marking(Resource):
    def post(self):
        """
        根据模型进行打标

        ---
        parameters:
          - name: model_name
            in: formData
            type: string
            required: true
            description: 模型名称，用于选择相应的打标方式

        responses:
          200:
            description: 返回打标结果
            schema:
              type: array
              items:
                type: object
                properties:
                  image_path:
                    type: string
                    description: 图片路径
                    example: "/images/image1.jpg"
                  marking_text:
                    type: string
                    description: 打标文本信息
                    example: "A beautiful sunset over the mountains."
        """
        # 解析请求参数
        parser = reqparse.RequestParser()
        parser.add_argument(
            "model_name", type=str, required=True, help="Model name cannot be blank"
        )
        args = parser.parse_args()

        model_name = args["model_name"]

        # 根据模型名称，选择不同的打标方式（这里只是示例，实际情况应根据模型进行处理）
        # 这里假设打标过程是预先定义的示例数据
        if model_name:
            result = sample_data  # 返回预定义的示例数据
        else:
            return {"message": "Model name is required"}, 400

        return jsonify(result)
