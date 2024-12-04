import os
from flask import request
from werkzeug.utils import secure_filename
from flask_restful import Resource
from ..common.utils import res, allowed_file


class Upload(Resource):
    def post(self):
        """
        上传文件

        ---
        parameters:
          - name: file
            in: formData
            type: file
            required: true
            description: 上传的文件

        responses:
          200:
            description: 文件上传成功
            schema:
              type: object
              properties:
                code:
                  type: integer
                  description: 返回状态码
                  example: 0
                msg:
                  type: string
                  description: 返回消息
                  example: "File uploaded successfully"
        """
        # 判断请求是否包含文件
        if "file" not in request.files:
            return {"message": "No file part"}, 400

        file = request.files["file"]

        # 如果用户没有选择文件，浏览器提交的是一个空文件
        if file.filename == "":
            return {"message": "No selected file"}, 400

        # 如果文件格式合法，保存文件
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join("uploads/", filename))
            return {
                "success": True,
                "msg": "File uploaded successfully",
                "filename": filename,
            }, 200
        else:
            return {"message": "File type not allowed"}, 400
