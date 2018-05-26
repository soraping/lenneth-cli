/**
 * 初始化类
 */
import * as signale from "signale";
import { ValidProjectName } from "./decorators";
export class LennethCliInit {
  /**
   * 创建项目名称
   * @param projectName 项目名称
   */
  @ValidProjectName()
  async createApp(projectName: string) {
    signale.success(`创建新项目目录 ${projectName}`);
  }
}
