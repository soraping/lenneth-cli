/**
 * 校验项目名称，该文件夹下是否重名
 */
import { LennethCliError } from "./error";
export const ValidProjectName = () => {
  return (
    target: any,
    propertyName: string,
    descriptor: TypedPropertyDescriptor<Function>
  ) => {
    let value = descriptor.value;
    descriptor.value = () => {
      //项目名称
      let projectName = arguments[0];
      if (!projectName) return console.error("请输入项目名称");
      // 重名检测

      return value.apply(this, arguments);
    };
  };
};
