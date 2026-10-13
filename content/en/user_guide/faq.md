# FAQ

If your question is not answered on this page, see [Getting help](./how_to_use.md#get_help).

## Installation and content

### I only want the new content, not multiplayer. Is that possible?

Yes. The extra content MetaMystia provides (such as new special guests, dishes, and ingredients) **does not require** multiplayer. You can treat it purely as a "content expansion mod" and experience all of it in single player.

See [one-click install](./how_to_install.md#onclick_install) for more information.

### Why does the game window sometimes freeze or go white, with a "This program is not responding" dialog?

This may happen when you accidentally click the black console window that starts together with the game. While text is selected in that window, Windows may pause the game process.

Press <kbd>Esc</kbd> in the black console window or right-click once to clear the text selection, then check whether the game window recovers.

### The resource pack did not load and reports "missing DLC detected". What can I do?

A resource pack declares the DLCs it depends on; if any of them is missing, the whole pack is not loaded. Run `/resourceex list` to see rejected packs. The example pack needs DLC1, DLC2, DLC4, and DLC5; first make sure you own them on Steam.

To force loading, set `IgnoreDlcDependencyCheck` to `true` in the `[General]` section of `game root folder/BepInEx/config/MetaMystia.cfg`. Doing so may make content that needs a missing DLC display incorrectly; see [DLC dependency](../resource_ex/use_resource-ex.md#dlc_dependency).

### The manager shows "invalid version information". What should I do?

This usually means your manager version is too old while the server API has been updated. Download the latest <span class="version-manager">**meta-mystia-manager-v\*.exe**</span> again (see [one-click install](./how_to_install.md#onclick_install)); older versions can no longer complete installation or upgrades.

If the version check failed because you have no internet connection, the tool enters **offline mode**. You can still uninstall, enable/disable the mod, and export diagnostic packages; installing and upgrading need a network connection, so retry after your connection is back.

### How do I uninstall MetaMystia?

If you only want to disable the mod temporarily rather than delete files, use the manager's enable/disable feature; you can re-enable it at any time without downloading anything again.

#### One-click uninstall

The MetaMystia Mod Manager provides one-click uninstall. See [one-click install](./how_to_install.md#onclick_install) for how to get and use the tool.

#### Manual uninstall

If you only want to remove MetaMystia itself, delete `game root folder/BepInEx/plugins/MetaMystia-v*.dll`.

If you no longer need the installed ResourceEx content either, you can delete the `game root folder/ResourceEx` folder as well. That folder may contain other resource packs you installed, so check that there is nothing you want to keep before deleting it.

If you also want to remove every file related to the mod — in other words, return the game to a state without mod support — you need to delete the whole BepInEx set of files. Common files and folders include:

- `game root folder/BepInEx`
- `game root folder/dotnet`
- `game root folder/.doorstop_version`
- `game root folder/changelog.txt`
- `game root folder/doorstop_config.ini`
- `game root folder/MinHook.x64.dll`
- `game root folder/winhttp.dll`

## Multiplayer

### Does MetaMystia support only two players?

No. A room holds up to 2 players by default. In LAN mode, after the host runs `/mp maxplayers 4` it can hold up to 4; in server mode, set the player count when creating the room, for example `/mp create 4`. Once other players have joined, only the host can change the player limit.

### Do we need new save files for multiplayer?

No. Each player keeps using their own save file. Story progress, map unlocks, character unlocks, and material counts are not merged.

- Daytime: everyone does daytime activities separately; play continues once all players have finished the day.
- Before opening: the shop choice, menu, beverages, and cookware are synchronized; the shift begins once all players confirm.
- Night shift: you run the izakaya together; cooking consumes the operator's own materials, and actions such as cooking, picking up ingredients, serving, guest states, and shop funds are synced within the room.

### Can players join or reconnect in the middle?

Other players can join while everyone in the room is at the main menu or during the day and the host has not finished the day yet. Once a player enters the pre-opening setup screen or starts the night shift, or the host has finished the day, new joins and reconnections are rejected. Please join at the next time connections are allowed.

The game version and MetaMystia version must match, and player names cannot duplicate an online player's name.

### Why does the room show as full?

The maximum includes the host. The default is 2; when you need more, the host runs:

```text
/mp maxplayers 4
```

The host can check the current limit at any time with `/mp maxplayers`. Once other players have joined, only the host can change it.

### A player disconnected and everyone else is stuck waiting. What should we do?

Players who disconnect are removed from the waiting flow automatically, and the remaining players continue automatically once they finish the current flow.

If the pre-opening setup is still stuck on the waiting screen, the host can confirm their own setup and run:

```text
/mp continue prep
```

After that every player counts as confirmed and the shift starts right away. This command is unavailable in the Yuyuko challenge.

### Is the host replaced automatically if they leave?

No. When the host leaves, the current room ends. Another player needs to open a new room, and the others join again.

In server mode, the others stay connected to the server and can create a new room with `/mp create` and join it with `/mp join`; in LAN mode, multiplayer disconnects completely and the host must run `/mp start` again.

### The night shift will not end. What can we do?

First check that all players have a normal state in the player list. If the local closing flow is still stuck, the stuck side can run:

```text
/call try_close_izakaya
```

After that, the night shift usually ends normally and play can continue.

### Can we play through the story together?

Only the adapted parts are reliable. During story sequences, MetaMystia pauses regular gameplay sync, and some stories, challenges, and trials are not fully adapted yet.

If a story cannot continue or triggers an error, we recommend disconnecting from multiplayer, finishing that day's story separately, and reconnecting the next day.

At this stage of development, story conflicts **cannot be completely avoided**.
If you run into a specific problem, feel free to report it through [GitHub Issues](https://github.com/MetaMystia/MetaMystia/issues), and **attach the log file** to help us fix it.

### What if our DLC or ResourceEx content does not match?

MetaMystia already has basic compatibility handling for mismatched DLC:

- Preparation phase
    - Players cannot select DLC characters, dishes, beverages, and other resources the other side does not have

- Night shift
    - Players cannot take out DLC dishes or beverages the other side does not have
    - Players cannot cook DLC dishes the other side does not have
    - Missing DLC ingredients cannot be used as add-ons

This avoids most problems caused by mismatched DLC, but it cannot reconcile different versions of content with the same name. When playing ResourceEx content together, all players should still install the same version of the resource pack.

### How does daytime gathering time work?

Daytime is independent for each player. Everyone can act at their own pace; the room continues only after all online players have finished the day. In rooms of three or more, everyone has to finish, not just the host and one other player.

### Do hired partners still help?

During multiplayer shifts, partners are disabled automatically. This avoids conflicts between game-controlled partners and real players.

### Time doesn't stop during multiplayer — are buffs like the Night Sparrow's Song and dish throwing still there?

- The Night Sparrow's Song is sung locally by the player who triggers it; other players are not forced to sing at the same time.
- The dish throwing feature remains available and works normally.
