# Hello World その1

このセクションでは、最小限のサンプルから始めて、BepInExで読み込めるUnity IL2CPPのModを作成し、Unityのライフサイクルで独自のコードを実行する方法を示します。

## MonoとIL2CPP

Unityゲームでよく使われるスクリプトバックエンドにはMonoとIL2CPPがあります。

Monoモードでは、UnityはC#スクリプトをIL（中間言語）にコンパイルし、実行時にMonoランタイムが解釈またはJIT実行します。そのため、ゲームフォルダには通常`Assembly-CSharp.dll`や`mscorlib.dll`などの標準的な.NETアセンブリが存在し、開発者もMod作者もこれらのDLLをそのまま逆コンパイルして完全なC#ソース構造を取得できます。

IL2CPPは別のビルド経路を取ります。UnityはまずC#スクリプトのILをC++コードへ変換し、それをプラットフォームのネイティブコンパイラ（MSVCやClangなど）がマシンコードへコンパイルします。Windowsでは、ゲームロジックは通常`GameAssembly.dll`にあり、実行時にMonoがスクリプトILを実行することはありません。

リバース時に対峙するのは、そのまま逆コンパイルできるスクリプトILではなくネイティブのマシンコードです。クラス名、メソッド名、型構造などの情報の一部はグローバルメタデータに残っており、メタデータと`GameAssembly.dll`を組み合わせて、読みやすい型と関数の対応を復元する必要があります。

## MonoかIL2CPPかの見分け方

Unityゲームがどちらのランタイムを使っているかは簡単に分かります。通常はゲームフォルダを見るだけで済みます：

- ゲームフォルダに次がある場合：

    ```
    GameAssembly.dll
    global-metadata.dat
    ```

    通常は**IL2CPP**です。

- ゲームフォルダに次があり：

    ```
    Assembly-CSharp.dll
    UnityEngine.dll
    mscorlib.dll
    ```

    かつ`GameAssembly.dll`がない場合、通常は**Mono**です。

Windowsでは、IL2CPPゲームには通常次のフォルダもあります：

```
<ゲーム名>_Data\il2cpp_data\
```

ここに`global-metadata.dat`やその他の実行時データが保存されています。

## `global-metadata.dat`の役割

IL2CPPはスクリプトをネイティブコードにコンパイルしますが、Unityは型とリフレクションに必要なメタデータを保持し続ける必要があります。`global-metadata.dat`にはクラス名、メソッド名、フィールド、引数の型、継承関係などの情報が含まれます。

この情報は通常のデバッグシンボルとして`GameAssembly.dll`のネイティブ関数に直接付与されるものではありません。Il2CppDumperは`global-metadata.dat`と`GameAssembly.dll`の関連するテーブル構造を解析し、ダミーDLL、IDAスクリプト、型定義を生成して、メソッドとアドレスの対応の復元を助けます。コンパイラの最適化によってネイティブコードの一部が変わったり統合されたりすることがあるため、ツールの出力は実際の逆アセンブル結果と合わせて判断してください。

## プロジェクトの作成

> [!CAUTION]
>
> 以下のコードを読むのが大変に感じる場合は、まずこの章の最後の[まとめ](#まとめ)を読んで、どこが重要なポイントで、どこを今は読み飛ばしてよいかを確認してください。

[開発入門](./getting_started.md)に従ってBepInExのインストールを完了し、一度はゲームのメインメニューに入っていることを確認してください。

Visual Studioを例に、新しい「クラス ライブラリ」プロジェクトを作成し、`HelloWorld`という名前を付けます。

![image-20260110235827527](./hello_world_1.assets/image-20260110235827527.png)

![image-20260110235905507](./hello_world_1.assets/image-20260110235905507.png)

![image-20260110235958050](./hello_world_1.assets/image-20260110235958050.png)

ターゲットフレームワークは.NET 6.0を選択します。

![image-20260111130000646](./hello_world_1.assets/image-20260111130000646.png)

## 参照の追加

プロジェクトの**依存関係**を右クリックし、**プロジェクト参照の追加**を選んで、「参照」から必要なDLLを追加します。

![image-20260111002004609](./hello_world_1.assets/image-20260111002004609.png)

まずゲームのルートにある次のファイルを追加します：

```
./BepInEx/interop/Assembly-CSharp.dll
./BepInEx/core/BepInEx.Core.dll
./BepInEx/core/BepInEx.Unity.IL2CPP.dll
```

この3つの参照は「ローカルにコピー」を`False`にし、ゲームやBepInExに同梱されたアセンブリが出力フォルダにコピーされないようにします。

![image-20260111002504985](./hello_world_1.assets/image-20260111002504985.png)

プロジェクトの出力パスを`BepInEx/plugins`フォルダに変更します。

![image-20260111003000981](./hello_world_1.assets/image-20260111003000981.png)

`Class1.cs`に次のコードを書きます：

```csharp
using BepInEx;
using BepInEx.Logging;
using BepInEx.Unity.IL2CPP;

namespace HelloWorld;

[BepInPlugin("HelloWorld", "HelloWorld", "0.1")]
public class Plugin : BasePlugin
{
    internal static new ManualLogSource Log;

    public override void Load()
    {
        Log = base.Log;
        Log.LogWarning($"Plugin HelloWorld is loaded!");
    }
}
```

**ビルド**メニューの**ソリューションのビルド**をクリックし、ModのDLLをビルドします。

![image-20260111003245758](./hello_world_1.assets/image-20260111003245758.png)

ビルドが成功したらゲームを起動します。コンソールにプラグイン読み込み時のログが表示されるはずです。

![image-20260111003428455](./hello_world_1.assets/image-20260111003428455.png)

次に、以下の参照を追加し、同様に「ローカルにコピー」を`False`にします：

```
./BepInEx/core/0Harmony.dll
./BepInEx/core/Il2CppInterop.Runtime.dll
./BepInEx/interop/Il2Cppmscorlib.dll
./BepInEx/interop/UnityEngine.CoreModule.dll
./BepInEx/interop/UnityEngine.InputLegacyModule.dll
./BepInEx/interop/UnityEngine.UI.dll
```

`Class1.cs`を`Plugin.cs`に名前変更し、次のコードに置き換えます：

```csharp
using BepInEx;
using BepInEx.Unity.IL2CPP;
using HarmonyLib;
using Il2CppInterop.Runtime.Injection;
using UnityEngine.UI;

namespace HelloWorld;

[BepInPlugin("HelloWorld", "HelloWorld", "0.0.0")]
public class Plugin : BasePlugin
{
    public static Plugin Instance;

    public Plugin()
    {
        Instance = this;
    }

    public override void Load()
    {
        Log.LogInfo($"Plugin HelloWorld-v0.0.0 is loaded!"); // Mod 加载时会打印该信息

        try
        {
            ClassInjector.RegisterTypeInIl2Cpp<PluginManager>();
            Log.LogInfo("Registered C# Types in Il2Cpp");
        }
        catch (Exception e)
        {
            Log.LogError($"FAILED to Register Il2Cpp Type: {e}");
        }

        try
        {
            var harmony = new Harmony("HelloWorld");

            var originalHandle = AccessTools.Method(typeof(CanvasScaler), "Handle");
            var postHandle = AccessTools.Method(typeof(BootstrapPatch), "Handle");
            harmony.Patch(originalHandle, postfix: new HarmonyMethod(postHandle));
        }
        catch
        {
            Log.LogError("FAILED to Apply Hooks!");
        }
    }

    class BootstrapPatch
    {
        [HarmonyPostfix]
        static void Handle()
        {
            if (PluginManager.Instance == null)
            {
                Plugin.Instance.Log.LogMessage("Bootstrapping Trainer...");
                try
                {
                    PluginManager.Create("PluginManager");
                    if (PluginManager.Instance != null)
                    {
                        Plugin.Instance.Log.LogMessage("Trainer Bootstrapped!");
                    }
                }
                catch (Exception e)
                {
                    Plugin.Instance.Log.LogMessage($"ERROR Bootstrapping Trainer: {e.Message}");
                }
            }
        }
    }
}
```

`PluginManager.cs`を新規作成し、次のコードを書きます：

```csharp
using BepInEx.Logging;
using Il2CppInterop.Runtime;
using UnityEngine;

namespace HelloWorld;

public class PluginManager : MonoBehaviour
{
    public static PluginManager Instance { get; private set; }
    public static ManualLogSource Log => Plugin.Instance.Log;

    public PluginManager(IntPtr ptr) : base(ptr)
    {
        Instance = this;
    }

    internal static GameObject Create(string name)
    {
        var gameObject = new GameObject(name);
        DontDestroyOnLoad(gameObject);

        gameObject.AddComponent(Il2CppType.Of<PluginManager>());

        return gameObject;
    }

    private void Awake()
    {

    }

    private void Update() // Unity 每一帧都会调用该方法
    {
        if (Input.GetKeyDown(KeyCode.F1)) // 按下 F1 键时
        {
            Log.LogWarning("HelloWorld from my first IL2CPP Mod!"); // 在控制台打印一行日志
        }
    }
}
```

![image-20260111125858173](./hello_world_1.assets/image-20260111125858173.png)

ビルドが成功したらゲームを起動します。<kbd>F1</kbd>を押すと、コンソールに`HelloWorld from my first IL2CPP Mod!`が出力されるはずです。

![image-20260111130151837](./hello_world_1.assets/image-20260111130151837.png)

ここまでで、最も基本的なIL2CPP Modが完成しました：

BepInExに読み込まれ、Unityのライフサイクルで動作し、キー入力で独自のロジックを実行できます。大切なのは`HelloWorld`を1行出力することではなく、今後ゲームの状態やパッチ処理を接続していける実行入口を作ることです。

ただし、このModはまだ「ひとりごと」を言っているだけです：
ゲームの状態を読まず、ゲームの動作も変更しません。本当の「ゲームMod」にするには、ゲームのロジックがどこにあり、関数がどこにあり、データがどこにあるのかを知る必要があります。

## まとめ

このセクションのポイントは、IL2CPPを理解し、最も基本的なIL2CPP Modを作ることです：

1. クラスライブラリプロジェクトを作成する
2. 必要な参照を追加する
3. テンプレートコードを貼り付ける
4. ビルドしてModを実行する

最初からテンプレートの細部をすべて理解する必要はありません。たとえば、C言語の初心者が次のコードに初めて触れるとき：

```c
#include <stdio.h>
int main(int argc, char** argv) {
	printf("Hello, World!\n");
	return 0;
}
```

`#include`、`int main`、`argc/argv`などの細部をすべて理解する必要はなく、次のことだけ分かれば十分です：

> この「テンプレートコード」の「適切な場所」に`printf`を書けば、プログラムは必要な内容を出力する。

まずプロジェクトがビルド・読み込み・キー入力に反応することを確認し、それから各行のコードとその依存関係を順に確認していきましょう。理解できない型や呼び出しに出会ったら、フレームワークのドキュメント、Interopアセンブリ、実行ログと照らし合わせて検証してください。
