# 打标校验
def tagging_valid(parser):
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


# 文件上传校验
def file_args_valid(parser):
    parser.add_argument(
        "path", type=str, required=True, default="/", help="path is required"
    )
    parser.add_argument("level", type=int, default=0, help="Directory level")
    parser.add_argument(
        "parent_id", type=str, required=True, default="", help="parent_id is required"
    )
