# 貢獻MetaMystia文件指南

本文件用於指導您如何在[**meta-mystia-doc**](https://github.com/MetaMystia/meta-mystia-doc)倉庫中使用[**mdBook**](https://rust-lang.github.io/mdBook/index.html)撰寫和維護文件。內容包含基礎流程、本機預覽方式、目錄結構說明以及提交規範說明，適合首次參與貢獻的開發者快速上手。

## 一、倉庫和工具簡介

- **倉庫位址**：[https://github.com/MetaMystia/meta-mystia-doc](https://github.com/MetaMystia/meta-mystia-doc)
- **文件工具**：[mdBook](https://rust-lang.github.io/mdBook/index.html)（Rust官方維護的文件產生工具）
- **套件管理器**：[pnpm](https://pnpm.io/installation)

mdBook以Markdown作為寫作格式，透過`SUMMARY.md`管理文件結構，適合撰寫結構清晰、可持續維護的技術文件。

如果只修改Markdown內容，可以先複製倉庫後直接編輯。如果還要執行格式化、本機建置或即時預覽，則需要提前安裝Node.js、pnpm和mdBook。

## 二、基礎撰寫流程（不需要本機即時預覽）

如果您只是新增或修改文件內容，不需要在本機即時查看呈現效果，可以使用以下最簡單的流程。文件正文按語言存放在`content/<語言>`目錄，簡體中文是`content/zh-CN`，也是其他語言的翻譯來源。

### 步驟1：複製倉庫

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
```

### 步驟2：安裝相依套件（需要在本機檢查時）

```bash
pnpm i
```

該步驟用於安裝專案的Node.js相依套件。純文字修改可以暫時跳過，但提交前仍建議完成本機格式化和建置檢查。

### 步驟 3：新增文件檔案

- 在`content/zh-CN`目錄下新增子資料夾（用於分類文件）
- 在對應資料夾中新增`.md`檔案

範例：

```text
content/zh-CN/
 └─ guide/
    └─ getting_started.md
```

### 步驟4：修改`content/zh-CN/SUMMARY.md`

在`SUMMARY.md`中宣告您剛剛建立的檔案，使其出現在文件目錄中。

如果不在`SUMMARY.md`中宣告，該文件不會被mdBook建置和展示。

## 三、帶本機即時預覽的撰寫流程

如果您希望在撰寫文件時即時查看呈現效果，可以使用mdBook的本機服務功能。

### 步驟1-2：複製倉庫並安裝相依套件

同基礎流程：

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
pnpm i
```

### 步驟3：安裝mdBook

請根據官方指南安裝mdBook：
[https://rust-lang.github.io/mdBook/guide/installation.html](https://rust-lang.github.io/mdBook/guide/installation.html)

### 步驟4：修改`content/zh-CN/SUMMARY.md`

在`SUMMARY.md`中提前宣告您計畫建立的文件路徑，即使對應的`.md`檔案尚不存在也沒有問題。

### 步驟5：啟動本機預覽服務

```bash
pnpm i18n:serve
```

該指令會呼叫mdBook建置並合併五種語言，然後：

- 讀取`SUMMARY.md`
- 自動建立不存在的Markdown檔案
- 啟動本機HTTP服務

終端中會輸出一個本機存取位址（通常是`http://localhost:3000`）。

### 步驟6：編輯文件

直接編輯`content/zh-CN`目錄下的Markdown檔案，儲存後瀏覽器會自動重新整理並顯示最新內容。

## 四、`SUMMARY.md`檔案說明

`SUMMARY.md`用於描述整本文件的結構，作用類似「目錄」。

### 基本規則說明

- 使用Markdown列表語法
- 每一項對應一個`.md`檔案
- 支援多層巢狀，反映章節層級關係

可以參考mdBook官方文件的寫法：
[SUMMARY.md](https://github.com/rust-lang/mdBook/blob/master/guide/src/SUMMARY.md)

請確保：

- 路徑和`content/zh-CN`目錄中的實際檔案路徑一致
- 檔案名稱使用小寫字母，並使用底線（snake_case）代替空格

其餘語言的目錄結構與`content/zh-CN`完全相同，檔案名稱也保持一致，只翻譯正文內容。修改中文原文後，請同步更新其他語言，避免各語言版本脫節。

## 五、提交變更和合併請求

### 提交前檢查

在倉庫根目錄執行：

```bash
pnpm format
pnpm i18n:sync
```

`pnpm format`會格式化倉庫內受Prettier支援的檔案；`pnpm i18n:sync`會用原始碼建置整個文件站。執行後請檢查`git diff`，確認沒有帶入和本次修改無關的格式變化。

### 提交變更

檢查通過後，只暫存和本次任務有關的檔案，再建立提交。例如：

```bash
git add content/zh-CN/guide/getting_started.md content/zh-CN/SUMMARY.md
git commit -m "docs: add getting started guide"
```

### 提交訊息規範

[**@commitlint/config-conventional**](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)是本倉庫使用的提交規範驗證標準。

請確保提交訊息符合Conventional Commits規範，否則可能無法成功提交。

### 發起合併請求

- 將提交推送到您的Fork分支
- 在GitHub上發起Pull Request
- 簡要說明修改內容和目的

## 六、補充建議

- 每個Markdown檔案建議只聚焦一個主題，避免內容過於臃腫
- 中英文之間**不需要手動加入空格**。站點的CSS樣式會自動處理中文和英文、數字之間的字符間距，請保持Markdown內容的自然書寫即可，避免為了排版而插入多餘空格

如果您對mdBook的更多進階用法感興趣，可以查閱官方指南進一步了解主題設定、外掛和自訂建置流程。

完成以上步驟後，您就可以順利地為專案貢獻文件了。
