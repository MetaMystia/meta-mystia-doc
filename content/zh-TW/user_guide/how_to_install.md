# 如何安裝

本文將引導您完成BepInEx及MetaMystia的安裝流程。

## 一鍵安裝 {#onclick_install}

MetaMystia Mod管理工具支援一鍵安裝、升級、解除安裝、啟用/停用和診斷，**推薦所有玩家使用**，安裝與後續更新都交給它即可。

1. 從以下任一網址下載<span class="version-manager">**meta-mystia-manager-v\*.exe**</span>：
    - GitHub：
      [https://github.com/MetaMystia/meta-mystia-manager/releases](https://github.com/MetaMystia/meta-mystia-manager/releases)
    - 本站伺服器：
      [https://url.izakaya.cc/getMetaMystia](https://url.izakaya.cc/getMetaMystia)

2. 下載完成後，雙擊執行該檔案。
3. 依照工具中的提示，選擇您需要的功能。

    ![MetaMystia Mod管理工具執行畫面](./how_to_install.assets/15e3f52d-bc2c-48b7-8c39-a34370adadee.png)

## 手動安裝

<details id="install_mod">
<summary>展開手動安裝步驟</summary>

手動安裝同樣可用，但需要自己取得檔案並放入目錄，也不會自動更新；日常使用建議優先選擇[一鍵安裝](#onclick_install)。

### 安裝前需要了解的內容

在開始之前，先簡單說明幾個名詞：

- **Mod**：玩家製作的「擴充外掛」，安裝到原版遊戲裡，用來增加新功能
- **BepInEx**：一個「Mod載入器」，可以理解為「專門幫遊戲啟動Mod的小程式」
- **遊戲根目錄**：遊戲安裝的資料夾，也就是能看到`Touhou Mystia Izakaya.exe`這個檔案的地方

如果您沒有接觸過「Mod」或電腦檔案操作，也不用擔心——只要一步一步照著做，就可以完成安裝。

只要記住這一點就夠了：

> 先裝BepInEx，再把MetaMystia的相關檔案放進指定資料夾裡。

### 一、下載安裝BepInEx

1. 開啟**BepInEx BE**的官方建置頁面：
   [https://builds.bepinex.dev/projects/bepinex_be](https://builds.bepinex.dev/projects/bepinex_be)

2. 在頁面中選擇適用於《[東方夜雀食堂](https://store.steampowered.com/app/1584090/)》的**IL2CPP**版本（BepInEx Unity (IL2CPP) for Windows (x64) games）。
   注意：本遊戲使用的是**IL2CPP**，請選擇對應版本，否則無法正常執行。

3. 對絕大多數玩家而言，下載下圖中標註的版本即可（圖中版本號可能過時，您可下載對應的最新版）：

    ![BepInEx版本列表](./how_to_install.assets/image-20251231114022353.png)

4. 下載完成後，將壓縮檔解壓縮到**遊戲根目錄**。

    > **如何找到遊戲安裝目錄？**
    >
    > 如果您是透過Steam安裝的遊戲，您可以：開啟Steam → 在媒體庫中右鍵《東方夜雀食堂》 → 點擊「管理」 → 點擊「瀏覽本機檔案」

    解壓縮完成後，目錄結構應大致如下：

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

5. 啟動遊戲。
   如果遊戲啟動時彈出一個**黑色主控台視窗**，說明BepInEx已成功安裝。首次啟動時載入時間可能較長，請耐心等待。

### 二、下載安裝Mod

1. 從以下網址下載<span class="version-dll">**MetaMystia-v\*.dll**</span>：
    - GitHub：
      [https://github.com/MetaMystia/MetaMystia/releases](https://github.com/MetaMystia/MetaMystia/releases)

2. 下載完成後，將<span class="version-dll">**MetaMystia-v\*.dll**</span>放入以下目錄：

    ```plaintext
    遊戲根目錄/BepInEx/plugins
    ```

    如果`plugins`資料夾不存在，您可以手動建立一個。

3. 如果您想在遊戲中加入由MetaMystia所提供的額外內容（如：新的稀客），您還需要下載<span class="version-zip">**ResourceExample-v\*.zip**</span>。

    下載完成後，將檔案放入以下目錄（**無需解壓縮**）：

    ```plaintext
    遊戲根目錄/ResourceEx
    ```

    如果`ResourceEx`資料夾不存在，您可以手動建立一個。

    GitHub的releases中可能不是每個都會附帶<span class="version-zip">**ResourceExample-v\*.zip**</span>，您可以在最近一個提供此檔案的release中下載。

4. 再次啟動遊戲。當遊戲左下角出現MetaMystia狀態文字時，表示Mod已載入。

5. 安裝了資源包時，可在遊戲內執行以下指令確認載入結果：

    ```text
    /resourceex list
    ```

    被拒絕的資源包會同時顯示原因，並記錄在`BepInEx/LogOutput.log`中。

</details>

## 如何升級 {#update_mod}

### 一鍵升級

MetaMystia Mod管理工具支援一鍵升級。升級過程中如果出錯，工具會自動還原到升級前的狀態，您可以放心重試。

您可以閱讀[一鍵安裝](#onclick_install)了解如何取得和使用該工具。

### 手動升級

如果已經安裝過MetaMystia的`.dll`和`.zip`檔案，可按以下步驟手動升級：

1. 依照[下載安裝Mod](#install_mod)的步驟下載最新版本的檔案到指定目錄下。
2. 刪除舊版`MetaMystia-v*.dll`，避免BepInEx同時載入多個版本。
3. 再次啟動遊戲。

> [!TIP]
> 手動安裝的檔案不會自動更新，版本相容性也要自己確認；建議改用[管理工具](#onclick_install)。
