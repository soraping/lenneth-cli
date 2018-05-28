import chalk from "chalk";
const { Signale } = require("signale");

const options = {
  stream: process.stdout,
  scope: "lenneth"
};

const log = new Signale(options);

log.config({
  displayTimestamp: true,
  displayDate: true
});

class Logger {
  warn(msg) {
    log.warn(chalk.yellow(msg));
  }
  success(msg) {
    log.success(chalk.green(msg));
  }
  info(msg) {
    log.info(chalk.blue(msg));
  }
  error(msg) {
    log.error(chalk.red(msg));
  }
  debug(msg) {
    log.debug(chalk.cyan(msg));
  }
}

export const logger = new Logger();
