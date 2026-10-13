# ID簽章驗證機制

ResourceEx用ID區分角色、食材、料理、食譜和酒水等資源。兩個資源包重用同一ID時，遊戲可能載入錯誤內容。受管理ID段和簽章機制用於減少這類衝突。

簽章表示某個`label`獲准使用一段ID，不代表MetaMystia對資源包內容的認可、支持或推薦。

## ID範圍

| 範圍                       | 規則                                                 |
| -------------------------- | ---------------------------------------------------- |
| `-2147483648`至`8999`      | 遊戲保留區，ResourceEx禁止使用                       |
| `9000`至`1073741823`       | 受管理區，需要宣告合法範圍；啟用驗證時還需要有效簽章 |
| `1073741824`至`2147483647` | 自由區，無需簽章，但衝突風險由創作者承擔             |

資源包使用受管理ID時，必須在`packInfo.idRangeStart`和`packInfo.idRangeEnd`中宣告範圍。起始值不能大於結束值，且所有受管理ID都必須落在宣告範圍內。只使用自由區ID的包不需要宣告這兩個欄位。

## 申請ID段

可透過以下管道提交資源包`label`和希望使用的連續ID段：

- QQ群：[1034953242](https://qm.qq.com/q/s0Qp3QPtOC)
- 信箱：[`MetaMiku@hotmail.com`](mailto:MetaMiku@hotmail.com)
- GitHub Issue：[MetaMystia Issues](https://github.com/MetaMystia/MetaMystia/issues)

通常按每1000個ID分配一段：

$$
[1000n, 1000n+999],\quad n\in\mathbb{Z}
$$

需要更大範圍時，請說明用途並申請連續區間。除非擴充ID段或修改`label`，已經簽章的包無需因版本更新重複申請。

申請前請查看[MetaMystia-ResourceEx ID分配表](https://docs.qq.com/sheet/DV2NvRFVKYmJBWGVK)，避開已分配範圍。範例包`ResourceExample`目前使用`9000`至`12999`，第三方資源包不可重用。

## 簽章內容

簽章綁定以下UTF-8文字：

```text
label:idRangeStart-idRangeEnd
```

載入器使用內建公鑰執行RSA-2048、SHA-256、PKCS#1 v1.5驗證。修改`label`或ID段後，原簽章會失效。

在線上編輯器中填寫`label`和ID範圍後，使用「簽章」功能貼上獲批的簽章字串並儲存。

![填寫簽章](./why_add_signature_check.assets/image-20260220093232888.png)

![簽章驗證結果](./why_add_signature_check.assets/image-20260220093511274.png)

## 臨時開發和自由區

等待簽章期間，可以在`BepInEx/config/MetaMystia.cfg`的`General`節把`SignatureCheck`設為`false`。這只適合本機開發和除錯。

關閉簽章驗證後，以下規則仍會執行：

- 禁止使用小於或等於`8999`的遊戲保留ID；
- 受管理ID必須位於資源包宣告的範圍內；
- 使用受管理ID時，起止範圍本身必須合法。

不想申請簽章時，可以使用`1073741824`以上的自由區ID。自由區不會解決不同資源包之間的衝突，發布者應自行協調。
