import * as program from "commander";
import { LennethCliInit } from "./init";
const packAge = require("../package");

program
  .version(packAge.version, "-v, --version")
  .usage("<command> [项目名称]")
  .command("init <projectName>")
  .action(projectName => {
    new LennethCliInit().createApp(projectName);
  })
  .alias("i")
  .description("lenneth init myapp");

program.parse(process.argv);
