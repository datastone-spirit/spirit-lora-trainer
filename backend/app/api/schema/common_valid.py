# 打标校验
def tagging_args_valid(parser):
    parser.add_argument(
        "model_name",
        type=str,
        required=True,
        help="请选择模型",
    )
    parser.add_argument(
        "image_path",
        type=str,
        required=True,
        help="请输入图片路径",
    )

# 手动打标校验
def manual_tagging_args_valid(parser):
    parser.add_argument(
        "image_path",
        type=str,
        required=True,
        help="请选择图片",
    )
    parser.add_argument(
        "caption_text",
        type=str,
        required=True,
        help="请填写打标文案",
    )

# 文件上传校验
def file_args_valid(parser):
    parser.add_argument(
        "path", type=str, required=True, default="/", help="path is required"
    )
    parser.add_argument("level", type=int, default=0, help="Directory level")
    parser.add_argument(
        "parent_id", type=str, required=True, default="", help="parent_id is required"
    )

# 保存配置
def save_config_args_valid(parser):
    parser.add_argument("config_name", type=str, required=True, help="配置名称不能为空")
    parser.add_argument("config_content", type=str, required=True, help="配置内容不能为空")

# 读取配置
def get_config_args_valid(parser):
    parser.add_argument("config_name", type=str, required=True,location="args", help="配置名称不能为空")

# 启动训练
def start_args_valid(parser):
    parser.add_argument(
            "config_name",
            type=str,
            required=True,
            location="json",  # 从请求体中解析配置名称
            help="配置名称不能为空",
        )