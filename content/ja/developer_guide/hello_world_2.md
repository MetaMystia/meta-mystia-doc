# Hello World その2

このセクションでは、具体的な例を通じて、ゲームロジックを監査し、必要な関数の入口を見つける方法を説明します。この例がすべてのゲームにそのまま当てはまるわけではありませんが、「見える挙動から手がかりを抽出し、型・シグネチャ・呼び出し関係で検証する」という方法は汎用的です。ここでは『東方夜雀食堂』で左下の通知を表示する関数を見つけ、`Hello World!`を表示させることを目標にします。

## 前提

始める前に、[開発入門](./getting_started.md)の内容をすべて完了していることを確認してください。ゲームロジックの監査の難易度は、元のゲームのアーキテクチャ、命名習慣、コンパイラの最適化、コードの難読化などの影響を受けます。『東方夜雀食堂』は型とメンバーの命名が比較的はっきり残っているため、UIの挙動、呼び出し関係、型名から範囲を少しずつ絞り込めます。監査結果は依然として逆コンパイル結果、Interopアセンブリ、実際の実行結果と合わせて検証してください。

## 全体の監査

特定を始める前に、プロジェクトの命名習慣とモジュール構成を観察します。『東方夜雀食堂』の関連する型は主に`Common`、`DayScene`、`GameData`、`MainScene`、`NightScene`などの名前空間に分布しています。UI関連の型には`UI`が、DLC関連の型には`DLCx`が含まれることが多く、ゲームデータは主に`GameData`に集中しています。

![image-20260601123546708](./hello_world_2.assets/image-20260601123546708.png)

## ゲームロジックの分析

機能を特定するときは、まずその発動条件、入出力、呼び出し位置の候補を記録します。左下の通知については、次の手がかりが得られます：

1. 入力として文字列が必要。
2. 複数の通知が同時に表示され、順序とそれぞれのライフサイクルがある。
3. 通知はクエストの開始や終了などのタイミングでよく現れるので、それらの呼び出し位置から表示関数を逆に探せる。
4. プレーンテキストの通知以外に、アイコン付きの通知もある。これらの機能は下層の表示コンポーネントを共有している可能性があるので、隣接する型やオーバーロードをたどって探せる。
5. この通知はDaySceneだけでなくNightSceneにも存在する。

![image-20260601123641378](./hello_world_2.assets/image-20260601123641378.png)

![image-20260601123705298](./hello_world_2.assets/image-20260601123705298.png)

![image-20260601123803783](./hello_world_2.assets/image-20260601123803783.png)

## コードの監査

これらの手がかりから、次の方向で検索できます：

1. UI関連なので、名前空間に`UI`を含むクラスの可能性がある。
2. 通知関連なので、名前空間に`Notify`、`Message`、`Toast`などを含むクラスの可能性がある。
3. シーンに依存しないので、DaySceneとNightSceneの両方にあるか、Commonに直接ある可能性がある。
4. 多くの変種があり、文字列だけを渡すものもあれば、複数の引数で異なる通知を表示するものもある。
5. 呼び出しの状況が複数ある。他の通知の発動条件や呼び出し関係に詳しければ、呼び出し関係をたどって確認できる。

現在の分析結果では、対象の型は`Common.UI.ReceivedObjectDisplayerController`で、メンバー関数`NotifyTextMessage`のシグネチャは`public void NotifyTextMessage(string content)`です。

![image-20260601124449894](./hello_world_2.assets/image-20260601124449894.png)

この型は`DEYU.Singletons.MonoSingleton<Common.UI.ReceivedObjectDisplayerController>`を継承しているため、その`Instance`プロパティからインスタンスを取得してメンバー関数を呼び出せます。

テストのため、`PluginManager.Update`に次のコードを追加します：

```csharp
if (Input.GetKeyDown(KeyCode.F2)) // 按下 F2 键
{
	Common.UI.ReceivedObjectDisplayerController.Instance.NotifyTextMessage("Hello World!");
}
```

![image-20260601124804831](./hello_world_2.assets/image-20260601124804831.png)

コンパイル時に次のエラーが出ます：

> error CS0012: 型 'MonoSingleton<>' は、参照されていないアセンブリ内で定義されています。アセンブリ 'DEYU.Singletons, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null' への参照を追加する必要があります。

そこで`BepInEx/interop/DEYU.Singletons.dll`の参照を追加し、再コンパイルします。コンパイルが成功したらゲームを起動し、<kbd>F2</kbd>を押すと、左下にHello Worldの通知が表示されるはずです。

![image-20260601125221011](./hello_world_2.assets/image-20260601125221011.png)

## Hookによる補助

関数を直接呼び出すのが難しい場合は、`HarmonyPatch`でHookを追加し、ログで対象の関数が期待したタイミングで実行されるか確認する方法もあります。Hookの位置と`Prefix`、`Postfix`の選択は、関数名だけで判断せず、実際の呼び出しチェーンに基づく必要があります。

## AIによる補助

AIは候補となる型の検索、呼び出し関係の整理、監査メモの作成を補助できますが、提示されたメンバー名、シグネチャ、呼び出しの結論は、リバースコード、Interopアセンブリ、または実際の実行結果で検証する必要があります。
