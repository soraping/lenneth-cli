export interface ILennethError {
  message: string;
  code: string | number;
}
/**
 * 错误处理
 */
export class LennethCliError extends Error {
  code: string | number;
  constructor(err: ILennethError) {
    super();
    this.message = err.message;
    this.code = err.code;
  }
}

export enum ErrorCode {
  E1001 = "请输入项目名称",
  E1002 = "项目名称已存在",
  E1003 = "下载git模版失败"
}
