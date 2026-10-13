# Guide to contributing to the MetaMystia documentation

This document explains how to write and maintain the documentation in the [**meta-mystia-doc**](https://github.com/MetaMystia/meta-mystia-doc) repository with [**mdBook**](https://rust-lang.github.io/mdBook/index.html). It covers the basic workflow, local preview, the directory structure, and the commit conventions, so first-time contributors can get started quickly.

## 1. Repository and tools

- **Repository**: [https://github.com/MetaMystia/meta-mystia-doc](https://github.com/MetaMystia/meta-mystia-doc)
- **Documentation tool**: [mdBook](https://rust-lang.github.io/mdBook/index.html) (the documentation generator maintained by the Rust project)
- **Package manager**: [pnpm](https://pnpm.io/installation)

mdBook uses Markdown as its writing format and manages the document structure through `SUMMARY.md`, which suits clear, maintainable technical documentation.

If you only change Markdown content, you can clone the repository and edit directly. If you also want formatting, local builds, or live preview, install Node.js, pnpm, and mdBook first.

## 2. Basic writing workflow (no local live preview)

If you only add or modify documentation content and do not need to see the rendered result locally, use the simplest workflow below. The documentation text is stored per language under `content/<language>`; Simplified Chinese is `content/zh-CN`, and it is also the translation source for the other languages.

### Step 1: Clone the repository

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
```

### Step 2: Install dependencies (when you need to check locally)

```bash
pnpm i
```

This installs the project's Node.js dependencies. You can skip it for pure text changes, but running the local formatting and build checks before submitting is still recommended.

### Step 3: Add documentation files

- Create a subfolder under `content/zh-CN` (to categorize documents)
- Create a `.md` file in the corresponding folder

Example:

```text
content/zh-CN/
 └─ guide/
    └─ getting_started.md
```

### Step 4: Edit `content/zh-CN/SUMMARY.md`

Declare the file you just created in `SUMMARY.md` so that it appears in the documentation's table of contents.

If you do not declare it in `SUMMARY.md`, mdBook will not build or show the document.

## 3. Writing workflow with local live preview

If you want to see the rendered result while writing, use mdBook's local server.

### Steps 1-2: Clone the repository and install dependencies

Same as the basic workflow:

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
pnpm i
```

### Step 3: Install mdBook

Follow the official guide:
[https://rust-lang.github.io/mdBook/guide/installation.html](https://rust-lang.github.io/mdBook/guide/installation.html)

### Step 4: Edit `content/zh-CN/SUMMARY.md`

Declare the document paths you plan to create in `SUMMARY.md` in advance; it is fine if the `.md` files do not exist yet.

### Step 5: Start the local preview server

```bash
pnpm i18n:serve
```

The command builds and merges all five languages with mdBook, and then:

- reads `SUMMARY.md`
- automatically creates missing Markdown files
- starts a local HTTP server

The terminal prints a local address (usually `http://localhost:3000`).

### Step 6: Edit the documentation

Edit the Markdown files under `content/zh-CN` directly; after you save, the browser refreshes automatically and shows the latest content.

## 4. About `SUMMARY.md`

`SUMMARY.md` describes the structure of the whole book; it works like a table of contents.

### Basic rules

- Use Markdown list syntax
- Each entry corresponds to one `.md` file
- Multiple nesting levels are supported and reflect the chapter hierarchy

See mdBook's official documentation for examples:
[SUMMARY.md](https://github.com/rust-lang/mdBook/blob/master/guide/src/SUMMARY.md)

Make sure that:

- the paths match the actual file paths under `content/zh-CN`
- file names use lowercase letters and underscores (snake_case) instead of spaces

The other languages use exactly the same directory structure and file names as `content/zh-CN`; only the body text is translated. After you change the Chinese source, update the other languages as well so the versions do not drift apart.

## 5. Committing changes and open pull requests

### Checks before committing

Run these in the repository root:

```bash
pnpm format
pnpm i18n:sync
```

`pnpm format` formats the files in the repository that Prettier supports; `pnpm i18n:sync` builds the whole documentation site from source. Afterwards, check `git diff` to make sure no formatting changes unrelated to your edit were introduced.

### Committing changes

Once the checks pass, stage only the files related to your task and create a commit. For example:

```bash
git add content/zh-CN/guide/getting_started.md content/zh-CN/SUMMARY.md
git commit -m "docs: add getting started guide"
```

### Commit message conventions

[**@commitlint/config-conventional**](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional) is the commit convention this repository validates against.

Make sure your commit message follows Conventional Commits, or the commit may be rejected.

### Opening a pull request

- Push the commits to your fork
- Open a pull request on GitHub
- Briefly describe what you changed and why

## 6. Additional advice

- Keep each Markdown file focused on a single topic to avoid bloated content
- You do **not** need to add spaces between Chinese and Latin text manually. The site's CSS handles the spacing between Chinese characters, Latin letters, and digits automatically, so write naturally and avoid inserting extra spaces for layout

If you are interested in more advanced mdBook features, see the official guide for theme configuration, plugins, and custom build flows.

Once you have completed the steps above, you are ready to contribute documentation to the project.
