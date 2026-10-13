# スキンシステム

スキンシステムはローカルのキャラクターの見た目を差し替え、その選択をルーム内の他のプレイヤーに同期します。ゲーム本来のキャラクターと衣装、DLC、ResourceExのキャラクターと衣装、スキンサイトからダウンロードしたオンラインスキンに対応しています。

## ゲームとResourceExのスキン

まず`/skin list`を実行して、現在の環境で利用できるキャラクターID、種類、インデックスを確認し、次を使います：

```text
/skin set <characterId> <Default|Explicit|DLC> <skinIndex>
```

例：

```text
/skin set 21 Explicit 0
```

![キャラクタースキンの例](./skin.assets/image-20260330221731828.png)

対応するDLCを持っている場合は、DLCキャラクターも選べます：

```text
/skin set 2006 Default 0
```

![DLCキャラクタースキンの例](./skin.assets/image-20260330222239839.png)

`/skin off`を実行すると手動の上書きを解除し、ゲーム既定の見た目に戻します。スキンはマルチプレイで同期されますが、ローカルリソースのスキンを正しく表示するには、他のプレイヤーも対応するゲーム、DLC、ResourceExのコンテンツを持っている必要があります。

## オンラインスキン

オンラインスキンはスキンサイトから名前でダウンロードします：

```text
/skin net <name>
```

ダウンロードが完了するまでは代わりの見た目が表示されます。`/skin net refresh`は現在のスキンのキャッシュを消して再ダウンロードし、`/skin net off`はオンラインスキンをオフにします。

現在このドキュメントに記載している名前は次のとおりです。スキンサイトで実際に提供される内容は予告なく変わることがあります。

|   名前    |              プレビュー               |
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

## 回転の上書き

一部の立ち絵では、キャラクターの回転動作を上書きする必要があります：

```text
/skin rot on
/skin rot off
/skin rot clear
```

`clear`は手動の上書きを解除し、スキンまたはゲーム自身の回転設定にすぐ戻します。

コマンドの詳細は[よく使うコマンド](./commands.md)をご覧ください。
