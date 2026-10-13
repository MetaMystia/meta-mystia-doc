# Hello World, Part 1

This section starts from a minimal example and shows how to create a Unity IL2CPP mod that BepInEx can load and how to run custom code during Unity's lifecycle.

## Mono and IL2CPP

Unity games commonly use Mono or IL2CPP as their scripting backend.

With Mono, Unity compiles C# scripts into IL (intermediate language), which the Mono runtime interprets or JIT-compiles at run time. That means the game folder usually contains standard .NET assemblies such as `Assembly-CSharp.dll` and `mscorlib.dll`, and both developers and mod authors can decompile those DLLs directly to recover the full C# source structure.

IL2CPP takes a different build path: Unity first converts the IL of the C# scripts into C++ code, and the platform's native compiler (such as MSVC or Clang) then compiles that into machine code. On Windows, the game logic usually lives in `GameAssembly.dll`, and the runtime no longer relies on Mono to execute that script IL.

When reverse engineering, you face native machine code rather than game script IL you can decompile directly. Some information such as class names, method names, and type structure is still kept in the global metadata, and you need to combine the metadata with `GameAssembly.dll` to restore a readable mapping of types and functions.

## Telling Mono and IL2CPP apart

Telling which runtime a Unity game uses is easy; usually you only need to look at the game folder:

- If the game folder contains:

    ```
    GameAssembly.dll
    global-metadata.dat
    ```

    it usually uses **IL2CPP**.

- If the game folder contains:

    ```
    Assembly-CSharp.dll
    UnityEngine.dll
    mscorlib.dll
    ```

    and does not contain `GameAssembly.dll`, it usually uses **Mono**.

On Windows, IL2CPP games usually also have a:

```
<game name>_Data\il2cpp_data\
```

folder that stores `global-metadata.dat` and other runtime data.

## What `global-metadata.dat` does

Although IL2CPP compiles the scripts into native code, Unity still needs to keep the metadata required for types and reflection. `global-metadata.dat` contains information such as class names, method names, fields, parameter types, and inheritance relationships.

That information is not attached to the native functions in `GameAssembly.dll` as ordinary debug symbols. Il2CppDumper parses `global-metadata.dat` and the relevant table structures in `GameAssembly.dll` and generates dummy DLLs, IDA scripts, and type definitions that help restore the mapping between methods and addresses. Compiler optimizations can still change or merge parts of the native code, so the tool's output must be judged together with the actual disassembly.

## Creating the project

> [!CAUTION]
>
> If the code below feels heavy, you can first read the [Summary](#summary) at the end of this chapter to see what is worth focusing on and what you can skip for now.

Make sure you have completed the BepInEx installation from [Getting started](./getting_started.md) and have entered the game's main menu at least once.

Using Visual Studio as an example, create a new "Class Library" project and name it `HelloWorld`.

![image-20260110235827527](./hello_world_1.assets/image-20260110235827527.png)

![image-20260110235905507](./hello_world_1.assets/image-20260110235905507.png)

![image-20260110235958050](./hello_world_1.assets/image-20260110235958050.png)

Choose .NET 6.0 as the target framework.

![image-20260111130000646](./hello_world_1.assets/image-20260111130000646.png)

## Adding references

Right-click **Dependencies** under the project, choose **Add Project Reference**, and add the required DLLs through "Browse".

![image-20260111002004609](./hello_world_1.assets/image-20260111002004609.png)

First add the following files from the game root:

```
./BepInEx/interop/Assembly-CSharp.dll
./BepInEx/core/BepInEx.Core.dll
./BepInEx/core/BepInEx.Unity.IL2CPP.dll
```

For these three references, set "Copy Local" to `False` so that the assemblies shipped with the game and BepInEx are not copied into the output folder.

![image-20260111002504985](./hello_world_1.assets/image-20260111002504985.png)

Change the project's output path to the `BepInEx/plugins` folder.

![image-20260111003000981](./hello_world_1.assets/image-20260111003000981.png)

Write the following code in `Class1.cs`:

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

Click **Build Solution** in the **Build** menu to build the mod DLL.

![image-20260111003245758](./hello_world_1.assets/image-20260111003245758.png)

Once the build succeeds, launch the game; the console should show the log line printed when the plugin loads.

![image-20260111003428455](./hello_world_1.assets/image-20260111003428455.png)

Next, add the following references, again setting "Copy Local" to `False`:

```
./BepInEx/core/0Harmony.dll
./BepInEx/core/Il2CppInterop.Runtime.dll
./BepInEx/interop/Il2Cppmscorlib.dll
./BepInEx/interop/UnityEngine.CoreModule.dll
./BepInEx/interop/UnityEngine.InputLegacyModule.dll
./BepInEx/interop/UnityEngine.UI.dll
```

Rename `Class1.cs` to `Plugin.cs` and replace its contents with the following code:

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

Create `PluginManager.cs` and write the following code:

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

Once the build succeeds, launch the game. When you press <kbd>F1</kbd>, the console should print `HelloWorld from my first IL2CPP Mod!`.

![image-20260111130151837](./hello_world_1.assets/image-20260111130151837.png)

By now we have a most basic IL2CPP mod:

it can be loaded by BepInEx, run during Unity's lifecycle, and trigger custom logic from a key press. The point is not printing a `HelloWorld` line, but establishing a running entry point that can later connect to game state and patch logic.

However, this mod is still talking to itself:
it does not read game state, and it does not change any game behavior. To make it a real "game mod", we still need to know: where is the game logic, where are the functions, and where is the data?

## Summary

The point of this section is to understand IL2CPP and create a most basic IL2CPP mod:

1. Create a class library project
2. Add the necessary references
3. Paste the template code
4. Build and run the mod

You do not have to understand every detail of the template the first time. For example, a beginner in C sees the following code for the first time:

```c
#include <stdio.h>
int main(int argc, char** argv) {
	printf("Hello, World!\n");
	return 0;
}
```

They do not need to understand every detail of `#include`, `int main`, or `argc/argv`; they only need to know:

> If I write `printf` at the "right place" in this "template code", the program will output what I need.

You can first confirm that the project builds, loads, and responds to the key, and then check each line of code and its dependencies step by step. When you meet a type or call you do not understand, verify it against the framework documentation, the interop assemblies, and the runtime logs.
