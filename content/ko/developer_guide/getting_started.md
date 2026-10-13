# 개발 시작하기

이 가이드는 C#과 .NET에 익숙하지만 Unity IL2CPP 모드 개발 경험은 없을 수 있는 기여자를 대상으로, 현재 저장소의 빌드 설정과 기본적인 리버스 엔지니어링 도구를 설명합니다.

## 프로젝트 빌드

시작하기 전에 시스템이 다음 조건을 충족하는지 확인하고 순서대로 설정을 완료하세요.

1. **.NET 10 SDK**:
   [https://dotnet.microsoft.com/ko-kr/download/dotnet/10.0](https://dotnet.microsoft.com/ko-kr/download/dotnet/10.0)

2. 《[동방 야작식당](https://store.steampowered.com/app/1584090)》의 **정품 사본**(Steam 버전).

3. **MetaMystia** 저장소를 복제합니다:
   [https://github.com/MetaMystia/MetaMystia](https://github.com/MetaMystia/MetaMystia)

4. 최신 **BepInEx-Unity.IL2CPP-win-x64**를 내려받습니다:
   [https://builds.bepinex.dev/projects/bepinex_be](https://builds.bepinex.dev/projects/bepinex_be)

    그리고 게임 설치 루트(`Touhou Mystia Izakaya.exe`가 있는 폴더)에 완전히 압축을 풉니다.

5. 게임을 한 번 실행하고 메인 메뉴에 들어간 뒤 종료합니다. BepInEx가 프로젝트 빌드에 필요한 `core`, `interop` 등의 어셈블리를 생성합니다.

6. MetaMystia 저장소 루트에서 로컬 설정 템플릿을 복사합니다:

    ```powershell
    Copy-Item MetaMystia.local.props.example MetaMystia.local.props
    ```

7. `MetaMystia.local.props`를 편집해 `BepInExPath`를 게임 디렉터리의 `BepInEx` 폴더로 설정합니다:

    ```xml
    <Project>
      <PropertyGroup>
        <BepInExPath>게임 설치 폴더\BepInEx</BepInExPath>
      </PropertyGroup>
    </Project>
    ```

    `MetaMystia.local.props`는 저장소의 `*.local.props` 무시 규칙에 해당하므로 커밋하지 마세요. 프로젝트는 이 경로로 `BepInEx/core`와 `BepInEx/interop`의 어셈블리를 참조하고 빌드 산출물을 `BepInEx/plugins`에 출력합니다.

8. .NET 솔루션을 지원하는 IDE에서 `MetaMystia.sln`을 열거나 저장소 루트에서 다음을 실행합니다:

    ```powershell
    dotnet build MetaMystia.sln
    ```

9. 빌드는 `BepInEx/plugins/MetaMystia-v<버전>.dll`을 생성하고 `MetaMystia.Preloader.dll`을 `BepInEx/patchers/MetaMystia`로 복사합니다.

메인 프로젝트의 대상 프레임워크는 .NET 6.0이고 현재 C# 14 문법을 사용하므로 개발 환경에는 .NET 10 SDK를 설치합니다. 소스 생성기 프로젝트의 대상 프레임워크는 .NET Standard 2.0입니다. `src/MetaMystia.Network.Tests`와 `src/MetaMystia.Flow.Tests` 같은 테스트 프로젝트를 실행하려면 .NET 6 런타임도 필요합니다.

## 도구 준비

효율적인 모드 개발과 리버스 엔지니어링을 위해 다음 도구를 미리 준비하는 것을 권장합니다.

### 핵심 도구

#### IDA Pro

`GameAssembly.dll`을 디스어셈블해 분석하고 필요할 때 동적 디버깅을 하는 데 사용합니다. IL2CPP 게임에서는 네이티브 코드의 제어 흐름과 호출 관계를 확인하는 데 도움이 됩니다.

- 공식 사이트: [https://hex-rays.com/ida-pro](https://hex-rays.com/ida-pro)

> [!NOTE]
> IDA Free로도 기본 분석은 가능하지만 Pro 버전과 기능 및 플러그인 지원이 다릅니다. 필요한 기능에 따라 정품 라이선스 버전을 선택하세요. 이 문서는 크랙이나 라이선스 우회 방법을 제공하지 않습니다.

#### dnSpyEx

.NET 어셈블리 정적 분석에 사용합니다. IL2CPP 환경에서는 주로 Il2CppDumper가 생성한 더미 DLL을 열어 클래스 구조, 필드 배치, 메서드 시그니처를 이해하는 데 사용합니다. 원래 `dnSpy/dnSpy` 저장소는 아카이브되었으므로 유지보수 중인 dnSpyEx 포크를 사용합니다.

- GitHub 저장소: [https://github.com/dnSpyEx/dnSpy](https://github.com/dnSpyEx/dnSpy)

#### Il2CppDumper

IL2CPP가 생성한 바이너리를 분석해 기호 정보를 복원하고, dnSpy와 IDA에서 사용할 보조 파일을 생성합니다.

- GitHub 저장소: [https://github.com/Perfare/Il2CppDumper](https://github.com/Perfare/Il2CppDumper)

### 권장 플러그인(선택)

#### IDA-Pro-MCP

이 플러그인을 사용하면 AI Agent가 MCP 인터페이스로 IDA 데이터베이스에 접근할 수 있습니다. 함수 위치 파악, 제어 흐름 이해, 분석 속도 향상에 도움이 됩니다.

- 설치 참고: [https://github.com/mrexodia/ida-pro-mcp?tab=readme-ov-file#installation](https://github.com/mrexodia/ida-pro-mcp?tab=readme-ov-file#installation)

#### dnSpy.Cpp2IL

Cpp2IL의 분석 결과를 dnSpy 뷰에 통합해 IL2CPP 복원 코드를 볼 때 더 많은 정보를 제공하는 dnSpy 플러그인입니다. 설치 전에 플러그인 저장소 설명에 따라 사용하는 dnSpy 버전과의 호환성을 확인하세요.

- 설치 참고: [https://github.com/BadRyuner/dnspy.Cpp2IL?tab=readme-ov-file#how-to-install](https://github.com/BadRyuner/dnspy.Cpp2IL?tab=readme-ov-file#how-to-install)

## 리버스 엔지니어링 준비

이 섹션에서는 위 도구로 IL2CPP 분석 환경을 준비하는 방법을 설명합니다. 완료하면 dnSpy에서 복원된 타입 구조를 살펴보고 IDA에서 기호가 적용된 디스어셈블리 분석을 할 수 있습니다.

### Il2CppDumper로 기호 복원

1. `Il2CppDumper.exe`를 실행합니다.

2. 안내에 따라 다음 파일을 차례로 불러옵니다:
    - 게임 디렉터리의 `GameAssembly.dll`
    - `Touhou Mystia Izakaya_Data/il2cpp_data/Metadata/global-metadata.dat`

3. 자동 분석이 끝날 때까지 기다립니다. 완료되면 여러 출력 폴더가 생성되며, 이후 단계에서는 주로 다음을 사용합니다:
    - `DummyDll/`

### dnSpy로 가져오기

1. Il2CppDumper가 생성한 `DummyDll/Assembly-CSharp.dll`을 dnSpy로 가져옵니다.

2. 이 파일로 게임 로직의 클래스 정의, 필드 이름, 메서드 시그니처를 비교적 직관적으로 확인하고 dll 안의 가상 주소를 찾을 수 있습니다.

### IDA Pro로 가져오기

1. IDA Pro로 `GameAssembly.dll`을 열고 초기 자동 분석이 끝날 때까지 기다립니다(처음 열 때는 오래 걸릴 수 있습니다).

2. IDA에서 `File -> Script file`을 클릭하고 Il2CppDumper가 생성한 `ida_with_struct.py` 스크립트를 실행합니다. 일부 버전은 Python 3 스크립트를 `ida_with_struct_py3.py`로 이름 짓습니다. 실제 출력 파일을 기준으로 하세요.

3. 스크립트 안내에 따라 생성된 `script.json`과 `il2cpp.h` 파일을 차례로 선택하고, 기호와 구조 정보 가져오기가 끝날 때까지 기다립니다.

    ![IDA에서 스크립트 실행 단계](./getting_started.assets/image-20251231124728238.png)

4. 가져오기가 끝나면 IDA를 닫고 **데이터베이스를 저장**합니다. 저장 대화 상자에서는 `Collect` 옵션을 선택해 전체 분석 정보를 남기는 것을 권장합니다.

    ![IDA 저장 대화 상자](./getting_started.assets/image-20251231125239242.png)

5. 생성된 `GameAssembly.dll.i64` 데이터베이스 파일을 별도로 백업합니다.

> [!TIP]
> 동적 디버깅에서는 **ASLR** 때문에 모듈의 런타임 기준 주소(예: `0x7FFF25021000`)가 정적 분석 때의 주소(예: `0x180001000`)와 달라져 주소 대조가 혼란스러워지기 쉽습니다. 원본 정적 데이터베이스를 남겨 두면 IDA의 Rebase가 정적 분석에 영향을 주는 것을 피할 수 있습니다.

### 보조 Skill

AI Agent는 호출 관계 검색과 감사 기록 정리를 도울 수 있지만, 게임 동작은 여전히 리버스 코드, Interop 어셈블리, 실제 실행 결과로 교차 검증해야 합니다. IDA Pro MCP로 IL2CPP 소스를 복원할 때는 [il2cpp-to-csharp-skill](https://github.com/MetaMikuAI/il2cpp-to-csharp-skill)을 참고하세요.
