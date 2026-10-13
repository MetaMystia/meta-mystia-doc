# Hello World 其二

本節透過一個具體示例，介紹如何稽核遊戲邏輯並尋找所需的函式入口。示例不能直接套用到所有遊戲，但「根據可見行為提取線索，再用型別、簽名和呼叫關係驗證」的方法具有通用性。這裡的目標是找到《東方夜雀食堂》中顯示左下角通知的函式，並讓它顯示`Hello World!`。

## 前提

在開始之前，請確保您已經完成[開發入門](./getting_started.md)中的全部內容。遊戲邏輯的稽核難度會受到原遊戲架構、命名習慣、編譯器最佳化和程式碼混淆等因素影響。《東方夜雀食堂》的型別和成員命名保留得較為清晰，因此可以從介面表現、呼叫關係和型別名稱逐步縮小範圍。稽核結果仍應結合反編譯結果、Interop組件和實際執行驗證。

## 整體稽核

開始定位前，先觀察專案的命名習慣和模組劃分。《東方夜雀食堂》的相關型別主要分布在`Common`、`DayScene`、`GameData`、`MainScene`和`NightScene`等命名空間中。UI相關型別常包含`UI`，DLC相關型別常包含`DLCx`，遊戲資料主要集中在`GameData`。

![image-20260601123546708](./hello_world_2.assets/image-20260601123546708.png)

## 遊戲邏輯分析

定位一個功能時，先記錄它的觸發條件、輸入輸出和可能的呼叫位置。對於左下角通知，可以得到以下線索：

1. 需要一個字串作為輸入。
2. 多條通知會同時展示，並有先後次序和各自的生命週期。
3. 通知常常在任務開始、任務結束等節點出現，可以從這些呼叫位置反向尋找顯示函式。
4. 除了純文字通知外，還會出現帶圖示的通知；這些功能可能共用底層顯示組件，可以沿相鄰型別和重載繼續尋找。
5. 該通知不僅存在DayScene，也會在NightScene中出現。

![image-20260601123641378](./hello_world_2.assets/image-20260601123641378.png)

![image-20260601123705298](./hello_world_2.assets/image-20260601123705298.png)

![image-20260601123803783](./hello_world_2.assets/image-20260601123803783.png)

## 程式碼稽核

根據這些線索，可以按以下方向搜尋：

1. 和UI有關，可能是命名空間含有`UI`的類別。
2. 和通知有關，可能是命名空間含有`Notify`、`Message`、`Toast`等的類別。
3. 和場景無關，可能是既在DayScene又在NightScene中，或直接在Common中。
4. 會有很多變種，可以單獨輸入字串，也可能輸入多種參數來展示不同的通知。
5. 有多種呼叫情況，如果熟悉其他通知的觸發條件和呼叫關係，可以根據查找呼叫關係來確認。

在目前分析結果中，目標型別是`Common.UI.ReceivedObjectDisplayerController`，成員函式`NotifyTextMessage`的簽名為`public void NotifyTextMessage(string content)`。

![image-20260601124449894](./hello_world_2.assets/image-20260601124449894.png)

該型別繼承自`DEYU.Singletons.MonoSingleton<Common.UI.ReceivedObjectDisplayerController>`，可以透過其`Instance`屬性取得實例並呼叫成員函式。

為進行測試，我們在`PluginManager.Update`中加入如下程式碼：

```csharp
if (Input.GetKeyDown(KeyCode.F2)) // 按下 F2 键
{
	Common.UI.ReceivedObjectDisplayerController.Instance.NotifyTextMessage("Hello World!");
}
```

![image-20260601124804831](./hello_world_2.assets/image-20260601124804831.png)

編譯時會出現以下錯誤：

> error CS0012: 類型「MonoSingleton<>」在未參考的組件中定義。必須新增對組件「DEYU.Singletons, Version=0.0.0.0, Culture=neutral, PublicKeyToken=null」的參考。

因此我們繼續新增參考`BepInEx/interop/DEYU.Singletons.dll`，並重新編譯。編譯成功後，啟動遊戲，按<kbd>F2</kbd>鍵，即可看到左下角成功彈出了我們的Hello World通知。

![image-20260601125221011](./hello_world_2.assets/image-20260601125221011.png)

## Hook輔助

如果難以直接呼叫函式，也可以使用`HarmonyPatch`新增Hook，並透過日誌確認目標函式是否在預期時機執行。Hook位置和`Prefix`、`Postfix`的選擇必須依據實際呼叫鏈，不能只根據函式名稱判斷。

## AI輔助

AI可以輔助搜尋候選型別、整理呼叫關係和產生稽核筆記，但給出的成員名、簽名和呼叫結論都需要用逆向程式碼、Interop組件或實際執行結果驗證。
