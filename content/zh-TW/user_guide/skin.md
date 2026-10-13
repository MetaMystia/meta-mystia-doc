# 外觀系統

外觀系統可以替換本機角色外觀，並把選擇同步給房間內其他玩家。它支援遊戲原有角色和服裝、DLC、ResourceEx角色和服裝，以及從外觀站下載的網路外觀。

## 遊戲和ResourceEx外觀

先執行`/skin list`查看目前環境中可用的角色ID、類型和索引，再使用：

```text
/skin set <characterId> <Default|Explicit|DLC> <skinIndex>
```

例如：

```text
/skin set 21 Explicit 0
```

![角色外觀示例](./skin.assets/image-20260330221731828.png)

擁有對應DLC時，也可以選擇DLC角色：

```text
/skin set 2006 Default 0
```

![DLC角色外觀示例](./skin.assets/image-20260330222239839.png)

執行`/skin off`會清除手動覆寫並恢復遊戲預設外觀。外觀會在連線中同步，但其他玩家必須擁有對應的遊戲、DLC或ResourceEx資源，才能正確顯示本機資源外觀。

## 網路外觀

網路外觀由外觀站按名稱下載：

```text
/skin net <name>
```

下載完成前會先顯示佔位外觀。`/skin net refresh`會清除目前外觀快取並重新下載，`/skin net off`關閉網路外觀。

目前文件記錄的名稱如下；外觀站實際提供的內容可能隨時調整。

|   名稱    |                 預覽                  |
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

## 旋轉覆寫

部分貼圖需要覆寫角色旋轉行為：

```text
/skin rot on
/skin rot off
/skin rot clear
```

`clear`會清除手動覆寫，並立即恢復外觀或遊戲自身的旋轉設定。

完整指令說明參見[常用指令](./commands.md)。
