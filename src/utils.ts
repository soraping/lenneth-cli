import * as glob from "glob";
import * as path from "path";
import * as fs from "fs";

/**
 * 目录名是否存在
 * @param projectName
 */
export const directoryIsOnly = projectName => {
  const list = glob.sync("*");
  let cwd = path.basename(process.cwd());
  if (list.length) {
    let fileList = list.filter(name => {
      const fileName = path.resolve(process.cwd(), path.join(".", name));
      const isDir = fs.statSync(fileName).isDirectory();
      return isDir && name.indexOf(projectName) !== -1;
    });
    if (fileList.length !== 0) {
      return false;
    }
    cwd = projectName;
  }
  return path.resolve(process.cwd(), cwd);
};
