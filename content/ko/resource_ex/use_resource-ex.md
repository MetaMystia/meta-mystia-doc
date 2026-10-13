# ResourceEx 리소스 확장

[ResourceEx](https://github.com/MetaMystia/MetaMystia/tree/main/src/MetaMystia.Mod/ResourceEx)는 MetaMystia에 내장된 리소스 확장 기능입니다. 게임을 시작할 때 `ResourceEx` 폴더의 ZIP 리소스 팩을 읽고 그 안의 설정과 소재를 불러옵니다.

## 현재 지원하는 내용

| 종류            | 설정할 수 있는 내용                                                                                                                       |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 레어 손님       | 이름, 도감 설명, 일러스트, 치비 이미지, 낮 등장 위치, 영업 등장, 자금, 평가, 잡담, 호불호, 주문 요구, 유대 대화                           |
| 재료와 요리     | 재료, 요리, 레시피, 음료, 태그, 가격, 레벨, 아이콘, 조리 도구 종류                                                                        |
| 아이템          | 이름, 설명, 아이콘. 선물, 상품, 퀘스트 보상, 퀘스트 전달 대상으로 사용할 수 있습니다                                                      |
| 스토리          | 대화 패키지, 일러스트, CG 또는 배경, WAV 오디오, 분기, 이동, 종료 동작                                                                    |
| 퀘스트와 이벤트 | 퀘스트 조건, 보상(아이템과 금전 포함), 후속 퀘스트, 시간 조건, 이벤트 발동, 대화 이벤트                                                   |
| 상인            | 환영/대기 대화, 가격 배율, 재고 수량, 판매 확률, 상품 목록                                                                                |
| 의상            | 아이콘, 일러스트, 치비 이미지, 스킨 인덱스, UI 오프셋                                                                                     |
| 선물 우편함     | 지급하는 아이템, 선물 제목, 수령 시 재생되는 대화                                                                                         |
| 스펠 카드       | 캐릭터 스펠 카드의 이름, 설명, 일러스트, 효과 패키지와 지속 효과의 버프 이름·설명·아이콘. 스펠 카드 효과는 MetaMystia에 내장되어 있습니다 |
| 낮 맵           | 맵 타일, 레이어, 충돌, 시작 지점, 카메라, 음악. 현재는 미리보기 기능이며 싱글 플레이에서 `/resourceex map`으로만 들어갈 수 있습니다       |

## 예시 리소스 팩 현황

예시 팩(MetaMystia-ResourceExample)은 [관리 도구](../user_guide/how_to_install.md#onclick_install)로 설치할 수 있습니다. 리소스 팩을 만드는 창작자는 [예시 팩 저장소](https://github.com/MetaMystia/MetaMystia-ResourceExample)를 참고하세요. `ResourceEx.json`에 모든 예시 내용이 정리되어 있습니다.

예시 팩은 캐릭터, 대화, 재료, 요리, 레시피, 음료, 퀘스트, 이벤트, 상인, 의상, 선물 우편함, 스펠 카드 등의 설정을 보여 주며, 대요정, 코아쿠마, 플랑드르, 야고코로 에이린, 신키, 아키 자매, 야쿠모 란, 유키, 마이 등의 캐릭터가 포함되어 있습니다. 마이와 아키 모미지에게는 이미 사용할 수 있는 스펠 카드가 있고, 일부 캐릭터는 유대 스토리가 있으며, 나머지 내용도 계속 보충될 예정입니다.

예시 팩은 DLC1, DLC2, DLC4, DLC5에 의존합니다. 하나라도 없으면 예시 팩이 로드되지 않습니다. 자세한 내용은 [DLC 의존성](#dlc_dependency)을 참고하세요.

![예시 캐릭터](./use_resource-ex.assets/531355090-29c4d18b-2201-4ca5-8e0b-149882682493.png)

![주문하는 예시 캐릭터](./use_resource-ex.assets/531355118-2534e0c8-d3fe-4342-ac3d-7cd1d550c305.png)

![주문 예시](./use_resource-ex.assets/531355131-7cac9dd1-1adc-4973-bc07-caf2fda07b43.png)

![평가 예시](./use_resource-ex.assets/531355180-682f7460-2d3d-4fb8-930b-647e2e70bac4.png)

## 리소스 팩 설치

1. 리소스 팩 ZIP을 `게임 루트 폴더/ResourceEx`에 그대로 넣습니다. 압축을 풀지 마세요.
2. 게임을 실행합니다. 폴더가 없으면 MetaMystia가 자동으로 만듭니다.
3. `/resourceex list`를 실행해 성공적으로 로드된 팩과 거부된 팩을 확인합니다.
4. `/resourceex info <이름 또는 label>`을 실행해 메타데이터와 콘텐츠 수를 확인합니다.

로더는 `ResourceEx` 바로 아래의 확장자 `.zip` 파일만 검사하며, 하위 폴더를 재귀적으로 검사하지 않습니다.

## ZIP 구조

ZIP에는 파일 이름이 `ResourceEx.json`인 설정 파일이 반드시 있어야 합니다.

```text
ExamplePack.zip
├─ResourceEx.json
└─assets
  ├─Character
  │ └─12000
  │   └─Portrait
  │     └─0.png
  └─Audio
    └─welcome.wav
```

## DLC 의존성 {#dlc_dependency}

리소스 팩은 `ResourceEx.json`의 `packInfo.dependencies`에서 필요한 DLC를 선언할 수 있습니다. 예:

```json
"dependencies": ["CORE", "DLC2", "DLC5"]
```

- 선언한 DLC가 모두 게임에서 활성화되어 있어야 팩이 로드됩니다. 하나라도 없으면 해당 팩은 거부되며 `/resourceex list`에서 거부된 팩과 안내를 확인할 수 있습니다.
- `dependencies`를 선언하지 않은 팩은 본체에만 의존하는 것으로 간주되어 항상 로드됩니다. `CORE`는 본체를 뜻하며 항상 활성화됩니다.
- 예시 팩은 `CORE`, `DLC1`, `DLC2`, `DLC4`, `DLC5`를 선언합니다.

DLC가 모두 있는데도 거부되거나, 없는 DLC가 사용하려는 내용에 영향을 주지 않는다는 것을 알고 있다면 `게임 루트 폴더/BepInEx/config/MetaMystia.cfg`를 편집해 `[General]` 섹션의 `IgnoreDlcDependencyCheck`를 `true`로 바꾸고 게임을 다시 시작하세요. 활성화하면 모든 리소스 팩이 의존성 검사를 건너뜁니다. DLC가 없는 내용은 제대로 표시되지 않거나 알 수 없는 문제가 생길 수 있으며, MetaMystia 시작 시 경고도 표시됩니다.

## 주문 설정

음식과 음료 주문은 캐릭터 설정에서 각각 선언할 수 있습니다. 사용자 설정 파일 `BepInEx/config/MetaMystia.cfg`는 세 가지 모드를 제공합니다:

- `ForceDisable`: 강제로 끔;
- `FollowPackage`: 리소스 팩 안 각 요청의 `enable` 값을 따름;
- `ForceEnable`: 강제로 켬.

음식 주문 `FoodRequestMode`의 기본값은 `FollowPackage`, 음료 주문 `BevRequestMode`의 기본값은 `ForceDisable`입니다. 음료 주문 콘텐츠를 만들 때는 사용자에게 설정 조정이 필요할 수 있음을 알려 주세요.

## ID와 서명

ResourceEx는 현재 캐릭터, 재료, 요리, 레시피, 음료, 아이템, 의상, 낮 맵, 스펠 카드, 버프 ID에 통일된 검증을 적용합니다:

- `8999` 이하: 게임 예약 영역으로 ResourceEx에서 사용 금지;
- `9000`부터 `1073741823`까지: 관리 영역으로 유효한 ID 구간 선언이 필요하며, 서명 검증이 켜져 있으면 서명도 통과해야 함;
- `1073741824`부터 `2147483647`까지: 자유 영역으로 서명은 필요 없지만 다른 리소스 팩과의 충돌 위험은 창작자가 감수해야 함.

예시 리소스 팩은 `9000`부터 `12999`까지 서명되어 사용 중입니다. 서드파티 창작자는 이 구간을 그대로 재사용하지 마세요. 신청과 서명 방법은 [ID 서명 검증 메커니즘](./why_add_signature_check.md)을 참고하세요.

> [!CAUTION]
> 0–11999 범위의 ID는 사용하지 마세요. 1000 단위를 독립적인 창작 구간으로 사용하면 충돌을 줄일 수 있습니다.
>
> MetaMystia 개발팀에 원하는 전용 ID 구간을 알려 리소스 팩의 고유성을 확보할 수도 있습니다.

## 온라인 에디터

[MetaMystia-ResourceEx-Editor](https://editor.meta-mystia.izakaya.cc)에서는 `ResourceEx.json`을 시각적으로 편집하고 리소스 팩을 빌드할 수 있습니다. JSON을 직접 작성하고 싶지 않은 창작자에게 적합합니다.

- 온라인 에디터: [https://editor.meta-mystia.izakaya.cc](https://editor.meta-mystia.izakaya.cc)
- 소스 코드: [https://github.com/MetaMystia/MetaMystia-ResourceEx-Editor](https://github.com/MetaMystia/MetaMystia-ResourceEx-Editor)

![온라인 에디터 예시 1](./use_resource-ex.assets/image-20260110224843328.png)

![온라인 에디터 예시 2](./use_resource-ex.assets/image-20260110224858165.png)

## 대화 표시와 발동

리소스 팩의 대화 패키지는 퀘스트, 이벤트, 선물 우편함으로 발동할 수 있습니다.

낮에 게임 원래의 연동 메뉴를 열면 메뉴 끝에 다음 두 항목이 나타납니다:

- `剧情回放(MetaMystia)`: 게임 스토리와 ResourceEx 대화를 다시 봅니다. ResourceEx 대화는 한 번 읽어야 다시 볼 수 있습니다;
- `资源包礼物邮箱`: 리소스 팩이 설정한 선물을 받으며, 받을 때 해당 대화가 재생됩니다. 선물이 설정되어 있지 않으면 이 항목은 사용할 수 없습니다.

## 저작권과 재배포

MetaMystia가 제공하는 리소스 팩에는 다양한 출처의 콘텐츠가 포함되어 있으며, 부분마다 다른 저작권 규칙이 적용됩니다. 사용하거나 재배포하기 전에 자세히 읽어 보세요.

### 1. 원작 저작권 고지

이 Mod는 다음 작품을 기반으로 한 비공식 2차 창작입니다:

- 『동방 프로젝트』 상하이 앨리스 환악단 @ZUN
- 《동방 야작식당》 二色幽紫蝶
- Touhou Akis' Farm, 二色幽紫蝶

위 작품과 관련된 캐릭터, 이름, 세계관 설정 등의 원저작권은 원작자 또는 원 권리자에게 있습니다.

MetaMystia는 원작 콘텐츠에 대한 저작권을 주장하지 않습니다.

### 2. 이 프로젝트의 라이선스 범위에 속하지 않는 게임 원본 리소스

다음 경로의 리소스 파일은 MetaMystia 프로젝트의 창작물이 아니며, 해당 아트 리소스의 저작권은 원 게임 권리자에게 있습니다.

**《동방 야작식당》 二色幽紫蝶**의 리소스:

```
assets/Character/9000/*
assets/Character/9001/*
assets/Character/9002/*
assets/Character/9003/*
assets/Character/9004/*
```

**Touhou Akis' Farm**(二色幽紫蝶)의 리소스:

```
assets/Character/10000/Portrait/0.png
assets/Character/10001/Portrait/0.png
assets/Character/10002/Portrait/0.png
```

이 파일들은 원작자의 관련 작품이 허용한 범위 안에서만 사용됩니다.

MetaMystia의 창작 리소스가 아니며 아래의 CC 라이선스도 적용되지 않습니다. MetaMystia는 이 리소스에 대해 재배포나 2차 창작 권한을 부여하지 않습니다.

### 3. MetaMystia 창작 리소스 라이선스

2절에 나열된 내용을 제외하고, MetaMystia 프로젝트 팀이 창작한 나머지 리소스는 다음 라이선스를 따릅니다:

> **Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

이 라이선스를 지키는 조건에서 비상업적 사용, 수정, 2차 창작이 가능하며, 출처를 밝히고 같은 라이선스로 공유해야 합니다.

### 4. 리소스 목록 변경 안내

MetaMystia 프로젝트는 개발 진행에 따라 리소스를 계속 갱신합니다. 위의 '비창작 리소스 목록'은 향후 버전에서 변경(추가 또는 제거)될 수 있습니다.

저작권 판단은 항상 **해당 버전이 배포될 당시의 이 파일 내용**을 기준으로 하세요. 특정 파일의 저작권 상태가 불확실하다면, 창작 또는 라이선스가 명시되지 않은 한 CC 라이선스 범위에 속하지 않는 것으로 간주하세요.

### 5. 면책 조항

이 프로젝트는 비공식 2차 창작이며 원작 권리자와 직접적인 관련이 없습니다. 원 권리자가 요청하면 관련 내용을 수정하거나 삭제할 수 있습니다.

새로운 리소스 팩 창작자가 되려면 다음을 반드시 지키세요:

- 거주 국가나 지역의 관련 법규를 준수할 것
- 사용하는 소재에 대한 합법적인 저작권을 보유했거나 원작자로부터 2차 창작 허가를 받았을 것
- **二色幽紫蝶** 및 모든 서드파티 창작자의 정당한 권리를 침해하지 않을 것
- 『[동방 프로젝트 사용 규정](https://www.bilibili.com/opus/400555526272745308)』을 엄격히 따를 것
