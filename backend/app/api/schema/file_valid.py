def file_args_valid(parser):
    parser.add_argument("parent_id", type=str, required=True)
    parser.add_argument("token", type=str, required=True)
