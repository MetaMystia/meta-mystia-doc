# 開発入門

このガイドは、C#と.NETに慣れているものの、Unity IL2CPPのMod開発経験がない貢献者向けに、現在のリポジトリのビルド設定と基本的なリバースエンジニアリングツールを説明します。

## プロジェクトのビルド

始める前に、システムが次の条件を満たしていることを確認し、順番に設定を進めてください。

1. **.NET 10 SDK**：
   [https://dotnet.microsoft.com/ja-jp/download/dotnet/10.0](https://dotnet.microsoft.com/ja-jp/download/dotnet/10.0)

2. 『[東方夜雀食堂](https://store.steampowered.com/app/1584090)』の**正規のコピー**（Steam版）。

3. **MetaMystia**リポジトリをクローンします：
   [https://github.com/MetaMystia/MetaMystia](https://github.com/MetaMystia/MetaMystia)

4. 最新の**BepInEx-Unity.IL2CPP-win-x64**をダウンロードします：
   [https://builds.bepinex.dev/projects/bepinex_be](https://builds.bepinex.dev/projects/bepinex_be)

    そしてゲームのインストールルート（`Touhou Mystia Izakaya.exe`があるフォルダ）に完全に解凍します。

5. ゲームを一度起動し、メインメニューに入ったら終了します。BepInExがプロジェクトのビルドに必要な`core`、`interop`などのアセンブリを生成します。

6. MetaMystiaリポジトリのルートでローカル設定テンプレートをコピーします：

    ```powershell
    Copy-Item MetaMystia.local.props.example MetaMystia.local.props
    ```

7. `MetaMystia.local.props`を編集し、`BepInExPath`をゲームディレクトリ内の`BepInEx`フォルダに設定します：

    ```xml
    <Project>
      <PropertyGroup>
        <BepInExPath>ゲームのインストール先\BepInEx</BepInExPath>
      </PropertyGroup>
    </Project>
    ```

    `MetaMystia.local.props`はリポジトリの`*.local.props`除外ルールに一致するため、コミットしないでください。プロジェクトはこのパスを通じて`BepInEx/core`と`BepInEx/interop`のアセンブリを参照し、ビルド成果物を`BepInEx/plugins`に出力します。

8. .NETソリューションに対応したIDEで`MetaMystia.sln`を開くか、リポジトリのルートで次を実行します：

    ```powershell
    dotnet build MetaMystia.sln
    ```

9. ビルドは`BepInEx/plugins/MetaMystia-v<バージョン>.dll`を生成し、`MetaMystia.Preloader.dll`を`BepInEx/patchers/MetaMystia`にコピーします。

メインプロジェクトのターゲットフレームワークは.NET 6.0で、現在C# 14の構文を使用しているため、開発環境には.NET 10 SDKをインストールします。ソースジェネレータープロジェクトのターゲットフレームワークは.NET Standard 2.0です。`src/MetaMystia.Network.Tests`や`src/MetaMystia.Flow.Tests`などのテストプロジェクトを実行するには、.NET 6ランタイムも必要です。

## ツールの準備

効率よくMod開発とリバースエンジニアリングを行うために、次のツールを事前に用意することをおすすめします。

### コアツール

#### IDA Pro

`GameAssembly.dll`の逆アセンブル分析や、必要に応じた動的デバッグに使用します。IL2CPPゲームでは、ネイティブコードの制御フローや呼び出し関係の確認に役立ちます。

- 公式サイト：[https://hex-rays.com/ida-pro](https://hex-rays.com/ida-pro)

> [!NOTE]
> IDA Freeでも基本的な分析は可能ですが、Pro版とは機能やプラグイン対応が異なります。必要な機能に応じて正規ライセンス版を選んでください。本文書はクラックやライセンス回避の方法を一切提供しません。

#### dnSpyEx

.NETアセンブリの静的解析に使用します。IL2CPPの場合は、主にIl2CppDumperが生成したダミーDLLを閲覧して、クラス構造、フィールド配置、メソッドシグネチャを理解するために使います。元の`dnSpy/dnSpy`リポジトリはアーカイブ済みのため、ここでは保守が続いているdnSpyExフォークを使用します。

- GitHubリポジトリ：[https://github.com/dnSpyEx/dnSpy](https://github.com/dnSpyEx/dnSpy)

#### Il2CppDumper

IL2CPPが生成したバイナリを分析し、シンボル情報を復元し、dnSpyとIDAで使う補助ファイルを生成します。

- GitHubリポジトリ：[https://github.com/Perfare/Il2CppDumper](https://github.com/Perfare/Il2CppDumper)

### 推奨プラグイン（任意）

#### IDA-Pro-MCP

このプラグインを使うと、AI AgentがMCPインターフェース経由でIDAデータベースにアクセスできます。関数の特定、制御フローの理解、分析の効率化に役立ちます。

- インストール参考：[https://github.com/mrexodia/ida-pro-mcp?tab=readme-ov-file#installation](https://github.com/mrexodia/ida-pro-mcp?tab=readme-ov-file#installation)

#### dnSpy.Cpp2IL

Cpp2ILの分析結果をdnSpyのビューに統合し、IL2CPPの復元コードを読むときに多くの情報を提供するdnSpyプラグインです。インストール前に、プラグインリポジトリの説明に従ってお使いのdnSpyバージョンとの互換性を確認してください。

- インストール参考：[https://github.com/BadRyuner/dnspy.Cpp2IL?tab=readme-ov-file#how-to-install](https://github.com/BadRyuner/dnspy.Cpp2IL?tab=readme-ov-file#how-to-install)

## リバースエンジニアリングの準備

このセクションでは、上記のツールを使ってIL2CPP分析環境を準備する方法を説明します。完了すると、dnSpyで復元された型構造を閲覧し、IDAでシンボル付きの逆アセンブル分析を行えます。

### Il2CppDumperでシンボルを復元する

1. `Il2CppDumper.exe`を実行します。

2. 案内に従って次のファイルを順に読み込みます：
    - ゲームディレクトリの`GameAssembly.dll`
    - `Touhou Mystia Izakaya_Data/il2cpp_data/Metadata/global-metadata.dat`

3. 自動分析が完了するまで待ちます。完了すると複数の出力フォルダが生成され、以降の手順では主に次を使います：
    - `DummyDll/`

### dnSpyへのインポート

1. Il2CppDumperが生成した`DummyDll/Assembly-CSharp.dll`をdnSpyにインポートします。

2. このファイルを通じて、ゲームロジックのクラス定義、フィールド名、メソッドシグネチャを比較的直感的に確認し、DLL内の仮想アドレスを特定できます。

### IDA Proへのインポート

1. IDA Proで`GameAssembly.dll`を開き、初期の自動分析が終わるまで待ちます（初回の読み込みは時間がかかることがあります）。

2. IDAで`File -> Script file`をクリックし、Il2CppDumperが生成した`ida_with_struct.py`スクリプトを実行します。バージョンによってはPython 3版が`ida_with_struct_py3.py`という名前になります。実際の出力ファイルに合わせてください。

3. スクリプトの案内に従って、生成された`script.json`と`il2cpp.h`を順に選択し、シンボルと構造情報のインポートが完了するまで気長に待ちます。

    ![IDAでスクリプトを実行する手順](./getting_started.assets/image-20251231124728238.png)

4. インポートが完了したら、IDAを閉じて**データベースを保存**します。保存ダイアログでは、`Collect`オプションをオンにして完全な分析情報を残すことをおすすめします。

    ![IDAの保存ダイアログ](./getting_started.assets/image-20251231125239242.png)

5. 生成された`GameAssembly.dll.i64`データベースファイルを別途バックアップします。

> [!TIP]
> 動的デバッグでは**ASLR**のため、モジュールの実行時ベースアドレス（例：`0x7FFF25021000`）が静的解析時のアドレス（例：`0x180001000`）と異なり、アドレスの対応が混乱しやすくなります。元の静的データベースを残しておくと、IDAのRebaseが静的解析に与える影響を避けられます。

### 補助Skill

AI Agentは呼び出し関係の調査や監査記録の整理を補助できますが、ゲームの動作は依然としてリバースコード、Interopアセンブリ、実際の実行結果で相互検証する必要があります。IDA Pro MCPでIL2CPPソースを復元する場合は、[il2cpp-to-csharp-skill](https://github.com/MetaMikuAI/il2cpp-to-csharp-skill)を参照してください。
