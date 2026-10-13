# Hello World 1편

이 섹션은 최소한의 예제에서 시작해 BepInEx가 로드할 수 있는 Unity IL2CPP 모드를 만들고, Unity 생명주기에서 사용자 지정 코드를 실행하는 방법을 보여 줍니다.

## Mono와 IL2CPP

Unity 게임에서 흔히 쓰는 스크립팅 백엔드에는 Mono와 IL2CPP가 있습니다.

Mono 모드에서는 Unity가 C# 스크립트를 IL(중간 언어)로 컴파일하고, 런타임에 Mono 가상 머신이 해석하거나 JIT로 실행합니다. 그래서 게임 폴더에는 보통 `Assembly-CSharp.dll`, `mscorlib.dll` 같은 표준 .NET 어셈블리가 있으며, 개발자와 모드 제작자 모두 이 DLL을 그대로 디컴파일해 전체 C# 소스 구조를 얻을 수 있습니다.

IL2CPP는 다른 빌드 경로를 사용합니다. Unity가 먼저 C# 스크립트의 IL을 C++ 코드로 변환하고, 플랫폼 네이티브 컴파일러(MSVC, Clang 등)가 이를 기계어로 컴파일합니다. Windows에서는 게임 로직이 보통 `GameAssembly.dll`에 있으며, 런타임에 Mono가 해당 스크립트 IL을 실행하지 않습니다.

리버스 엔지니어링에서는 바로 디컴파일할 수 있는 스크립트 IL이 아니라 네이티브 기계어를 다루게 됩니다. 클래스 이름, 메서드 이름, 타입 구조 같은 정보 일부는 전역 메타데이터에 남아 있으므로, 메타데이터와 `GameAssembly.dll`을 결합해 읽을 수 있는 타입과 함수 대응을 복원해야 합니다.

## Mono와 IL2CPP 구분

Unity 게임이 어느 런타임을 쓰는지 구분하는 것은 간단합니다. 보통 게임 폴더만 확인하면 됩니다:

- 게임 폴더에 다음이 있으면:

    ```
    GameAssembly.dll
    global-metadata.dat
    ```

    보통 **IL2CPP**입니다.

- 게임 폴더에 다음이 있고:

    ```
    Assembly-CSharp.dll
    UnityEngine.dll
    mscorlib.dll
    ```

    `GameAssembly.dll`이 없으면 보통 **Mono**입니다.

Windows에서 IL2CPP 게임에는 보통 다음 폴더도 있습니다:

```
<게임 이름>_Data\il2cpp_data\
```

여기에 `global-metadata.dat`와 기타 런타임 데이터가 저장됩니다.

## `global-metadata.dat`의 역할

IL2CPP가 스크립트를 네이티브 코드로 컴파일하더라도 Unity는 타입과 리플렉션에 필요한 메타데이터를 유지해야 합니다. `global-metadata.dat`에는 클래스 이름, 메서드 이름, 필드, 매개변수 타입, 상속 관계 등의 정보가 들어 있습니다.

이 정보는 일반 디버그 기호처럼 `GameAssembly.dll`의 네이티브 함수에 직접 붙어 있지 않습니다. Il2CppDumper가 `global-metadata.dat`와 `GameAssembly.dll`의 관련 테이블 구조를 분석해 더미 DLL, IDA 스크립트, 타입 정의를 생성하면 메서드와 주소 사이의 대응을 복원하는 데 도움이 됩니다. 컴파일러 최적화로 네이티브 코드 일부가 바뀌거나 합쳐질 수 있으므로 도구 출력은 실제 디스어셈블리 결과와 함께 판단해야 합니다.

## 프로젝트 만들기

> [!CAUTION]
>
> 아래 코드를 읽는 것이 부담스럽다면 먼저 이 장의 마지막 [요약](#요약)을 읽고, 무엇을 중점적으로 보고 무엇을 잠시 건너뛰어도 되는지 확인하세요.

[개발 시작하기](./getting_started.md)에 따라 BepInEx 설치를 마치고 게임 메인 메뉴에 한 번 이상 들어가 있어야 합니다.

Visual Studio를 예로, 새 "클래스 라이브러리" 프로젝트를 만들고 `HelloWorld`라고 이름 짓습니다.

![image-20260110235827527](./hello_world_1.assets/image-20260110235827527.png)

![image-20260110235905507](./hello_world_1.assets/image-20260110235905507.png)

![image-20260110235958050](./hello_world_1.assets/image-20260110235958050.png)

대상 프레임워크는 .NET 6.0을 선택합니다.

![image-20260111130000646](./hello_world_1.assets/image-20260111130000646.png)

## 참조 추가

프로젝트의 **종속성**을 마우스 오른쪽 버튼으로 클릭하고 **프로젝트 참조 추가**를 선택한 뒤, "찾아보기"로 필요한 DLL을 추가합니다.

![image-20260111002004609](./hello_world_1.assets/image-20260111002004609.png)

먼저 게임 루트의 다음 파일을 추가합니다:

```
./BepInEx/interop/Assembly-CSharp.dll
./BepInEx/core/BepInEx.Core.dll
./BepInEx/core/BepInEx.Unity.IL2CPP.dll
```

이 세 참조는 "로컬 복사"를 `False`로 설정해 게임과 BepInEx에 포함된 어셈블리가 출력 폴더로 복사되지 않게 합니다.

![image-20260111002504985](./hello_world_1.assets/image-20260111002504985.png)

프로젝트의 출력 경로를 `BepInEx/plugins` 폴더로 바꿉니다.

![image-20260111003000981](./hello_world_1.assets/image-20260111003000981.png)

`Class1.cs`에 다음 코드를 작성합니다:

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

**빌드** 메뉴의 **솔루션 빌드**를 클릭해 모드 DLL을 빌드합니다.

![image-20260111003245758](./hello_world_1.assets/image-20260111003245758.png)

빌드가 성공하면 게임을 실행합니다. 콘솔에 플러그인 로드 시 출력되는 로그가 보일 것입니다.

![image-20260111003428455](./hello_world_1.assets/image-20260111003428455.png)

다음으로 아래 참조를 추가하고 마찬가지로 "로컬 복사"를 `False`로 설정합니다:

```
./BepInEx/core/0Harmony.dll
./BepInEx/core/Il2CppInterop.Runtime.dll
./BepInEx/interop/Il2Cppmscorlib.dll
./BepInEx/interop/UnityEngine.CoreModule.dll
./BepInEx/interop/UnityEngine.InputLegacyModule.dll
./BepInEx/interop/UnityEngine.UI.dll
```

`Class1.cs`의 이름을 `Plugin.cs`로 바꾸고 다음 코드로 교체합니다:

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

`PluginManager.cs`를 새로 만들고 다음 코드를 작성합니다:

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

빌드가 성공하면 게임을 실행합니다. <kbd>F1</kbd>을 누르면 콘솔에 `HelloWorld from my first IL2CPP Mod!`가 출력될 것입니다.

![image-20260111130151837](./hello_world_1.assets/image-20260111130151837.png)

여기까지 가장 기본적인 IL2CPP 모드를 완성했습니다:

BepInEx가 로드하고, Unity 생명주기에서 실행되며, 키 입력으로 사용자 지정 로직을 실행할 수 있습니다. 중요한 것은 `HelloWorld` 한 줄을 출력하는 것이 아니라, 앞으로 게임 상태와 패치 로직을 연결할 수 있는 실행 진입점을 만드는 것입니다.

다만 이 모드는 아직 혼잣말을 하는 상태입니다:
게임 상태를 읽지도, 게임 동작을 바꾸지도 않습니다. 진짜 "게임 모드"가 되려면 게임 로직이 어디에 있고, 함수가 어디에 있고, 데이터가 어디에 있는지 알아야 합니다.

## 요약

이 섹션의 핵심은 IL2CPP를 이해하고 가장 기본적인 IL2CPP 모드를 만드는 것입니다:

1. 클래스 라이브러리 프로젝트 만들기
2. 필요한 참조 추가하기
3. 템플릿 코드 붙여 넣기
4. 모드 빌드하고 실행하기

처음부터 템플릿의 모든 세부 사항을 이해할 필요는 없습니다. 예를 들어 C 언어를 처음 배우는 사람이 다음 코드를 처음 볼 때:

```c
#include <stdio.h>
int main(int argc, char** argv) {
	printf("Hello, World!\n");
	return 0;
}
```

`#include`, `int main`, `argc/argv` 같은 세부 사항을 전부 이해할 필요는 없고, 다음만 알면 됩니다:

> 이 "템플릿 코드"의 "적절한 위치"에 `printf`를 쓰면 프로그램이 필요한 내용을 출력한다.

먼저 프로젝트가 빌드되고 로드되며 키 입력에 반응하는지 확인한 뒤, 각 코드 줄과 그 의존성을 차근차근 확인하세요. 이해되지 않는 타입이나 호출을 만나면 프레임워크 문서, Interop 어셈블리, 실행 로그와 함께 검증해야 합니다.
