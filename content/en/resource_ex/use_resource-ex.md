# ResourceEx content expansion

[ResourceEx](https://github.com/MetaMystia/MetaMystia/tree/main/src/MetaMystia.Mod/ResourceEx) is the resource expansion feature built into MetaMystia. On game startup it reads the ZIP resource packs in the `ResourceEx` folder and loads their configuration and assets.

## Currently supported content

| Type                   | Configurable content                                                                                                                                                                                 |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Special guests         | Name, catalog description, portrait, chibi sprites, daytime appearance location, night shift appearance, funds, evaluation, chat, likes and dislikes, order requirements, bond dialogue              |
| Ingredients and dishes | Ingredients, dishes, recipes, beverages, tags, price, level, icons, and cookware type                                                                                                                |
| Items                  | Name, description, and icon; can be used as gifts, goods, quest rewards, or quest delivery targets                                                                                                   |
| Stories                | Dialogue packages, portraits, CG or backgrounds, WAV audio, branches, jumps, and end actions                                                                                                         |
| Quests and events      | Quest conditions, rewards (including items and money), follow-up quests, timed conditions, event triggers, and dialogue events                                                                       |
| Merchants              | Welcome or idle dialogue, price multiplier, stock amount, sale probability, and product list                                                                                                         |
| Outfits                | Icons, portraits, chibi sprites, skin indexes, and UI offsets                                                                                                                                        |
| Gift mailbox           | The items given out, the gift title, and the dialogue played when claiming                                                                                                                           |
| Spell cards            | The name, description, portrait, and effect package of a character spell card, plus the buff name, description, and icon of its lasting effect; spell card effects are implemented inside MetaMystia |
| Daytime maps           | Map slices, layers, collision, spawn points, camera, and music; currently a preview feature, only reachable in single player with `/resourceex map`                                                  |

## Example resource pack status

The example pack (MetaMystia-ResourceExample) can be installed through the [manager tool](../user_guide/how_to_install.md#onclick_install). Pack creators can refer to the [example pack repository](https://github.com/MetaMystia/MetaMystia-ResourceExample); its `ResourceEx.json` lists all the example content.

The example pack demonstrates configuration for characters, dialogue, ingredients, dishes, recipes, beverages, quests, events, merchants, outfits, the gift mailbox, and spell cards, and includes characters such as Daiyousei, Koakuma, Flandre, Eirin, Shinki, the Aki sisters, Ran, Yuki, and Mai. Mai and Minoriko Aki already have usable spell cards, and some characters have bond stories; the rest of the content will keep being added.

The example pack depends on DLC1, DLC2, DLC4, and DLC5. If any of them is missing, the pack will not load; see [DLC dependency](#dlc_dependency) for details.

![Example character](./use_resource-ex.assets/531355090-29c4d18b-2201-4ca5-8e0b-149882682493.png)

![Example ordering character](./use_resource-ex.assets/531355118-2534e0c8-d3fe-4342-ac3d-7cd1d550c305.png)

![Example order](./use_resource-ex.assets/531355131-7cac9dd1-1adc-4973-bc07-caf2fda07b43.png)

![Example evaluation](./use_resource-ex.assets/531355180-682f7460-2d3d-4fb8-930b-647e2e70bac4.png)

## Installing resource packs

1. Put the pack ZIP directly into `game root folder/ResourceEx`; do not extract it.
2. Launch the game. If the folder does not exist, MetaMystia creates it automatically.
3. Run `/resourceex list` to see which packs loaded successfully and which were rejected.
4. Run `/resourceex info <name or label>` to see the metadata and content counts.

The loader only scans `.zip` files in the root of `ResourceEx`; it does not scan subfolders recursively.

## ZIP structure

A ZIP must contain a configuration file named `ResourceEx.json`.

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

## DLC dependency {#dlc_dependency}

A resource pack can declare which DLCs it needs in `packInfo.dependencies` in `ResourceEx.json`, for example:

```json
"dependencies": ["CORE", "DLC2", "DLC5"]
```

- Every declared DLC must already be active in the game, or the pack is rejected; `/resourceex list` shows rejected packs together with a note.
- Packs that do not declare `dependencies` are treated as depending only on the base game and always load. `CORE` means the base game and is always active.
- The example pack declares `CORE`, `DLC1`, `DLC2`, `DLC4`, and `DLC5`.

If your DLCs are all present but the pack is still rejected, or you know the missing DLC does not affect the content you need, edit `game root folder/BepInEx/config/MetaMystia.cfg`, set `IgnoreDlcDependencyCheck` to `true` in the `[General]` section, and restart the game. Once enabled, all resource packs skip the dependency check; content that needs a missing DLC may not display correctly or may cause unknown issues, and MetaMystia shows a warning on startup.

## Order configuration

Food and beverage orders can be declared separately in character configuration. The user config file `BepInEx/config/MetaMystia.cfg` provides three modes:

- `ForceDisable`: force off;
- `FollowPackage`: follow each request's `enable` value in the pack;
- `ForceEnable`: force on.

Food orders (`FoodRequestMode`) default to `FollowPackage`, and beverage orders (`BevRequestMode`) default to `ForceDisable`. When creating beverage order content, remind users to adjust the configuration as needed.

## IDs and signatures

ResourceEx currently applies unified validation to character, ingredient, dish, recipe, beverage, item, outfit, daytime map, spell card, and buff IDs:

- Less than or equal to `8999`: reserved for the game; ResourceEx must not use these;
- `9000` to `1073741823`: managed range; a valid ID segment must be declared, and signature verification must pass when it is enabled;
- `1073741824` to `2147483647`: free range; no signature required, but you bear the risk of conflicts with other resource packs.

The example resource pack is signed to use `9000` to `12999`. Third-party creators should not reuse this segment. See [ID signature verification](./why_add_signature_check.md) for how to apply and sign.

> [!CAUTION]
> Avoid using IDs in the 0–11999 range. Use every 1000 as an independent creation segment to reduce conflicts.
>
> You can also tell the MetaMystia team the dedicated ID segment you need, to keep your resource pack unique.

## Online editor

[MetaMystia-ResourceEx-Editor](https://editor.meta-mystia.izakaya.cc) lets you edit `ResourceEx.json` visually and build resource packs; it suits creators who prefer not to write JSON by hand.

- Online editor: [https://editor.meta-mystia.izakaya.cc](https://editor.meta-mystia.izakaya.cc)
- Source code: [https://github.com/MetaMystia/MetaMystia-ResourceEx-Editor](https://github.com/MetaMystia/MetaMystia-ResourceEx-Editor)

![Example of the online editor, 1](./use_resource-ex.assets/image-20260110224843328.png)

![Example of the online editor, 2](./use_resource-ex.assets/image-20260110224858165.png)

## Dialogue display and triggering

Dialogue packages in resource packs can be triggered by quests, events, and the gift mailbox.

When you open the game's original link menu during the day, two entries appear at the end of the menu:

- `剧情回放(MetaMystia)`: replay game stories and ResourceEx dialogue; ResourceEx dialogue must be read once before it can be replayed;
- `资源包礼物邮箱`: claim gifts configured by resource packs, playing the matching dialogue when claimed. The entry is unavailable when no gifts are configured.

## Copyright and redistribution

The resource packs provided by MetaMystia contain content from different sources, and different parts fall under different copyright rules. Please read carefully before using or redistributing.

### 1. Copyright notice for the original works

This mod is an unofficial fan work based on the following works:

- Touhou Project, Team Shanghai Alice @ZUN
- Touhou Mystia's Izakaya, 二色幽紫蝶
- Touhou Akis' Farm, 二色幽紫蝶

The original copyrights to the characters, names, world settings, and other elements related to the works above belong to the original authors or rights holders.

MetaMystia claims no copyright over the original works' content.

### 2. Original game assets not covered by this project's license

The asset files in the following paths are not original MetaMystia content; the copyright of these art assets belongs to the original game's rights holders.

Assets from **Touhou Mystia's Izakaya by 二色幽紫蝶**:

```
assets/Character/9000/*
assets/Character/9001/*
assets/Character/9002/*
assets/Character/9003/*
assets/Character/9004/*
```

Assets from **Touhou Akis' Farm by 二色幽紫蝶**:

```
assets/Character/10000/Portrait/0.png
assets/Character/10001/Portrait/0.png
assets/Character/10002/Portrait/0.png
```

These files are used only within the scope authorized by the original authors' related works.

They are not MetaMystia original assets and are not covered by the CC license described below. MetaMystia grants no rights to redistribute them or create derivative works from them.

### 3. License for MetaMystia original assets

Except for the content listed in section 2, the remaining assets created by the MetaMystia project team are licensed under:

> **Creative Commons Attribution–NonCommercial–ShareAlike 4.0 International (CC BY-NC-SA 4.0)**

You may use, modify, and build upon them for non-commercial purposes under that license, with attribution and sharing under the same license.

### 4. Changes to the asset list

The MetaMystia project keeps updating its content as development progresses. The "non-original asset list" above may change (grow or shrink) in future versions.

Always use **the contents of this file at the time the corresponding version was released** as the basis for judging copyright. If you are unsure about the copyright status of a file, assume it is not covered by the CC license unless it is clearly marked as original or licensed.

### 5. Disclaimer

This project is an unofficial fan work and is not directly affiliated with the original rights holders. If the original rights holders request it, the project may modify or remove related content.

If you want to become a new resource pack creator, make sure that:

- you follow the laws and regulations of your country or region
- you own the legal copyright to the assets you use, or have obtained derivative-work permission from the original author
- you do not infringe the legitimate rights of **二色幽紫蝶** or any third-party creator
- you strictly follow the [Touhou Project usage guidelines](https://www.bilibili.com/opus/400555526272745308)
