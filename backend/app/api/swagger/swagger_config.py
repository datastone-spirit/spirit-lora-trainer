# 查询目录结构
file_config = {
    "tags": ["Directory"],
    "description": "获取指定目录下的当前层级的文件和目录结构，支持懒加载",
    "parameters": [
        {
            "name": "parent_id",
            "in": "query",
            "type": "string",
            "required": True,
            "default": "/",
            "description": "父目录路径",
        },
        {
            "name": "path",
            "in": "query",
            "type": "string",
            "required": True,
            "default": "/",
            "description": "请求的子目录路径",
        },
        {
            "name": "level",
            "in": "query",
            "type": "integer",
            "required": False,
            "description": "目录层级，默认值为 0",
            "example": 0,
        },
    ],
    "responses": {
        "200": {
            "description": "返回目录信息",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {
                        "type": "integer",
                        "description": "返回状态码",
                        "example": 0,
                    },
                    "msg": {
                        "type": "string",
                        "description": "返回消息",
                        "example": "ok",
                    },
                    "data": {
                        "type": "object",
                        "properties": {
                            "directories": {
                                "type": "array",
                                "description": "目录列表",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "string",
                                            "description": "目录 ID",
                                            "example": "/subdir1",
                                        },
                                        "label": {
                                            "type": "string",
                                            "description": "目录名称",
                                            "example": "subdir1",
                                        },
                                        "isLeaf": {
                                            "type": "boolean",
                                            "description": "是否为叶子节点",
                                            "example": False,
                                        },
                                    },
                                },
                            },
                            "files": {
                                "type": "array",
                                "description": "文件列表",
                                "items": {
                                    "type": "object",
                                    "properties": {
                                        "value": {
                                            "type": "string",
                                            "description": "文件 ID",
                                            "example": "/file1.txt",
                                        },
                                        "label": {
                                            "type": "string",
                                            "description": "文件名称",
                                            "example": "file1.txt",
                                        },
                                        "isLeaf": {
                                            "type": "boolean",
                                            "description": "是否为叶子节点",
                                            "example": True,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        }
    },
}
# 文件上传
upload_config = {
    "tags": ["Upload"],
    "description": "上传多个图片文件，支持同时上传多个图片，并返回文件名、文件路径、上传时间等信息，支持查询上传进度",
    "parameters": [
        {
            "name": "files",
            "in": "formData",
            "type": "file",
            "required": True,
            "description": "上传的图片文件，支持同时上传多个文件",
        },
        {
            "name": "upload_path",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "上传的文件路径，用于指定上传的文件存储位置",
        },
        {
            "name": "upload_id",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "由请求方生成的唯一的 upload_id，标识这一批上传的文件",
        },
    ],
    "responses": {
        "200": {
            "description": "文件上传成功",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 0},
                    "msg": {"type": "string", "example": "上传成功"},
                    "data": {
                        "type": "array",
                        "description": "上传的图片信息列表",
                        "items": {
                            "type": "object",
                            "properties": {
                                "filename": {"type": "string", "example": "image1.jpg"},
                                "path": {
                                    "type": "string",
                                    "example": "/uploads/images/image1.jpg",
                                },
                                "upload_time": {
                                    "type": "string",
                                    "example": "2024-12-05T08:30:00",
                                },
                            },
                        },
                    },
                },
            },
        },
        "400": {
            "description": "文件上传失败",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 1},
                    "msg": {"type": "string", "example": "上传失败"},
                },
            },
        },
    },
}

# 上传进度查询
upload_progress_config = {
    "tags": ["Upload"],
    "description": "查询指定文件的上传进度，返回进度信息流。",
    "parameters": [
        {
            "name": "upload_id",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "上传任务的唯一标识，用于查询该文件的上传进度",
        }
    ],
    "responses": {
        "200": {
            "description": "文件上传进度流",
            "content": {
                "text/event-stream": {
                    "schema": {
                        "type": "object",
                        "properties": {
                            "progress": {"type": "integer", "example": 50},
                            "total_size": {"type": "integer", "example": 5000000},
                        },
                    }
                }
            },
        },
        "400": {
            "description": "上传进度查询失败",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 1},
                    "msg": {"type": "string", "example": "查询失败"},
                },
            },
        },
    },
}

tag_config = {
    "tags": ["Training"],
    "description": "打标数据集",
    "parameters": [
        {
            "name": "model_name",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "模型名称，用于选择相应的打标方式",
        },
        {
            "name": "image_path",
            "in": "query",
            "type": "string",
            "required": True,
            "description": "要打标的图片路径",
        },
    ],
    "responses": {
        "200": {
            "description": "返回打标结果",
            "schema": {
                "type": "object",
                "properties": {
                    "code": {"type": "integer", "example": 0},
                    "msg": {"type": "string", "example": "打标成功"},
                    "data": {
                        "type": "array",
                        "description": "打标结果列表",
                        "items": {
                            "type": "object",
                            "properties": {
                                "image_path": {
                                    "type": "string",
                                    "description": "图片路径",
                                    "example": "/images/image1.jpg",
                                },
                                "marking_text": {
                                    "type": "string",
                                    "description": "打标文本信息",
                                    "example": "A beautiful sunset over the mountains.",
                                },
                                "marking_file": {
                                    "type": "string",
                                    "description": "打标文件路径",
                                    "example": "xxx.txt",
                                },
                            },
                        },
                    },
                },
            },
            "400": {
                "description": "打标失败",
                "schema": {
                    "type": "object",
                    "properties": {
                        "code": {"type": "integer", "example": 1},
                        "msg": {"type": "string", "example": "打标失败"},
                    },
                },
            },
        },
    },
}
