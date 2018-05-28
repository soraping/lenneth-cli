/**
 * 初始化类
 */
import { resolve, basename } from "path";
import * as download from "git-downloader";
import * as ora from "ora";
import * as inquirer from "inquirer";
import { logger } from "./log";
import { ValidProjectName } from "./decorators";
import { LennethCliError, ErrorCode } from "./error";

interface IProjectInfo {
  projectName?: string;
  projectVersion?: string;
  projectDescription?: string;
}

export class LennethCliInit {
  /**
   * 创建项目名称
   * @param project 项目路径
   */
  @ValidProjectName()
  async createProjectName(project: string) {
    //创建目录
    try {
      await this.downGitTemplate(project);
      // 获取交互数据
      let projectInfo = await this.inquirerShell(basename(project));
      console.log(projectInfo);
    } catch (e) {
      logger.error(e);
    }
  }

  /**
   * 下载git模版
   * @param project 项目路径
   */
  async downGitTemplate(project: string) {
    const templateUrl = "https://github.com/soraping/lenneth-demo.git";
    const spinner = ora(`下载模版项目git地址 => ${templateUrl}`);
    spinner.start();
    return new Promise((resolve, reject) => {
      download({ source: templateUrl, destination: project })
        .then(() => {
          spinner.succeed();
          logger.success(`工程模版下载成功, 文件夹路径 => ${project}`);
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
}
