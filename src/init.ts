/**
 * 初始化类
 */
import * as download from "git-downloader";
import * as ora from "ora";
import * as inquirer from "inquirer";
import { logger } from "./log";
import { ValidProjectName } from "./decorators";
import { LennethCliError, ErrorCode } from "./error";
import { path_resolve } from "./utils";

interface IProjectInfo {
  projectName?: string;
  projectVersion?: string;
  projectDescription?: string;
}

export class LennethCliInit {
  /**
   * 创建项目名称
   */
  @ValidProjectName()
  async createProjectName(projectName: string) {
    //创建目录
    try {
      await this.downGitTemplate(projectName);
      // 获取交互数据
      let projectInfo = await this.inquirerShell(projectName);
      await this.generatorTemplate(projectInfo);
    } catch (e) {
      logger.error(e);
    }
  }

  /**
   * 下载git模版
   * @param project 工程
   */
  async downGitTemplate(projectName: string) {
    const templateUrl = "https://github.com/soraping/lenneth-demo.git";
    const spinner = ora(`下载模版项目git地址 => ${templateUrl}`);
    spinner.start();
    return new Promise((resolve, reject) => {
      download({ source: templateUrl, destination: projectName })
        .then(() => {
          spinner.succeed();
          logger.success(
            `工程模版下载成功，路径 => ${path_resolve(projectName)}`
          );
          resolve(1);
        })
        .catch(e => {
          spinner.fail();
          reject(ErrorCode.E1003);
        });
    });
  }

  /**
   * shell交互
   * @param projectName
   */
  async inquirerShell(projectName: string): Promise<IProjectInfo> {
    return new Promise((resolve, reject) => {
      inquirer
        .prompt([
          {
            name: "projectName",
            message: "项目的名称",
            default: projectName
          },
          {
            name: "projectVersion",
            message: "项目的版本号",
            default: "0.0.1"
          },
          {
            name: "projectDescription",
            message: "项目的简介",
            default: `A project named ${projectName}`
          }
        ])
        .then(answers => {
          resolve(answers);
        });
    });
  }

  /**
   * 生成模版
   * @param projectInfo
   */
  async generatorTemplate(projectInfo: IProjectInfo) {}
}
