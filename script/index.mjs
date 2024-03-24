import path from "node:path";
import inquirer from "inquirer";
import { fileURLToPath } from "url";
import { cp } from "node:fs/promises";

export default async function (templateName, projectName) {
  // 当前脚本执行路径
  const cwd = process.cwd();
  // 脚本文件的源路径
  const originPath = path.dirname(fileURLToPath(import.meta.url));
  // 模版文件目录
  const templateDir = path.join(originPath, "../templates");

  try {
    const templatePath = path.join(templateDir, templateName);
    const targetPath = path.join(cwd, projectName);

    await cp(templatePath, targetPath, {
      recursive: true,
      errorOnExist: true,
      force: false,
    }).catch(async (err) => {
      if (err.code === "ERR_FS_CP_EEXIST") {
        const { override } = await inquirer.prompt({
          type: "confirm",
          name: "override",
          message: "目录已存在，是否覆盖？",
        });
        override
          ? await cp(templatePath, targetPath, { recursive: true })
          : process.exit(1);
      }
    });
  } catch (err) {
    console.error(err);
  }
}
