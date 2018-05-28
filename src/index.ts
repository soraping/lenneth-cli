import * as program from "commander";
import { LennethCliInit } from "./init";
import { ILennethError, LennethCliError } from "./error";
import { logger } from "./log";
const packAge = require("../package");

try {
  program
    .version(packAge.version, "-v, --version")
    .usage("<command> [项目名称]")
    .command("init <projectName>")
    .action(projectName => {
      new LennethCliInit().createProjectName(projectName);
    })
    .alias("i")
    .description("lenneth init myapp");
  program.parse(process.argv);
} catch (e) {
  logger.error(e["message"]);
}
