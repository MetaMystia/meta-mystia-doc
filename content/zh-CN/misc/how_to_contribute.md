# 贡献MetaMystia文档指南

本文档用于指导您如何在[**meta-mystia-doc**](https://github.com/MetaMystia/meta-mystia-doc)仓库中使用[**mdBook**](https://rust-lang.github.io/mdBook/index.html)编写和维护文档。内容包含基础流程、本地预览方式、目录结构说明以及提交规范说明，适合首次参与贡献的开发者快速上手。

## 一、仓库和工具简介

- **仓库地址**：[https://github.com/MetaMystia/meta-mystia-doc](https://github.com/MetaMystia/meta-mystia-doc)
- **文档工具**：[mdBook](https://rust-lang.github.io/mdBook/index.html)（Rust官方维护的文档生成工具）
- **包管理器**：[pnpm](https://pnpm.io/installation)

mdBook以Markdown作为写作格式，通过`SUMMARY.md`管理文档结构，适合编写结构清晰、可持续维护的技术文档。

如果只修改Markdown内容，可以先克隆仓库后直接编辑。如果还要执行格式化、本地构建或实时预览，则需要提前安装Node.js、pnpm和mdBook。

## 二、基础编写流程（不需要本地实时预览）

如果您只是新增或修改文档内容，不需要在本地实时查看渲染效果，可以使用以下最简单的流程。文档正文按语言存放在`content/<语言>`目录，简体中文是`content/zh-CN`，也是其他语言的翻译源。

### 步骤1：克隆仓库

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
```

### 步骤2：安装依赖（需要在本地检查时）

```bash
pnpm i
```

该步骤用于安装项目的Node.js依赖。纯文本修改可以暂时跳过，但提交前仍建议完成本地格式化和构建检查。

### 步骤 3：新增文档文件

- 在`content/zh-CN`目录下新建子文件夹（用于分类文档）
- 在对应文件夹中新建`.md`文件

示例：

```text
content/zh-CN/
 └─ guide/
    └─ getting_started.md
```

### 步骤4：修改`content/zh-CN/SUMMARY.md`

在`SUMMARY.md`中声明您刚刚创建的文件，使其出现在文档目录中。

如果不在`SUMMARY.md`中声明，该文档不会被mdBook构建和展示。

## 三、带本地实时预览的编写流程

如果您希望在编写文档时实时查看渲染效果，可以使用mdBook的本地服务功能。

### 步骤1-2：克隆仓库并安装依赖

同基础流程：

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
pnpm i
```

### 步骤3：安装mdBook

请根据官方指南安装mdBook：
[https://rust-lang.github.io/mdBook/guide/installation.html](https://rust-lang.github.io/mdBook/guide/installation.html)

### 步骤4：修改`content/zh-CN/SUMMARY.md`

在`SUMMARY.md`中提前声明您计划创建的文档路径，即使对应的`.md`文件尚不存在也没有问题。

### 步骤5：启动本地预览服务

```bash
pnpm i18n:serve
```

该命令会调用mdBook构建并合并五种语言，然后：

- 读取`SUMMARY.md`
- 自动创建不存在的Markdown文件
- 启动本地HTTP服务

终端中会输出一个本地访问地址（通常是`http://localhost:3000`）。

### 步骤6：编辑文档

直接编辑`content/zh-CN`目录下的Markdown文件，保存后浏览器会自动刷新并显示最新内容。

## 四、`SUMMARY.md`文件说明

`SUMMARY.md`用于描述整本文档的结构，作用类似“目录”。

### 基本规则说明

- 使用Markdown列表语法
- 每一项对应一个`.md`文件
- 支持多级嵌套，反映章节层级关系

可以参考mdBook官方文档的写法：
[SUMMARY.md](https://github.com/rust-lang/mdBook/blob/master/guide/src/SUMMARY.md)

请确保：

- 路径和`content/zh-CN`目录中的实际文件路径一致
- 文件名使用小写字母，并使用下划线（snake_case）代替空格

其余语言的目录结构与`content/zh-CN`完全相同，文件名也保持一致，只翻译正文内容。修改中文源文后，请同步更新其他语言，避免各语言版本脱节。

## 五、提交更改和合并请求

### 提交前检查

在仓库根目录执行：

```bash
pnpm format
pnpm i18n:sync
```

`pnpm format`会格式化仓库内受Prettier支持的文件；`pnpm i18n:sync`会用源码构建整个文档站。执行后请检查`git diff`，确认没有带入和本次修改无关的格式变化。

### 提交更改

检查通过后，只暂存和本次任务有关的文件，再创建提交。例如：

```bash
git add content/zh-CN/guide/getting_started.md content/zh-CN/SUMMARY.md
git commit -m "docs: add getting started guide"
```

### 提交消息规范

[**@commitlint/config-conventional**](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)是本仓库使用的提交规范校验标准。

请确保提交信息符合Conventional Commits规范，否则可能无法成功提交。

### 发起合并请求

- 将提交推送到您的Fork分支
- 在GitHub上发起Pull Request
- 简要说明修改内容和目的

## 六、补充建议

- 每个Markdown文件建议只聚焦一个主题，避免内容过于臃肿
- 中英文之间**不需要手动添加空格**。站点的CSS样式会自动处理中文和英文、数字之间的字符间距，请保持Markdown内容的自然书写即可，避免为了排版而插入多余空格

如果您对mdBook的更多高级用法感兴趣，可以查阅官方指南进一步了解主题配置、插件和自定义构建流程。

完成以上步骤后，您就可以顺利地为项目贡献文档了。
