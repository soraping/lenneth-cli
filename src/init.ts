/**
 * 初始化类
 */
import * as path from "path";
import * as fs from "fs";
import * as Download from "git-downloader";
import * as Ora from "ora";
import * as Inquirer from "inquirer";
import * as Minimatch from "minimatch";
import * as Metalsmith from "metalsmith";
import * as Handlebars from "handlebars";
import { logger } from "./log";
import { ValidProjectName } from "./decorators";
import { LennethCliError, ErrorCode } from "./error";
import { path_resolve } from "./utils";

interface IProjectInfo {
  projectName?: string;
  projectVersion?: string;
  projectDescription?: string;
  projectSource?: string;
}

export class LennethCliInit {
  /**
   * 创建项目名称
   */
  @ValidProjectName()
  async createProjectName(projectName: string) {
    //创建目录
    try {
      let projectSource = await this.downGitTemplate(projectName);
      // 获取交互数据
      let projectInfo = await this.inquirerShell(projectName);
      await this.generatorTemplate(
        Object.assign(projectInfo, { projectSource })
      );
    } catch (e) {
      logger.error(e);
    }
  }

  /**
   * 下载git模版
   * @param project 工程
   */
  async downGitTemplate(projectName: string) {
    const templateUrl = "https://e.coding.net/soraping/lenneth-template.git";
    const spinner = Ora(`下载模版项目git地址 => ${templateUrl}`);
    spinner.start();
    return new Promise((resolve, reject) => {
      Download({ source: templateUrl, destination: projectName })
        .then(() => {
          spinner.succeed();
          logger.success(
            `工程模版下载成功，路径 => ${path_resolve(projectName)}`
          );
          resolve(path_resolve(projectName));
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
      Inquirer.prompt([
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
      ]).then(answers => {
        resolve(answers);
      });
    });
  }

  /**
   * 生成模版，替换关键字段
   * @param projectInfo
   */
  async generatorTemplate(projectInfo: IProjectInfo) {
    const metalsmith = Metalsmith(process.cwd())
      .metadata(projectInfo)
      .clean(false)
      .source(projectInfo.projectSource)
      .destination(projectInfo.projectSource);

    // 获取ignore文件
    const ignoreFile = path.join(__dirname, "templates.ignore");
    if (fs.existsSync(ignoreFile)) {
      metalsmith.use((files, metalsmith, done) => {
        const meta = metalsmith.metadata();
        const ignores = Handlebars.compile(
          fs.readFileSync(ignoreFile).toString()
        )(meta)
          .split("\n")
          .filter(item => !!item.length);
        Object.keys(files).forEach(fileName => {
          // 移除被忽略的文件
          ignores.forEach(ignorePattern => {
            if (Minimatch(fileName, ignorePattern)) {
              delete files[fileName];
            }
          });
        });
        done();
      });
    }

    metalsmith
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata();
        Object.keys(files).forEach(fileName => {
          const t = files[fileName].contents.toString();
          files[fileName].contents = new Buffer(Handlebars.compile(t)(meta));
        });
        done();
      })
      .build(err => {
        if (err) {
          logger.error(err);
        } else {
          logger.success(`工程 ${projectInfo.projectName} 新建完成`);
        }
      });
  }
}
