# ResourceEx资源扩展

[ResourceEx](https://github.com/MetaMystia/MetaMystia/tree/main/ResourceEx)是MetaMystia内置的资源扩展功能。游戏启动时，它会读取`ResourceEx`文件夹中的ZIP资源包并加载其中的配置和素材。

## 当前支持的内容

| 类型       | 可配置内容                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------- |
| 稀客角色   | 名称、图鉴描述、立绘、小人贴图、白天出现位置、营业出场、资金、评价、闲聊、喜好和厌恶、点单需求、羁绊对话 |
| 物品       | 食材、料理、食谱、酒水、标签、价格、等级、图标和厨具类型                                                 |
| 剧情       | 对话包、立绘、CG或背景、WAV音频、分支、跳转和结束动作                                                    |
| 任务和事件 | 任务条件、奖励、后续任务、定时条件、事件触发和对话事件                                                   |
| 商人       | 欢迎或空闲对话、价格倍率、库存数量、出售概率和商品列表                                                   |
| 服装       | 图标、立绘、小人贴图、皮肤索引和界面偏移                                                                 |

## 示例资源包现状

示例包（MetaMystia-ResourceExample）可通过[管理工具](../user_guide/how_to_install.md#onclick_install)安装。制作资源包的创作者可参考[示例包仓库](https://github.com/MetaMystia/MetaMystia-ResourceExample)，其中的`ResourceEx.json`列出了全部示例内容。

示例包展示了角色、对话、食材、料理、食谱、酒水、任务、事件、商人和服装等配置，其中包含大妖精、小恶魔、芙兰朵露、八意永琳、神绮、秋姐妹、八云蓝、雪、舞等角色。部分角色已有羁绊流程，其余内容仍会继续补充。

![示例角色](./use_resource-ex.assets/531355090-29c4d18b-2201-4ca5-8e0b-149882682493.png)

![示例点单角色](./use_resource-ex.assets/531355118-2534e0c8-d3fe-4342-ac3d-7cd1d550c305.png)

![示例点单](./use_resource-ex.assets/531355131-7cac9dd1-1adc-4973-bc07-caf2fda07b43.png)

![示例评价](./use_resource-ex.assets/531355180-682f7460-2d3d-4fb8-930b-647e2e70bac4.png)

## 安装资源包

1. 把资源包ZIP直接放入`游戏根目录/ResourceEx`，不要解压。
2. 启动游戏。目录不存在时，MetaMystia会自动创建。
3. 执行`/resourceex list`查看成功加载和被拒绝的包。
4. 执行`/resourceex info <名称或label>`查看元数据和内容数量。

加载器只扫描`ResourceEx`根目录下扩展名为`.zip`的文件，不递归扫描子文件夹。

## ZIP结构

ZIP内必须包含一个文件名为`ResourceEx.json`的配置文件。

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

## 点单配置

食物和酒水点单可在角色配置中分别声明。用户配置文件`BepInEx/config/MetaMystia.cfg`提供三种模式：

- `ForceDisable`：强制关闭；
- `FollowPackage`：跟随资源包内各请求的`enable`值；
- `ForceEnable`：强制启用。

料理点单`FoodRequestMode`默认为`FollowPackage`，酒水点单`BevRequestMode`默认为`ForceDisable`。制作酒水点单内容时，应提醒使用者按需调整配置。

## ID和签名

ResourceEx目前对角色、食材、料理、食谱和酒水ID执行统一校验：

- 小于或等于`8999`：游戏保留区，ResourceEx禁止使用；
- `9000`至`1073741823`：受管理区，必须声明合法ID段；启用签名校验时还必须通过签名；
- `1073741824`至`2147483647`：自由区，无需签名，但需要自行承担和其他资源包冲突的风险。

示例资源包已签名使用`9000`至`12999`。第三方创作者不要直接复用这段ID。申请和签名方法参见[ID签名校验机制](./why_add_signature_check.md)。

> [!CAUTION]
> 请避免使用0–11999范围内的ID。建议以每1000为一个独立创作区间，减少冲突。
>
> 您也可以向MetaMystia开发团队告知您所需的专属ID段，以确保资源包的唯一性。

## 在线编辑器

[MetaMystia-ResourceEx-Editor](https://editor.meta-mystia.izakaya.cc)可以可视化编辑`ResourceEx.json`并构建资源包，适合不想手写JSON的创作者。

- 在线编辑器：[https://editor.meta-mystia.izakaya.cc](https://editor.meta-mystia.izakaya.cc)
- 源代码：[https://github.com/MetaMystia/MetaMystia-ResourceEx-Editor](https://github.com/MetaMystia/MetaMystia-ResourceEx-Editor)

![在线编辑器示例图一](./use_resource-ex.assets/image-20260110224843328.png)

![在线编辑器示例图二](./use_resource-ex.assets/image-20260110224858165.png)

## 对话展示和触发

当前ResourceEx仅负责加载并注入对话数据，尚未提供完整的对话触发逻辑。

对于自行编写逻辑或调试的开发者，暂时可通过`WebDebugger`的简易`Console`手动触发指定对话包：

```csharp
MetaMystia.Dialog.ShowResourceExPackage("YourDialogPackageName", null)
```

## 版权和再分发

MetaMystia提供的资源包中包含来自不同来源的内容，不同部分适用不同版权规则。请在使用或再分发前仔细阅读。

### 一、原作版权声明

本Mod为基于以下作品的非官方同人二次创作：

- 《东方Project》上海爱丽丝幻乐团@ZUN
- 《东方夜雀食堂》二色幽紫蝶
- 《东方秋神牧场》二色幽紫蝶

与上述作品相关的角色、名称、世界观设定等原始版权归原作者或原版权方所有。

MetaMystia不对原作内容主张版权。

### 二、不属于本项目授权范围的游戏原始资源

以下路径中的资源文件并非MetaMystia项目原创内容，其美术资源版权归原游戏版权方所有。

来自**《东方夜雀食堂》二色幽紫蝶**的资源：

```
assets/Character/9000/*
assets/Character/9001/*
assets/Character/9002/*
assets/Character/9003/*
assets/Character/9004/*
```

来自**《东方秋神牧场》二色幽紫蝶**的资源：

```
assets/Character/10000/Portrait/0.png
assets/Character/10001/Portrait/0.png
assets/Character/10002/Portrait/0.png
```

这些文件仅在原作者相关作品授权范围内使用。

不属于MetaMystia的原创资源，也不适用于下文的CC许可。MetaMystia不对这些资源授予任何再分发或二次创作授权。

### 三、MetaMystia原创资源许可

除第二节列出的内容，其余由MetaMystia项目组原创的资源均采用以下许可证：

> **Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

你可以在遵守该协议的前提下进行非商业使用、修改与再创作，并需署名且以相同许可共享。

### 四、资源列表变更说明

MetaMystia项目会随着开发进展持续更新资源内容。上述“非原创资源列表”可能在未来版本中发生变动（增加或移除）。

请始终以**本文件在对应版本发布时的内容**作为版权归属判断依据。如果您对某个文件的版权状态存在疑问，应默认视为不属于CC授权范围，除非有明确的原创或许可标注。

### 五、免责声明

本项目为非官方同人创作，与原作版权方无直接关联。如原版权方提出要求，项目可能对相关内容进行修改或移除。

如您希望成为新的资源包创作者，请确保：

- 遵循所在国家或地区的相关法律法规
- 您对所使用的素材拥有合法版权，或已获得原作者的二次创作授权
- 不侵害**二色幽紫蝶**及任何第三方创作者的合法权益
- 严格遵循《[东方Project使用规定](https://www.bilibili.com/opus/400555526272745308)》
