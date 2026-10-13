# Hello World 其一

本節從一個最小示例開始，示範如何建立可由BepInEx載入的Unity IL2CPP Mod，並在Unity生命週期中執行自訂程式碼。

## Mono和IL2CPP

Unity遊戲常見的指令碼後端包括Mono和IL2CPP。

在Mono模式下，Unity會將C#指令碼編譯為IL（中繼語言），執行階段由Mono虛擬機器解譯或JIT執行。這意味著遊戲目錄中通常會存在`Assembly-CSharp.dll`、`mscorlib.dll`等標準.NET組件，開發者和Mod作者都可以直接反編譯這些DLL來取得完整的C#原始碼結構。

IL2CPP採用另一條建置路線：Unity先把C#指令碼的IL轉換為C++程式碼，再由平台原生編譯器（如MSVC、Clang）編譯為機器碼。在Windows平台上，遊戲邏輯通常位於`GameAssembly.dll`中，執行階段不再依賴Mono執行這些指令碼IL。

逆向時面對的是原生機器碼，而不是可直接反編譯的遊戲指令碼IL。類別名稱、方法名稱和型別結構等資訊仍有一部分保存在全域中介資料中，需要把中介資料和`GameAssembly.dll`結合起來還原可讀的型別和函式對應。

## 判斷Mono或IL2CPP

判斷一個Unity遊戲使用哪種執行階段非常簡單，通常只需要查看遊戲目錄即可：

- 如果遊戲目錄中存在：

    ```
    GameAssembly.dll
    global-metadata.dat
    ```

    那麼它通常使用**IL2CPP**。

- 如果遊戲目錄中存在：

    ```
    Assembly-CSharp.dll
    UnityEngine.dll
    mscorlib.dll
    ```

    且沒有`GameAssembly.dll`，那麼它通常使用**Mono**。

在Windows平台上，IL2CPP遊戲通常還會有：

```
<遊戲名>_Data\il2cpp_data\
```

目錄，用於存放`global-metadata.dat`以及其他執行階段資料。

## `global-metadata.dat`的作用

雖然IL2CPP把指令碼編譯成了原生程式碼，但Unity仍需保留型別和反射所需的中介資料。`global-metadata.dat`包含類別名稱、方法名稱、欄位、參數型別和繼承關係等資訊。

這些資訊不會以普通除錯符號的形式直接附在`GameAssembly.dll`的原生函式上。Il2CppDumper會解析`global-metadata.dat`和`GameAssembly.dll`中的相關表結構，產生Dummy DLL、IDA腳本和型別定義，幫助還原方法和位址之間的對應。編譯器最佳化仍可能改變或合併部分原生程式碼，因此工具輸出需要結合實際反組譯結果判斷。

## 建立專案

> [!CAUTION]
>
> 如果閱讀下面出現的程式碼讓您感到吃力，可以先閱讀本章最後一節[小結](#小結)，了解哪些是值得關注的重點內容，而哪些可以暫時跳過。

確保已經按照[開發入門](./getting_started.md)完成BepInEx安裝，並至少進入過一次遊戲主選單。

以Visual Studio為例，建立一個新的「類別庫」專案，命名為`HelloWorld`。

![image-20260110235827527](./hello_world_1.assets/image-20260110235827527.png)

![image-20260110235905507](./hello_world_1.assets/image-20260110235905507.png)

![image-20260110235958050](./hello_world_1.assets/image-20260110235958050.png)

目標框架選擇.NET 6.0。

![image-20260111130000646](./hello_world_1.assets/image-20260111130000646.png)

## 新增參考

右鍵專案下的**相依性**，選擇**新增專案參考**，再透過「瀏覽」新增所需的DLL。

![image-20260111002004609](./hello_world_1.assets/image-20260111002004609.png)

首先新增遊戲根目錄下的以下檔案：

```
./BepInEx/interop/Assembly-CSharp.dll
./BepInEx/core/BepInEx.Core.dll
./BepInEx/core/BepInEx.Unity.IL2CPP.dll
```

對這三個參考，將「複製到本機」設為`False`，避免把遊戲和BepInEx內附的組件一起複製到輸出目錄。

![image-20260111002504985](./hello_world_1.assets/image-20260111002504985.png)

將專案的輸出路徑改為`BepInEx/plugins`資料夾。

![image-20260111003000981](./hello_world_1.assets/image-20260111003000981.png)

在`Class1.cs`中寫入以下程式碼：

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

點擊**建置**功能表中的**建置方案**，建置Mod DLL。

![image-20260111003245758](./hello_world_1.assets/image-20260111003245758.png)

確認建置成功後啟動遊戲，主控台中應能看到外掛載入時輸出的日誌。

![image-20260111003428455](./hello_world_1.assets/image-20260111003428455.png)

接下來新增以下參考，同樣將「複製到本機」設為`False`：

```
./BepInEx/core/0Harmony.dll
./BepInEx/core/Il2CppInterop.Runtime.dll
./BepInEx/interop/Il2Cppmscorlib.dll
./BepInEx/interop/UnityEngine.CoreModule.dll
./BepInEx/interop/UnityEngine.InputLegacyModule.dll
./BepInEx/interop/UnityEngine.UI.dll
```

將`Class1.cs`重新命名為`Plugin.cs`，並取代為以下程式碼：

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

新建`PluginManager.cs`，寫入以下程式碼：

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

確認建置成功後啟動遊戲。按下<kbd>F1</kbd>時，主控台中應輸出`HelloWorld from my first IL2CPP Mod!`。

![image-20260111130151837](./hello_world_1.assets/image-20260111130151837.png)

到這裡為止，我們已經完成了一個最基礎的IL2CPP Mod：

它可以被BepInEx載入、在Unity生命週期中執行，並透過按鍵觸發自訂邏輯。重點不是列印一行`HelloWorld`，而是建立一個可繼續接入遊戲狀態和修補邏輯的執行入口。

然而，這個Mod目前仍然是「自說自話」的：
它沒有讀取遊戲狀態，也沒有修改任何遊戲行為。要讓它真正成為一個「遊戲Mod」，我們還需要知道——遊戲的邏輯在哪裡，函式在哪裡，資料在哪裡。

## 小結

本節的重點是認識IL2CPP，並建立一個最基礎的IL2CPP Mod：

1. 建立類別庫專案
2. 新增必要參考
3. 貼上範本程式碼
4. 建置並執行Mod

初次實踐時不必一次理解範本中的全部細節。例如，C語言初學者第一次接觸下面的程式碼：

```c
#include <stdio.h>
int main(int argc, char** argv) {
	printf("Hello, World!\n");
	return 0;
}
```

他並不需要理解`#include`、`int main`、`argc/argv`等所有細節，只需要知道：

> 我在這個「範本程式碼」中的「適當地點」寫`printf`，就能讓程式輸出需要的內容。

可以先確認專案能夠建置、載入和回應按鍵，再逐步檢查每一行程式碼及其相依性。遇到不理解的型別或呼叫時，應結合框架文件、Interop組件和執行日誌驗證。
