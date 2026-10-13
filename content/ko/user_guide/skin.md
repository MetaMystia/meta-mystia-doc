# 스킨 시스템

스킨 시스템은 로컬 캐릭터 외형을 교체하고 선택한 결과를 방 안의 다른 플레이어에게 동기화합니다. 게임 원래의 캐릭터와 의상, DLC, ResourceEx 캐릭터와 의상, 스킨 사이트에서 내려받은 온라인 스킨을 지원합니다.

## 게임 및 ResourceEx 스킨

먼저 `/skin list`를 실행해 현재 환경에서 사용할 수 있는 캐릭터 ID, 종류, 인덱스를 확인한 뒤 다음을 사용합니다:

```text
/skin set <characterId> <Default|Explicit|DLC> <skinIndex>
```

예:

```text
/skin set 21 Explicit 0
```

![캐릭터 스킨 예시](./skin.assets/image-20260330221731828.png)

해당 DLC를 보유하고 있다면 DLC 캐릭터도 선택할 수 있습니다:

```text
/skin set 2006 Default 0
```

![DLC 캐릭터 스킨 예시](./skin.assets/image-20260330222239839.png)

`/skin off`를 실행하면 수동 덮어쓰기를 지우고 게임 기본 외형으로 돌아갑니다. 스킨은 멀티플레이에서 동기화되지만, 로컬 리소스 스킨을 올바르게 표시하려면 다른 플레이어도 해당 게임, DLC, ResourceEx 콘텐츠를 보유하고 있어야 합니다.

## 온라인 스킨

온라인 스킨은 스킨 사이트에서 이름으로 내려받습니다:

```text
/skin net <name>
```

다운로드가 끝나기 전에는 임시 외형이 표시됩니다. `/skin net refresh`는 현재 스킨 캐시를 지우고 다시 내려받으며, `/skin net off`는 온라인 스킨을 끕니다.

현재 문서에 기록된 이름은 다음과 같습니다. 스킨 사이트에서 실제로 제공되는 내용은 언제든지 바뀔 수 있습니다.

|   이름    |               미리보기                |
| :-------: | :-----------------------------------: |
| `DMShion` | ![DMShion](./skin.assets/DMShion.png) |
| `DMJyoon` | ![DMJyoon](./skin.assets/DMJyoon.png) |
| `DMUrumi` | ![DMUrumi](./skin.assets/DMUrumi.png) |
|   `Box`   |     ![Box](./skin.assets/Box.png)     |
|  `Ball`   |    ![Ball](./skin.assets/Ball.png)    |
|   `AQ`    |      ![AQ](./skin.assets/AQ.png)      |
|   `Bun`   |     ![Bun](./skin.assets/Bun.png)     |
|  `Stone`  |   ![Stone](./skin.assets/Stone.png)   |
|   `Cat`   |     ![Cat](./skin.assets/Cat.png)     |
|   `Dog`   |     ![Dog](./skin.assets/Dog.png)     |
| `Kedama`  |  ![Kedama](./skin.assets/Kedama.png)  |

## 회전 덮어쓰기

일부 일러스트는 캐릭터 회전 동작을 덮어써야 합니다:

```text
/skin rot on
/skin rot off
/skin rot clear
```

`clear`는 수동 덮어쓰기를 지우고 스킨 또는 게임 자체의 회전 설정으로 즉시 복원합니다.

전체 명령어 설명은 [자주 쓰는 명령어](./commands.md)를 참고하세요.
