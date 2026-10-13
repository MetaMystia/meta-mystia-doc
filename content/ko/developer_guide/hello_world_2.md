# Hello World 2편

이 섹션은 구체적인 예를 통해 게임 로직을 감사하고 필요한 함수 진입점을 찾는 방법을 소개합니다. 이 예가 모든 게임에 그대로 적용되지는 않지만, "보이는 동작에서 단서를 추출하고 타입, 시그니처, 호출 관계로 검증한다"는 방법은 일반적으로 통용됩니다. 여기서는 《동방 야작식당》에서 왼쪽 아래 알림을 표시하는 함수를 찾아 `Hello World!`를 표시하게 만드는 것이 목표입니다.

## 전제 조건

시작하기 전에 [개발 시작하기](./getting_started.md)의 내용을 모두 완료했는지 확인하세요. 게임 로직 감사의 난이도는 원 게임의 구조, 명명 습관, 컴파일러 최적화, 코드 난독화 등의 영향을 받습니다. 《동방 야작식당》은 타입과 멤버 이름이 비교적 명확하게 남아 있어 UI 동작, 호출 관계, 타입 이름에서 범위를 점차 좁힐 수 있습니다. 감사 결과는 여전히 디컴파일 결과, Interop 어셈블리, 실제 실행 결과와 함께 검증해야 합니다.

## 전체 감사

위치를 찾기 전에 프로젝트의 명명 습관과 모듈 구성을 관찰합니다. 《동방 야작식당》의 관련 타입은 주로 `Common`, `DayScene`, `GameData`, `MainScene`, `NightScene` 등의 네임스페이스에 분포합니다. UI 관련 타입에는 `UI`가, DLC 관련 타입에는 `DLCx`가 포함되는 경우가 많고, 게임 데이터는 주로 `GameData`에 모여 있습니다.

![image-20260601123546708](./hello_world_2.assets/image-20260601123546708.png)

## 게임 로직 분석

기능을 찾을 때는 먼저 그 발동 조건, 입력과 출력, 가능한 호출 위치를 기록합니다. 왼쪽 아래 알림에서는 다음 단서를 얻을 수 있습니다:

1. 입력으로 문자열이 필요하다.
2. 여러 알림이 동시에 표시되며 순서와 각자의 수명 주기가 있다.
3. 알림은 퀘스트 시작, 종료 등의 시점에 자주 나타나므로 그 호출 위치에서 표시 함수를 역으로 찾을 수 있다.
4. 일반 텍스트 알림 외에 아이콘이 있는 알림도 있다. 이런 기능은 하위 표시 컴포넌트를 공유할 수 있으므로 인접한 타입과 오버로드를 따라 계속 찾을 수 있다.
5. 이 알림은 DayScene뿐 아니라 NightScene에도 있다.

![image-20260601123641378](./hello_world_2.assets/image-20260601123641378.png)

![image-20260601123705298](./hello_world_2.assets/image-20260601123705298.png)

![image-20260601123803783](./hello_world_2.assets/image-20260601123803783.png)

## 코드 감사

이 단서들을 바탕으로 다음 방향으로 검색할 수 있습니다:

1. UI와 관련되므로 네임스페이스에 `UI`가 포함된 클래스일 수 있다.
2. 알림과 관련되므로 네임스페이스에 `Notify`, `Message`, `Toast` 등이 포함된 클래스일 수 있다.
3. 장면과 무관하므로 DayScene과 NightScene 양쪽에 있거나 Common에 직접 있을 수 있다.
4. 변형이 많아 문자열만 받는 것도 있고, 여러 매개변수로 다른 알림을 표시하는 것도 있다.
5. 호출 상황이 여러 가지다. 다른 알림의 발동 조건과 호출 관계에 익숙하다면 호출 관계를 조회해 확인할 수 있다.

현재 분석 결과에서 대상 타입은 `Common.UI.ReceivedObjectDisplayerController`이고, 멤버 함수 `NotifyTextMessage`의 시그니처는 `public void NotifyTextMessage(string content)`입니다.

![image-20260601124449894](./hello_world_2.assets/image-20260601124449894.png)

이 타입은 `DEYU.Singletons.MonoSingleton<Common.UI.ReceivedObjectDisplayerController>`를 상속하므로, `Instance` 속성으로 인스턴스를 얻어 멤버 함수를 호출할 수 있습니다.

테스트를 위해 `PluginManager.Update`에 다음 코드를 추가합니다:

```csharp
if (Input.GetKeyDown(KeyCode.F2)) // 按下 F2 键
{
	Common.UI.ReceivedObjectDisplayerController.Instance.NotifyTextMessage("Hello World!");
}
```

![image-20260601124804831](./hello_world_2.assets/image-20260601124804831.png)

컴파일할 때 다음 오류가 나타납니다:

> error CS0012: 'MonoSingleton<>' 형식이 참조되지 않은 어셈블리에 정의되어 있습니다. 'DEYU.Singletons, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null' 어셈블리에 대한 참조를 추가해야 합니다.

그래서 `BepInEx/interop/DEYU.Singletons.dll` 참조를 추가하고 다시 컴파일합니다. 컴파일이 성공하면 게임을 실행하고 <kbd>F2</kbd>를 누르면 왼쪽 아래에 Hello World 알림이 나타나는 것을 볼 수 있습니다.

![image-20260601125221011](./hello_world_2.assets/image-20260601125221011.png)

## Hook 보조

함수를 직접 호출하기 어렵다면 `HarmonyPatch`로 Hook을 추가하고 로그로 대상 함수가 예상 시점에 실행되는지 확인할 수도 있습니다. Hook 위치와 `Prefix`, `Postfix` 선택은 함수 이름만 보고 판단하지 말고 실제 호출 체인에 근거해야 합니다.

## AI 보조

AI는 후보 타입 검색, 호출 관계 정리, 감사 노트 작성을 도울 수 있지만, 제시된 멤버 이름, 시그니처, 호출 결론은 리버스 코드, Interop 어셈블리, 또는 실제 실행 결과로 검증해야 합니다.
