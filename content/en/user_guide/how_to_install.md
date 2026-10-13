# How to install

This page walks you through installing BepInEx and MetaMystia.

## One-click install {#onclick_install}

The MetaMystia Mod Manager supports one-click install, upgrade, uninstall, enable/disable, and diagnostics. **It is recommended for all players**: leave installation and future updates to it.

1. Download <span class="version-manager">**meta-mystia-manager-v\*.exe**</span> from either address:
    - GitHub:
      [https://github.com/MetaMystia/meta-mystia-manager/releases](https://github.com/MetaMystia/meta-mystia-manager/releases)
    - This site's server:
      [https://url.izakaya.cc/getMetaMystia](https://url.izakaya.cc/getMetaMystia)

2. Once the download finishes, double-click the file to run it.
3. Follow the prompts in the tool and choose the features you need.

    ![Screenshot of the MetaMystia Mod Manager](./how_to_install.assets/15e3f52d-bc2c-48b7-8c39-a34370adadee.png)

## Manual install

<details id="install_mod">
<summary>Show the manual install steps</summary>

Manual installation also works, but you have to get the files yourself, put them into the right folders, and updates are not automatic. For everyday use, prefer the [one-click install](#onclick_install).

### Before you start

Before we begin, a few terms:

- **Mod**: an "expansion plugin" made by players, installed into the original game to add new features
- **BepInEx**: a "mod loader" — think of it as "a small program that starts mods for the game"
- **Game root folder**: the folder where the game is installed, the one that contains `Touhou Mystia Izakaya.exe`

If you have never used a "mod" or worked with files on a computer, don't worry — just follow the steps one by one and you will get it installed.

Just remember this one thing:

> Install BepInEx first, then put the MetaMystia files into the right folders.

### 1. Download and install BepInEx

1. Open the official build page of **BepInEx BE**:
   [https://builds.bepinex.dev/projects/bepinex_be](https://builds.bepinex.dev/projects/bepinex_be)

2. On the page, choose the **IL2CPP** build that fits [Touhou Mystia's Izakaya](https://store.steampowered.com/app/1584090/) (BepInEx Unity (IL2CPP) for Windows (x64) games).
   Note: this game uses **IL2CPP**, so pick the matching build, or the game will not run properly.

3. For the vast majority of players, the build highlighted in the screenshot below is the right one (the version in the image may be outdated; you can download the corresponding latest build):

    ![BepInEx build list](./how_to_install.assets/image-20251231114022353.png)

4. After downloading, extract the archive into the **game root folder**.

    > **How do I find the game's install folder?**
    >
    > If you installed the game through Steam: open Steam → right-click Touhou Mystia's Izakaya in your library → click "Manage" → click "Browse local files"

    After extracting, the folder structure should look roughly like this:

    ```
    Touhou Mystia Izakaya
    ├─BepInEx
    ├─dotnet
    ├─Touhou Mystia Izakaya_Data
    ├─东方夜雀食堂 头像&表情包 ~ Avatar Image
    ├─.doorstop_version
    ├─baselib.dll
    ├─changelog.txt
    ├─doorstop_config.ini
    ├─GameAssembly.dll
    ├─Touhou Mystia Izakaya.exe
    ├─UnityCrashHandler64.exe
    ├─UnityPlayer.dll
    └─winhttp.dll
    ```

5. Launch the game.
   If a **black console window** opens while the game starts, BepInEx is installed correctly. The first launch may take a while to load; please be patient.

### 2. Download and install the mod

1. Download <span class="version-dll">**MetaMystia-v\*.dll**</span> from the following address:
    - GitHub:
      [https://github.com/MetaMystia/MetaMystia/releases](https://github.com/MetaMystia/MetaMystia/releases)

2. After downloading, put <span class="version-dll">**MetaMystia-v\*.dll**</span> into this folder:

    ```plaintext
    game root folder/BepInEx/plugins
    ```

    If the `plugins` folder does not exist, create it manually.

3. If you want the extra content MetaMystia provides (such as new special guests), you also need to download <span class="version-zip">**ResourceExample-v\*.zip**</span>.

    After downloading, put the file into this folder (**no need to extract it**):

    ```plaintext
    game root folder/ResourceEx
    ```

    If the `ResourceEx` folder does not exist, create it manually.

    Not every GitHub release includes <span class="version-zip">**ResourceExample-v\*.zip**</span>; you can download it from the most recent release that provides the file.

4. Launch the game again. When the MetaMystia status text appears in the bottom-left corner, the mod has loaded.

5. If you installed a resource pack, run the following command in game to confirm the result:

    ```text
    /resourceex list
    ```

    Rejected resource packs also show the reason, and are recorded in `BepInEx/LogOutput.log`.

</details>

## How to upgrade {#update_mod}

### One-click upgrade

The MetaMystia Mod Manager supports one-click upgrades. If something goes wrong during an upgrade, the tool rolls back to the state before the upgrade automatically, so you can safely try again.

See [one-click install](#onclick_install) for how to get and use the tool.

### Manual upgrade

If you already have MetaMystia's `.dll` and `.zip` files installed, you can upgrade manually:

1. Follow the steps in [Download and install the mod](#install_mod) to download the latest files into the right folders.
2. Delete the old `MetaMystia-v*.dll` so BepInEx does not load multiple versions at the same time.
3. Launch the game again.

> [!TIP]
> Manually installed files do not update automatically, and you must check version compatibility yourself. Consider switching to the [manager tool](#onclick_install).
