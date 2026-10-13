# ID签名校验机制

ResourceEx用ID区分角色、食材、料理、食谱和酒水等资源。两个资源包复用同一ID时，游戏可能加载错误内容。受管理ID段和签名机制用于减少这类冲突。

签名表示某个`label`获准使用一段ID，不代表MetaMystia对资源包内容的认可、支持或推荐。

## ID范围

| 范围                       | 规则                                                 |
| -------------------------- | ---------------------------------------------------- |
| `-2147483648`至`8999`      | 游戏保留区，ResourceEx禁止使用                       |
| `9000`至`1073741823`       | 受管理区，需要声明合法范围；启用校验时还需要有效签名 |
| `1073741824`至`2147483647` | 自由区，无需签名，但冲突风险由创作者承担             |

资源包使用受管理ID时，必须在`packInfo.idRangeStart`和`packInfo.idRangeEnd`中声明范围。起始值不能大于结束值，且所有受管理ID都必须落在声明范围内。只使用自由区ID的包不需要声明这两个字段。

## 申请ID段

可通过以下渠道提交资源包`label`和希望使用的连续ID段：

- QQ群：[1034953242](https://qm.qq.com/q/s0Qp3QPtOC)
- 邮箱：[`MetaMiku@hotmail.com`](mailto:MetaMiku@hotmail.com)
- GitHub Issue：[MetaMystia Issues](https://github.com/MetaMystia/MetaMystia/issues)

通常按每1000个ID分配一段：

$$
[1000n, 1000n+999],\quad n\in\mathbb{Z}
$$

需要更大范围时，请说明用途并申请连续区间。除非扩展ID段或修改`label`，已经签名的包无需因版本更新重复申请。

申请前请查看[MetaMystia-ResourceEx ID分配表](https://docs.qq.com/sheet/DV2NvRFVKYmJBWGVK)，避开已分配范围。示例包`ResourceExample`当前使用`9000`至`12999`，第三方资源包不可复用。

## 签名内容

签名绑定以下UTF-8文本：

```text
label:idRangeStart-idRangeEnd
```

加载器使用内置公钥执行RSA-2048、SHA-256、PKCS#1 v1.5验证。修改`label`或ID段后，原签名会失效。

在在线编辑器中填写`label`和ID范围后，使用“签名”功能粘贴获批的签名字符串并保存。

![填写签名](./why_add_signature_check.assets/image-20260220093232888.png)

![签名校验结果](./why_add_signature_check.assets/image-20260220093511274.png)

## 临时开发和自由区

等待签名期间，可以在`BepInEx/config/MetaMystia.cfg`的`General`节把`SignatureCheck`设为`false`。这只适合本地开发和调试。

关闭签名验证后，以下规则仍会执行：

- 禁止使用小于或等于`8999`的游戏保留ID；
- 受管理ID必须位于资源包声明的范围内；
- 使用受管理ID时，起止范围本身必须合法。

不想申请签名时，可以使用`1073741824`以上的自由区ID。自由区不会解决不同资源包之间的冲突，发布者应自行协调。
