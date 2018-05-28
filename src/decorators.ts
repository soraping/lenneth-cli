/**
 * 校验项目名称，该文件夹下是否重名
 * @return 新建项目全路径
 */
import { LennethCliError, ErrorCode } from "./error";
import { directoryIsOnly } from "./utils";
import { logger } from "./log";
export const ValidProjectName = (): Function => {
  return (
    target: any,
    propertyName: string,
    descriptor: PropertyDescriptor
  ) => {
    let oldValue = descriptor.value;
    // 此处不要用箭头函数，有巨坑
    descriptor.value = function() {
      // 新建项目名称
      let projectName = arguments[0];
      logger.info(`当前工作目录 => ${process.cwd()}`);
      logger.debug(`检测工程名称是否有效 => ${projectName}`);
      //项目名称
      if (!projectName) {
        throw new LennethCliError({
          message: ErrorCode.E1001,
          code: "E1001"
        });
      }
      // 重名检测
      if (!directoryIsOnly(projectName)) {
        throw new LennethCliError({
          message: ErrorCode.E1002,
          code: "E1002"
        });
      }
      logger.info(
        `工程目录名称有效，正在工作目录下创建新项目 => ${projectName}`
      );
      logger.info(`新建工程目录全路径 => ${directoryIsOnly(projectName)}`);
      // 参数重置
      arguments[0] = directoryIsOnly(projectName);
      return oldValue.apply(this, arguments);
    };
    return descriptor;
  };
};
