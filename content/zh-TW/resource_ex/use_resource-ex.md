# ResourceEx資源擴充

[ResourceEx](https://github.com/MetaMystia/MetaMystia/tree/main/src/MetaMystia.Mod/ResourceEx)是MetaMystia內建的資源擴充功能。遊戲啟動時，它會讀取`ResourceEx`資料夾中的ZIP資源包並載入其中的設定和素材。

## 目前支援的內容

| 類型       | 可設定內容                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| 稀客角色   | 名稱、圖鑑描述、立繪、小人貼圖、白天出現位置、營業出場、資金、評價、閒聊、喜好和厭惡、點單需求、羈絆對話 |
| 食材和料理 | 食材、料理、食譜、酒水、標籤、價格、等級、圖示和廚具類型                                                 |
| 物品       | 名稱、描述和圖示；可作為禮物、商品、任務獎勵或任務交付目標                                               |
| 劇情       | 對話包、立繪、CG或背景、WAV音訊、分支、跳轉和結束動作                                                    |
| 任務和事件 | 任務條件、獎勵（含物品和金錢）、後續任務、定時條件、事件觸發和對話事件                                   |
| 商人       | 歡迎或閒置對話、價格倍率、庫存數量、出售機率和商品列表                                                   |
| 服裝       | 圖示、立繪、小人貼圖、外觀索引和介面位移                                                                 |
| 禮物信箱   | 發放的物品、禮物標題和領取時播放的對話                                                                   |
| 符卡       | 角色符卡的名稱、說明、立繪和特效包，以及符卡持續效果的buff名稱、說明和圖示；符卡效果由MetaMystia內建實現 |
| 白天地圖   | 地圖切片、圖層、碰撞、出生點、相機和音樂；目前為預覽功能，只能在單機時用`/resourceex map`進入            |

## 範例資源包現狀

範例包（MetaMystia-ResourceExample）可透過[管理工具](../user_guide/how_to_install.md#onclick_install)安裝。製作資源包的創作者可參考[範例包倉庫](https://github.com/MetaMystia/MetaMystia-ResourceExample)，其中的`ResourceEx.json`列出了全部範例內容。

範例包展示了角色、對話、食材、料理、食譜、酒水、任務、事件、商人、服裝、禮物信箱和符卡等設定，其中包含大妖精、小惡魔、芙蘭朵露、八意永琳、神綺、秋姊妹、八雲藍、雪、舞等角色。舞和秋穰子已有可使用的符卡，部分角色已有羈絆流程，其餘內容仍會繼續補充。

範例包依賴DLC1、DLC2、DLC4和DLC5。缺少其中任何一個時，範例包不會被載入，詳見[DLC依賴](#dlc_dependency)。

![範例角色](./use_resource-ex.assets/531355090-29c4d18b-2201-4ca5-8e0b-149882682493.png)

![範例點單角色](./use_resource-ex.assets/531355118-2534e0c8-d3fe-4342-ac3d-7cd1d550c305.png)

![範例點單](./use_resource-ex.assets/531355131-7cac9dd1-1adc-4973-bc07-caf2fda07b43.png)

![範例評價](./use_resource-ex.assets/531355180-682f7460-2d3d-4fb8-930b-647e2e70bac4.png)

## 安裝資源包

1. 把資源包ZIP直接放入`遊戲根目錄/ResourceEx`，不要解壓縮。
2. 啟動遊戲。目錄不存在時，MetaMystia會自動建立。
3. 執行`/resourceex list`查看成功載入和被拒絕的包。
4. 執行`/resourceex info <名稱或label>`查看中介資料和內容數量。

載入器只掃描`ResourceEx`根目錄下副檔名為`.zip`的檔案，不遞迴掃描子資料夾。

## ZIP結構

ZIP內必須包含一個檔名為`ResourceEx.json`的設定檔。

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

## DLC依賴 {#dlc_dependency}

資源包可以在`ResourceEx.json`的`packInfo.dependencies`中宣告自己需要哪些DLC，例如：

```json
"dependencies": ["CORE", "DLC2", "DLC5"]
```

- 宣告的DLC必須全部已在遊戲中啟用，資源包才會被載入；缺少任何一個，該包會被拒絕，`/resourceex list`中能看到被拒絕的包，並附有提示。
- 沒有宣告`dependencies`的資源包視為只依賴本體，始終可以載入。`CORE`代表本體，恆定啟用。
- 範例包宣告了`CORE`、`DLC1`、`DLC2`、`DLC4`和`DLC5`。

如果您的DLC齊全卻仍被拒絕，或者明確知道缺少的DLC不會影響自己要用的內容，可以編輯`遊戲根目錄/BepInEx/config/MetaMystia.cfg`，在`[General]`分區把`IgnoreDlcDependencyCheck`改為`true`，然後重新啟動遊戲。啟用後所有資源包都會跳過依賴檢查，缺少DLC的內容可能無法正常顯示或出現未知問題，MetaMystia啟動時也會給出警告。

## 點單設定

食物和酒水點單可在角色設定中分別宣告。使用者設定檔`BepInEx/config/MetaMystia.cfg`提供三種模式：

- `ForceDisable`：強制關閉；
- `FollowPackage`：跟隨資源包內各請求的`enable`值；
- `ForceEnable`：強制啟用。

料理點單`FoodRequestMode`預設為`FollowPackage`，酒水點單`BevRequestMode`預設為`ForceDisable`。製作酒水點單內容時，應提醒使用者按需調整設定。

## ID和簽章

ResourceEx目前對角色、食材、料理、食譜、酒水、物品、服裝、白天地圖、符卡和buff的ID執行統一驗證：

- 小於或等於`8999`：遊戲保留區，ResourceEx禁止使用；
- `9000`至`1073741823`：受管理區，必須宣告合法ID段；啟用簽章驗證時還必須通過簽章；
- `1073741824`至`2147483647`：自由區，無需簽章，但需要自行承擔和其他資源包衝突的風險。

範例資源包已簽章使用`9000`至`12999`。第三方創作者不要直接重用這段ID。申請和簽章方法參見[ID簽章驗證機制](./why_add_signature_check.md)。

> [!CAUTION]
> 請避免使用0–11999範圍內的ID。建議以每1000為一個獨立創作區間，減少衝突。
>
> 您也可以向MetaMystia開發團隊告知您所需的專屬ID段，以確保資源包的唯一性。

## 線上編輯器

[MetaMystia-ResourceEx-Editor](https://editor.meta-mystia.izakaya.cc)可以視覺化編輯`ResourceEx.json`並建置資源包，適合不想手寫JSON的創作者。

- 線上編輯器：[https://editor.meta-mystia.izakaya.cc](https://editor.meta-mystia.izakaya.cc)
- 原始碼：[https://github.com/MetaMystia/MetaMystia-ResourceEx-Editor](https://github.com/MetaMystia/MetaMystia-ResourceEx-Editor)

![線上編輯器示例圖一](./use_resource-ex.assets/image-20260110224843328.png)

![線上編輯器示例圖二](./use_resource-ex.assets/image-20260110224858165.png)

## 對話展示和觸發

資源包中的對話包可以由任務、事件和禮物信箱觸發。

白天開啟遊戲原有的聯動選單時，選單末尾會出現以下兩項：

- `劇情回放(MetaMystia)`：回看遊戲劇情和ResourceEx對話，ResourceEx對話需要先讀過一次才能回放；
- `資源包禮物信箱`：領取資源包設定的禮物，領取時播放對應對話。沒有設定禮物時該項不可用。

## 版權和再散布

MetaMystia提供的資源包中包含來自不同來源的內容，不同部分適用不同版權規則。請在使用或再散布前仔細閱讀。

### 一、原作版權聲明

本Mod為基於以下作品的非官方同人二次創作：

- 《東方Project》上海愛麗絲幻樂團@ZUN
- 《東方夜雀食堂》二色幽紫蝶
- 《東方秋神牧場》二色幽紫蝶

與上述作品相關的角色、名稱、世界觀設定等原始版權歸原作者或原版權方所有。

MetaMystia不對原作內容主張版權。

### 二、不屬於本專案授權範圍的遊戲原始資源

以下路徑中的資源檔案並非MetaMystia專案原創內容，其美術資源版權歸原遊戲版權方所有。

來自**《東方夜雀食堂》二色幽紫蝶**的資源：

```
assets/Character/9000/*
assets/Character/9001/*
assets/Character/9002/*
assets/Character/9003/*
assets/Character/9004/*
```

來自**《東方秋神牧場》二色幽紫蝶**的資源：

```
assets/Character/10000/Portrait/0.png
assets/Character/10001/Portrait/0.png
assets/Character/10002/Portrait/0.png
```

這些檔案僅在原作者相關作品授權範圍內使用。

不屬於MetaMystia的原創資源，也不適用於下文的CC授權。MetaMystia不對這些資源授予任何再散布或二次創作授權。

### 三、MetaMystia原創資源授權

除第二節列出的內容，其餘由MetaMystia專案組原創的資源均採用以下授權條款：

> **Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

你可以在遵守該協議的前提下進行非商業使用、修改與再創作，並需署名且以相同授權分享。

### 四、資源列表變更說明

MetaMystia專案會隨著開發進展持續更新資源內容。上述「非原創資源列表」可能在未來版本中發生變動（增加或移除）。

請始終以**本檔案在對應版本發布時的內容**作為版權歸屬判斷依據。如果您對某個檔案的版權狀態存在疑問，應預設視為不屬於CC授權範圍，除非有明確的原創或授權標註。

### 五、免責聲明

本專案為非官方同人創作，與原作版權方無直接關聯。如原版權方提出要求，專案可能對相關內容進行修改或移除。

如您希望成為新的資源包創作者，請確保：

- 遵循所在國家或地區的相關法律法規
- 您對所使用的素材擁有合法版權，或已獲得原作者的二次創作授權
- 不侵害**二色幽紫蝶**及任何第三方創作者的合法權益
- 嚴格遵循《[東方Project使用規定](https://www.bilibili.com/opus/400555526272745308)》
