# MetaMystiaドキュメントへの貢献ガイド

このドキュメントでは、[**meta-mystia-doc**](https://github.com/MetaMystia/meta-mystia-doc)リポジトリで[**mdBook**](https://rust-lang.github.io/mdBook/index.html)を使ってドキュメントを執筆・保守する方法を説明します。基本的な流れ、ローカルプレビュー、ディレクトリ構成、コミット規約を扱い、初めて貢献する開発者がすぐに始められる内容です。

## 1. リポジトリとツール

- **リポジトリ**：[https://github.com/MetaMystia/meta-mystia-doc](https://github.com/MetaMystia/meta-mystia-doc)
- **ドキュメントツール**：[mdBook](https://rust-lang.github.io/mdBook/index.html)（Rustプロジェクトが保守するドキュメント生成ツール）
- **パッケージマネージャー**：[pnpm](https://pnpm.io/installation)

mdBookはMarkdownを執筆形式とし、`SUMMARY.md`でドキュメント構造を管理します。構造が明確で保守しやすい技術ドキュメントの作成に適しています。

Markdownの内容だけを変更する場合は、リポジトリをクローンしてそのまま編集できます。フォーマット、ローカルビルド、リアルタイムプレビューも行う場合は、Node.js、pnpm、mdBookをあらかじめインストールしてください。

## 2. 基本的な執筆の流れ（ローカルプレビュー不要）

ドキュメントの追加や修正だけで、ローカルでレンダリング結果を確認する必要がない場合は、次の最も簡単な流れを使えます。本文は言語ごとに`content/<言語>`ディレクトリに置かれ、簡体字中国語は`content/zh-CN`で、他の言語の翻訳元でもあります。

### ステップ1：リポジトリをクローン

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
```

### ステップ2：依存関係をインストール（ローカルで確認する場合）

```bash
pnpm i
```

この手順ではプロジェクトのNode.js依存関係をインストールします。純粋なテキスト修正では省略できますが、提出前にローカルのフォーマットとビルドの確認を行うことをおすすめします。

### ステップ3：ドキュメントファイルを追加

- `content/zh-CN`ディレクトリにサブフォルダを作成（ドキュメントの分類用）
- 対応するフォルダに`.md`ファイルを作成

例：

```text
content/zh-CN/
 └─ guide/
    └─ getting_started.md
```

### ステップ4：`content/zh-CN/SUMMARY.md`を編集

作成したファイルを`SUMMARY.md`に宣言し、ドキュメントの目次に表示されるようにします。

`SUMMARY.md`に宣言しないと、そのドキュメントはmdBookにビルドも表示もされません。

## 3. ローカルプレビュー付きの執筆の流れ

執筆中にレンダリング結果をリアルタイムで確認したい場合は、mdBookのローカルサーバー機能を使えます。

### ステップ1-2：リポジトリをクローンして依存関係をインストール

基本の流れと同じです：

```bash
git clone https://github.com/MetaMystia/meta-mystia-doc
cd meta-mystia-doc
pnpm i
```

### ステップ3：mdBookをインストール

公式ガイドに従ってmdBookをインストールしてください：
[https://rust-lang.github.io/mdBook/guide/installation.html](https://rust-lang.github.io/mdBook/guide/installation.html)

### ステップ4：`content/zh-CN/SUMMARY.md`を編集

作成予定のドキュメントのパスを`SUMMARY.md`にあらかじめ宣言します。対応する`.md`ファイルがまだ存在しなくても問題ありません。

### ステップ5：ローカルプレビューサーバーを起動

```bash
pnpm i18n:serve
```

このコマンドはmdBookで5言語をビルドして統合し、その後：

- `SUMMARY.md`を読み込み
- 存在しないMarkdownファイルを自動で作成
- ローカルのHTTPサーバーを起動

ターミナルにローカルのアクセス先（通常は`http://localhost:3000`）が表示されます。

### ステップ6：ドキュメントを編集

`content/zh-CN`ディレクトリのMarkdownファイルを直接編集します。保存するとブラウザが自動的に更新され、最新の内容が表示されます。

## 4. `SUMMARY.md`について

`SUMMARY.md`はドキュメント全体の構造を記述するもので、「目次」のような役割を果たします。

### 基本ルール

- Markdownのリスト構文を使う
- 各項目が1つの`.md`ファイルに対応する
- 多段のネストに対応し、章の階層関係を表す

mdBook公式ドキュメントの書き方を参考にしてください：
[SUMMARY.md](https://github.com/rust-lang/mdBook/blob/master/guide/src/SUMMARY.md)

次の点を必ず確認してください：

- パスが`content/zh-CN`ディレクトリ内の実際のファイルパスと一致している
- ファイル名は小文字を使い、空白の代わりにアンダースコア（snake_case）を使う

他の言語も`content/zh-CN`とまったく同じディレクトリ構成・ファイル名を使い、本文だけを翻訳します。中国語の原文を変更したら、他の言語も同期して更新し、各言語版がずれないようにしてください。

## 5. 変更のコミットとプルリクエスト

### コミット前の確認

リポジトリのルートで実行します：

```bash
pnpm format
pnpm i18n:sync
```

`pnpm format`はリポジトリ内のPrettier対応ファイルを整形します。`pnpm i18n:sync`はソースからドキュメントサイト全体をビルドします。実行後は`git diff`を確認し、今回の変更と無関係な整形が含まれていないことを確かめてください。

### 変更のコミット

確認が通ったら、今回の作業に関係するファイルだけをステージしてコミットします。例：

```bash
git add content/zh-CN/guide/getting_started.md content/zh-CN/SUMMARY.md
git commit -m "docs: add getting started guide"
```

### コミットメッセージの規約

[**@commitlint/config-conventional**](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)が、このリポジトリで使うコミット規約の検証基準です。

コミットメッセージがConventional Commitsに準拠していることを確認してください。準拠していないとコミットできない場合があります。

### プルリクエストの作成

- コミットを自分のForkブランチにプッシュ
- GitHubでPull Requestを作成
- 変更内容と目的を簡単に説明

## 6. 補足

- 各Markdownファイルは1つのトピックに絞り、内容が肥大化しないようにしてください
- 中国語と英語の間に**手動でスペースを入れる必要はありません**。サイトのCSSが中国語と英数字の間の文字間隔を自動で処理するため、Markdownは自然に書いてください。レイアウトのために余分なスペースを入れないでください

mdBookのより高度な使い方に興味があれば、公式ガイドでテーマ設定、プラグイン、カスタムビルドの流れを確認してください。

以上の手順を終えれば、プロジェクトにドキュメントを貢献できます。
