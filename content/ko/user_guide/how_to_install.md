# 설치 방법

이 페이지에서는 BepInEx와 MetaMystia의 설치 과정을 안내합니다.

## 원클릭 설치 {#onclick_install}

MetaMystia Mod 관리 도구는 원클릭 설치, 업그레이드, 제거, 활성화/비활성화, 진단을 지원합니다. **모든 플레이어에게 권장**하며, 설치와 이후 업데이트를 모두 이 도구에 맡기면 됩니다.

1. 다음 주소 중 하나에서 <span class="version-manager">**meta-mystia-manager-v\*.exe**</span>를 내려받습니다:
    - GitHub:
      [https://github.com/MetaMystia/meta-mystia-manager/releases](https://github.com/MetaMystia/meta-mystia-manager/releases)
    - 이 사이트 서버:
      [https://url.izakaya.cc/getMetaMystia](https://url.izakaya.cc/getMetaMystia)

2. 다운로드가 끝나면 파일을 더블 클릭해 실행합니다.
3. 도구의 안내에 따라 필요한 기능을 선택합니다.

    ![MetaMystia Mod 관리 도구 실행 화면](./how_to_install.assets/15e3f52d-bc2c-48b7-8c39-a34370adadee.png)

## 수동 설치

<details id="install_mod">
<summary>수동 설치 단계 펼치기</summary>

수동 설치도 가능하지만 파일을 직접 받아 폴더에 넣어야 하고 자동 업데이트도 되지 않습니다. 평소에는 [원클릭 설치](#onclick_install)를 우선 사용하세요.

### 시작하기 전에 알아둘 것

시작하기 전에 몇 가지 용어를 간단히 설명합니다:

- **Mod**: 플레이어가 만든 '확장 플러그인'으로, 원본 게임에 설치해 새로운 기능을 추가합니다
- **BepInEx**: '모드 로더'로, '게임을 위해 모드를 실행해 주는 작은 프로그램'이라고 생각하면 됩니다
- **게임 루트 폴더**: 게임이 설치된 폴더, 즉 `Touhou Mystia Izakaya.exe` 파일이 보이는 곳입니다

'모드'나 컴퓨터 파일 작업이 처음이어도 걱정하지 마세요. 단계별로 차근차근 따라 하면 설치할 수 있습니다.

기억할 것은 이것 하나입니다:

> 먼저 BepInEx를 설치하고, 그다음 MetaMystia 관련 파일을 지정된 폴더에 넣는다.

### 1. BepInEx 다운로드 및 설치

1. **BepInEx BE** 공식 빌드 페이지를 엽니다:
   [https://builds.bepinex.dev/projects/bepinex_be](https://builds.bepinex.dev/projects/bepinex_be)

2. 페이지에서 《[동방 야작식당](https://store.steampowered.com/app/1584090/)》에 맞는 **IL2CPP** 버전(BepInEx Unity (IL2CPP) for Windows (x64) games)을 선택합니다.
   주의: 이 게임은 **IL2CPP**를 사용하므로 해당 버전을 선택해야 합니다. 그렇지 않으면 정상적으로 실행되지 않습니다.

3. 대부분의 플레이어는 아래 이미지에 표시된 빌드를 받으면 됩니다(이미지의 버전은 오래되었을 수 있으니 해당 최신 버전을 받으세요):

    ![BepInEx 빌드 목록](./how_to_install.assets/image-20251231114022353.png)

4. 다운로드가 끝나면 압축 파일을 **게임 루트 폴더**에 풉니다.

    > **게임 설치 폴더는 어떻게 찾나요?**
    >
    > Steam으로 게임을 설치했다면: Steam 실행 → 라이브러리에서 《동방 야작식당》 우클릭 → '관리' 클릭 → '로컬 파일 찾아보기' 클릭

    압축을 푼 뒤 폴더 구조는 대략 다음과 같습니다:

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

5. 게임을 실행합니다.
   게임을 시작할 때 **검은 콘솔 창**이 뜨면 BepInEx가 정상적으로 설치된 것입니다. 첫 실행은 로딩이 오래 걸릴 수 있으니 기다려 주세요.

### 2. Mod 다운로드 및 설치

1. 다음 주소에서 <span class="version-dll">**MetaMystia-v\*.dll**</span>을 내려받습니다:
    - GitHub:
      [https://github.com/MetaMystia/MetaMystia/releases](https://github.com/MetaMystia/MetaMystia/releases)

2. 다운로드가 끝나면 <span class="version-dll">**MetaMystia-v\*.dll**</span>을 다음 폴더에 넣습니다:

    ```plaintext
    게임 루트 폴더/BepInEx/plugins
    ```

    `plugins` 폴더가 없다면 직접 만들어 주세요.

3. MetaMystia가 제공하는 추가 콘텐츠(새로운 레어 손님 등)를 게임에 추가하려면 <span class="version-zip">**ResourceExample-v\*.zip**</span>도 내려받아야 합니다.

    다운로드가 끝나면 파일을 다음 폴더에 넣습니다(**압축을 풀 필요 없음**):

    ```plaintext
    게임 루트 폴더/ResourceEx
    ```

    `ResourceEx` 폴더가 없다면 직접 만들어 주세요.

    GitHub releases 중에는 <span class="version-zip">**ResourceExample-v\*.zip**</span>이 포함되지 않은 것도 있습니다. 이 파일을 제공하는 가장 최근 release에서 내려받으면 됩니다.

4. 게임을 다시 실행합니다. 화면 왼쪽 아래에 MetaMystia 상태 문구가 나타나면 Mod가 로드된 것입니다.

5. 리소스 팩을 설치했다면 게임 안에서 다음 명령어로 로드 결과를 확인할 수 있습니다:

    ```text
    /resourceex list
    ```

    거부된 리소스 팩은 이유와 함께 표시되고 `BepInEx/LogOutput.log`에도 기록됩니다.

</details>

## 업그레이드 방법 {#update_mod}

### 원클릭 업그레이드

MetaMystia Mod 관리 도구는 원클릭 업그레이드를 지원합니다. 업그레이드 중 문제가 생기면 도구가 자동으로 업그레이드 전 상태로 되돌리므로 안심하고 다시 시도할 수 있습니다.

도구를 받고 사용하는 방법은 [원클릭 설치](#onclick_install)를 참고하세요.

### 수동 업그레이드

이미 MetaMystia의 `.dll`과 `.zip` 파일을 설치했다면 다음 단계로 수동 업그레이드할 수 있습니다:

1. [Mod 다운로드 및 설치](#install_mod) 단계에 따라 최신 버전 파일을 지정된 폴더에 내려받습니다.
2. 이전 버전 `MetaMystia-v*.dll`을 삭제해 BepInEx가 여러 버전을 동시에 로드하지 않도록 합니다.
3. 게임을 다시 실행합니다.

> [!TIP]
> 수동으로 설치한 파일은 자동 업데이트되지 않으며 버전 호환성도 직접 확인해야 합니다. [관리 도구](#onclick_install)로 전환하는 것을 권장합니다.
