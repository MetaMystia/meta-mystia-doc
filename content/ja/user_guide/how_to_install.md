# インストール方法

このページでは、BepInExとMetaMystiaのインストール手順を説明します。

## ワンクリックインストール {#onclick_install}

MetaMystia Mod管理ツールは、ワンクリックでのインストール、アップグレード、アンインストール、有効化/無効化、診断に対応しています。**すべてのプレイヤーに推奨**です。インストールも今後の更新も、このツールに任せておけば安心です。

1. 次のいずれかから<span class="version-manager">**meta-mystia-manager-v\*.exe**</span>をダウンロードします：
    - GitHub：
      [https://github.com/MetaMystia/meta-mystia-manager/releases](https://github.com/MetaMystia/meta-mystia-manager/releases)
    - 当サイトのサーバー：
      [https://url.izakaya.cc/getMetaMystia](https://url.izakaya.cc/getMetaMystia)

2. ダウンロードが完了したら、ファイルをダブルクリックして実行します。
3. ツールの指示に従い、必要な機能を選びます。

    ![MetaMystia Mod管理ツールの画面](./how_to_install.assets/15e3f52d-bc2c-48b7-8c39-a34370adadee.png)

## 手動インストール

<details id="install_mod">
<summary>手動インストールの手順を表示</summary>

手動でのインストールも可能ですが、ファイルを自分で入手して所定のフォルダに置く必要があり、自動更新もされません。普段は[ワンクリックインストール](#onclick_install)を優先してください。

### はじめに知っておきたいこと

始める前に、いくつかの用語を簡単に説明します：

- **Mod**：プレイヤーが作った「拡張プラグイン」。元のゲームにインストールして、新機能を追加します
- **BepInEx**：「Modローダー」で、「ゲームのためにModを起動してくれる小さなプログラム」と考えると分かりやすいです
- **ゲームのルートフォルダ**：ゲームがインストールされているフォルダ。`Touhou Mystia Izakaya.exe`というファイルが見える場所です

「Mod」やパソコンのファイル操作に触れたことがなくても心配いりません。手順どおりに一つずつ進めれば、インストールできます。

覚えておくことはこれだけです：

> まずBepInExを入れ、次にMetaMystiaのファイルを所定のフォルダに置く。

### 1. BepInExのダウンロードとインストール

1. **BepInEx BE**の公式ビルドページを開きます：
   [https://builds.bepinex.dev/projects/bepinex_be](https://builds.bepinex.dev/projects/bepinex_be)

2. ページ内で『[東方夜雀食堂](https://store.steampowered.com/app/1584090/)』に合う**IL2CPP**版（BepInEx Unity (IL2CPP) for Windows (x64) games）を選びます。
   注意：このゲームは**IL2CPP**を使用しています。対応するビルドを選ばないと正常に動作しません。

3. ほとんどのプレイヤーは、下の画像で示したビルドをダウンロードすれば問題ありません（画像のバージョンは古い可能性があります。対応する最新版をダウンロードしてください）：

    ![BepInExのビルド一覧](./how_to_install.assets/image-20251231114022353.png)

4. ダウンロードが完了したら、圧縮ファイルを**ゲームのルートフォルダ**に解凍します。

    > **ゲームのインストール先はどう探す？**
    >
    > Steamでゲームをインストールした場合は、Steamを開く → ライブラリで『東方夜雀食堂』を右クリック → 「管理」をクリック → 「ローカルファイルを閲覧」をクリック

    解凍後のフォルダ構成はおおよそ次のようになります：

    ```
    Touhou Mystia Izakaya
    ├─BepInEx
    ├─dotnet
    ├─Touhou Mystia Izakaya_Data
    ├─东方夜雀食堂 头像&表情包 ~ Avatar Image
    ├─.doorstop_version
    ├─baselib.dll
    ├─changelog.txt
    ├─doorstop_config.ini
    ├─GameAssembly.dll
    ├─Touhou Mystia Izakaya.exe
    ├─UnityCrashHandler64.exe
    ├─UnityPlayer.dll
    └─winhttp.dll
    ```

5. ゲームを起動します。
   起動時に**黒いコンソールウィンドウ**が表示されれば、BepInExは正しくインストールされています。初回起動は読み込みに時間がかかることがありますので、気長にお待ちください。

### 2. Modのダウンロードとインストール

1. 次の場所から<span class="version-dll">**MetaMystia-v\*.dll**</span>をダウンロードします：
    - GitHub：
      [https://github.com/MetaMystia/MetaMystia/releases](https://github.com/MetaMystia/MetaMystia/releases)

2. ダウンロードが完了したら、<span class="version-dll">**MetaMystia-v\*.dll**</span>を次のフォルダに置きます：

    ```plaintext
    ゲームのルートフォルダ/BepInEx/plugins
    ```

    `plugins`フォルダが存在しない場合は、手動で作成してください。

3. MetaMystiaが提供する追加コンテンツ（新しいレア客など）をゲームに追加したい場合は、<span class="version-zip">**ResourceExample-v\*.zip**</span>もダウンロードする必要があります。

    ダウンロードが完了したら、ファイルを次のフォルダに置きます（**解凍は不要**）：

    ```plaintext
    ゲームのルートフォルダ/ResourceEx
    ```

    `ResourceEx`フォルダが存在しない場合は、手動で作成してください。

    GitHubのreleasesには<span class="version-zip">**ResourceExample-v\*.zip**</span>が付属しないものもあります。このファイルが提供されている直近のreleaseからダウンロードしてください。

4. もう一度ゲームを起動します。画面左下にMetaMystiaのステータス文字が表示されれば、Modは読み込まれています。

5. リソースパックをインストールした場合は、ゲーム内で次のコマンドを実行して読み込み結果を確認できます：

    ```text
    /resourceex list
    ```

    拒否されたリソースパックは理由とともに表示され、`BepInEx/LogOutput.log`にも記録されます。

</details>

## アップグレード方法 {#update_mod}

### ワンクリックアップグレード

MetaMystia Mod管理ツールはワンクリックでのアップグレードに対応しています。アップグレード中にエラーが起きても、ツールが自動的に元の状態にロールバックするので、安心してやり直せます。

ツールの入手方法と使い方は[ワンクリックインストール](#onclick_install)をご覧ください。

### 手動アップグレード

すでにMetaMystiaの`.dll`と`.zip`をインストール済みの場合は、次の手順で手動アップグレードできます：

1. [Modのダウンロードとインストール](#install_mod)の手順に従い、最新版のファイルを所定のフォルダにダウンロードします。
2. 古い`MetaMystia-v*.dll`を削除し、BepInExが複数バージョンを同時に読み込まないようにします。
3. もう一度ゲームを起動します。

> [!TIP]
> 手動でインストールしたファイルは自動更新されず、バージョンの互換性も自分で確認する必要があります。[管理ツール](#onclick_install)への切り替えをおすすめします。
