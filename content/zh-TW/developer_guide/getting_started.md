# 開發入門

本指南面向熟悉C#和.NET、但可能沒有Unity IL2CPP Mod開發經驗的貢獻者，說明目前倉庫的編譯設定和基礎逆向工具。

## 編譯專案

在開始之前，請確保您的系統符合以下條件，並按順序完成設定。

1. **.NET 10 SDK**：
   [https://dotnet.microsoft.com/zh-tw/download/dotnet/10.0](https://dotnet.microsoft.com/zh-tw/download/dotnet/10.0)

2. 一份《[東方夜雀食堂](https://store.steampowered.com/app/1584090)》的**合法副本**（Steam版本）。

3. 複製**MetaMystia**倉庫：
   [https://github.com/MetaMystia/MetaMystia](https://github.com/MetaMystia/MetaMystia)

4. 下載最新的**BepInEx-Unity.IL2CPP-win-x64**：
   [https://builds.bepinex.dev/projects/bepinex_be](https://builds.bepinex.dev/projects/bepinex_be)

    並將其完整解壓縮至遊戲的安裝根目錄（即`Touhou Mystia Izakaya.exe`所在目錄）。

5. 啟動遊戲一次，在進入主選單後退出。BepInEx會產生`core`、`interop`等專案編譯需要的組件。

6. 在MetaMystia倉庫根目錄複製本機設定範本：

    ```powershell
    Copy-Item MetaMystia.local.props.example MetaMystia.local.props
    ```

7. 編輯`MetaMystia.local.props`，把`BepInExPath`設為遊戲目錄中的`BepInEx`資料夾：

    ```xml
    <Project>
      <PropertyGroup>
        <BepInExPath>遊戲安裝目錄\BepInEx</BepInExPath>
      </PropertyGroup>
    </Project>
    ```

    `MetaMystia.local.props`符合倉庫的`*.local.props`忽略規則，不應提交。專案透過該路徑參考`BepInEx/core`和`BepInEx/interop`中的組件，並把建置產物輸出到`BepInEx/plugins`。

8. 使用支援.NET Solution的IDE開啟`MetaMystia.sln`，或在倉庫根目錄執行：

    ```powershell
    dotnet build MetaMystia.sln
    ```

9. 建置會產生`BepInEx/plugins/MetaMystia-v<版本>.dll`，並把`MetaMystia.Preloader.dll`複製到`BepInEx/patchers/MetaMystia`。

主專案目標框架是.NET 6.0，目前使用C# 14語法，因此開發環境需安裝.NET 10 SDK。原始碼產生器專案目標框架為.NET Standard 2.0。執行`src/MetaMystia.Network.Tests`和`src/MetaMystia.Flow.Tests`等測試專案還需要安裝.NET 6執行階段。

## 安裝工具

為了進行較有效率的Mod開發和逆向分析，建議提前準備以下工具。

### 核心工具

#### IDA Pro

用於對`GameAssembly.dll`進行反組譯分析，並在必要時進行動態除錯。對於IL2CPP遊戲，IDA可用於檢查原生程式碼的控制流和呼叫關係。

- 官方網站：[https://hex-rays.com/ida-pro](https://hex-rays.com/ida-pro)

> [!NOTE]
> IDA Free可以完成基礎分析，但和Pro版本的功能和擴充功能支援不同。請根據所需功能選擇合法授權版本；本文不提供任何破解或規避授權的方式。

#### dnSpyEx

用於靜態分析.NET組件。在IL2CPP情境下，主要用於查看Il2CppDumper產生的Dummy DLL，以理解類別結構、欄位配置和方法簽名。原`dnSpy/dnSpy`倉庫已經封存，這裡使用仍在維護的dnSpyEx分支。

- GitHub倉庫：[https://github.com/dnSpyEx/dnSpy](https://github.com/dnSpyEx/dnSpy)

#### Il2CppDumper

用於分析IL2CPP產生的二進位檔，還原符號資訊，並產生供dnSpy和IDA使用的輔助檔案。

- GitHub倉庫：[https://github.com/Perfare/Il2CppDumper](https://github.com/Perfare/Il2CppDumper)

### 推薦擴充功能（可選）

#### IDA-Pro-MCP

該擴充功能允許AI Agent透過MCP介面存取IDA資料庫，可用於輔助定位函式、理解控制流或加速分析過程。

- 安裝參考：[https://github.com/mrexodia/ida-pro-mcp?tab=readme-ov-file#installation](https://github.com/mrexodia/ida-pro-mcp?tab=readme-ov-file#installation)

#### dnSpy.Cpp2IL

dnSpy擴充功能，用於將Cpp2IL的分析結果整合進dnSpy檢視，在查看IL2CPP還原程式碼時提供更多資訊。安裝前請按擴充功能倉庫說明確認和所用dnSpy版本相容。

- 安裝參考：[https://github.com/BadRyuner/dnspy.Cpp2IL?tab=readme-ov-file#how-to-install](https://github.com/BadRyuner/dnspy.Cpp2IL?tab=readme-ov-file#how-to-install)

## 逆向分析準備

本節介紹如何利用上述工具準備IL2CPP分析環境。完成後，可以在dnSpy中瀏覽還原的型別結構，並在IDA中進行帶符號的反組譯分析。

### 使用Il2CppDumper還原符號

1. 執行`Il2CppDumper.exe`。

2. 按照提示依次載入以下檔案：
    - 遊戲目錄下的`GameAssembly.dll`
    - `Touhou Mystia Izakaya_Data/il2cpp_data/Metadata/global-metadata.dat`

3. 等待工具完成自動分析。完成後將產生多個輸出目錄，其中後續步驟主要使用：
    - `DummyDll/`

### 匯入dnSpy

1. 將Il2CppDumper產生的`DummyDll/Assembly-CSharp.dll`匯入dnSpy。

2. 透過該檔案，您可以較直觀地查看遊戲邏輯中的類別定義、欄位名稱以及方法簽名，並定位其在dll中的虛擬位址。

### 匯入IDA Pro

1. 使用IDA Pro開啟`GameAssembly.dll`，等待其完成初始自動分析（首次載入耗時可能較長）。

2. 在IDA中點擊`File -> Script file`，執行Il2CppDumper產生的`ida_with_struct.py`腳本。部分版本會把Python 3版腳本命名為`ida_with_struct_py3.py`，請以實際輸出檔案為準。

3. 根據腳本提示，依次選擇產生的`script.json`和`il2cpp.h`檔案，耐心等待符號和結構資訊匯入完成。

    ![IDA執行腳本步驟](./getting_started.assets/image-20251231124728238.png)

4. 匯入完成後，關閉IDA並**儲存資料庫**。在儲存對話方塊中，建議勾選`Collect`選項，以保留完整的分析資訊。

    ![IDA儲存對話方塊](./getting_started.assets/image-20251231125239242.png)

5. 額外備份產生的`GameAssembly.dll.i64`資料庫檔案

> [!TIP]
> 動態除錯時由於**ASLR**，模組的執行階段基底位址（如`0x7FFF25021000`）會和靜態分析時的位址（如`0x180001000`）不同，容易造成位址對照混亂。保留一份原始靜態資料庫可以避免IDA的Rebase影響靜態分析。

### 輔助Skill

AI Agent可以輔助搜尋呼叫關係和整理稽核記錄，但遊戲行為仍應由逆向程式碼、Interop組件和實際執行結果交叉驗證。需要透過IDA Pro MCP進行IL2CPP原始碼還原時，可參考[il2cpp-to-csharp-skill](https://github.com/MetaMikuAI/il2cpp-to-csharp-skill)。
