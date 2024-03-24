#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import path from "node:path";
import fs from "node:fs";
import { readdir } from "node:fs/promises";
import { fileURLToPath } from "url";
import execScript from "../script/index.mjs";
const program = new Command();

const init = async () => {
  const originPath = path.dirname(fileURLToPath(import.meta.url));
  const packagePath = path.join(originPath, "../package.json");
  const packageData = JSON.parse(fs.readFileSync(packagePath, "utf-8"));
  const templates = await readdir(path.join(originPath, "../templates"));
  // 定义当前版本，通过 command 设置 -v 和 --version 参数输出版本号
  program.option("-v, --version").action(() => {
    console.log(`v${packageData.version}`);
  });

  // 通过 inquirer 进行问答，设置 create 命令开始创建模板
  program
    .command("create")
    .description("创建模版")
    .action(async () => {
      // 命名项目
      const { templateName, projectName } = await inquirer.prompt([
        {
          prefix: "",
          type: "input",
          name: "projectName",
          message: "✏️请输入项目名称：",
        },
        {
          type: "list",
          name: "templateName",
          choices: templates,
          message: "请选择项目模版：",
        },
      ]);

      if (templateName === "vue-ts-vite") {
        const { plateform } = await inquirer.prompt([
          {
            type: "checkbox",
            name: "plateform",
            choices: ["mp-weixin", "h5", "app", "app-plus"],
            message: "请选择需要编译的平台：",
          },
        ]);
        console.log("[ plateform ] >", plateform);
        await execScript(templateName, projectName);
      }

      console.log(chalk.greenBright("⚡️项目名称：", projectName));
      console.log(chalk.greenBright("⚡️模版名称：", templateName));
    });

  // 解析用户执行命令传入参数
  program.parse(process.argv);
};

init().catch((e) => {
  console.error(e);
});
