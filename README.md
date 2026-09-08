# 懷念 — 追思相片播放網頁

這是一個純 HTML／CSS／JavaScript 的紀念網頁：開啟後按「開始」，
會全螢幕播放相片並播放音樂，按 Esc 即回到首頁。
整個資料夾不需要網路也能用（複製到隨身碟、雙擊 `index.html` 即可播放）。

---

## 資料夾內容

```
missing/
├── index.html          首頁與播放畫面
├── style.css           樣式
├── app.js              播放邏輯（全螢幕、交叉淡入淡出、音樂循環、Esc 停止）
├── photos.js           相片清單（由 resize_photos.py 自動產生）
├── music.js            音樂清單（可手動編輯）
├── resize_photos.py    相片縮圖＋排序腳本
├── README.md           本說明
├── picture/            縮圖後的相片（長邊 1920px）
├── music/              音樂檔（mp3）
└── img/
    └── west3saints.jpg 首頁背景（西方三聖）
```

> 首頁中央的主照片固定使用 `picture/DSC04803-1.jpg`。
> 若要換主照片，把新檔案也放進 `picture/`，然後修改 `index.html` 裡
> `<img src="picture/DSC04803-1.jpg" ...>` 那一行的檔名即可。

---

## 一、在 GitHub 建立公開 repo（名稱：`missing`）

1. 打開 <https://github.com> 並登入。
2. 點右上角的「**+**」→「**New repository**」。
3. **Repository name** 輸入 `missing`。
4. **Public**（公開）保持勾選。
   GitHub Pages 免費版只支援公開 repo；私人 repo 需要付費方案。
5. 其他選項都不用勾（不要勾 Add a README），直接按綠色的「**Create repository**」。

**為什麼不能用中文名稱？**
repo 名稱會直接變成網址的一部分（`https://你的帳號.github.io/missing/`）。
GitHub 只允許英文字母、數字、`-`、`_`、`.`；中文會被拒絕，
就算勉強轉成編碼也會變成一長串 `%E6%87%B7...`，不方便在會場輸入或分享。
網頁「裡面」的標題仍然是「懷念」，不受影響。

---

## 二、用網頁版上傳整個資料夾（不需要安裝 git）

### 上傳限制（先知道再動手）

| 項目 | 限制 |
|---|---|
| 一次拖曳上傳 | 最多 **100 個檔案** |
| 單一檔案大小 | 最大 **100 MB** |
| 整個 repo 建議 | 1 GB 以下 |

本專案目前是：68 張縮圖（約 25 MB）＋ 1 首音樂（約 2.4 MB）＋ 少數程式檔，
總共約 80 個檔案，**分兩批**上傳最保險。

### 步驟

1. 建立 repo 後會看到「Quick setup」頁面，點中間的藍字「**uploading an existing file**」。
   （之後若要再上傳，改按 repo 頁面上方的「**Add file**」→「**Upload files**」。）
2. 在 Windows 檔案總管打開 `D:\Missing\missing`。
3. **第一批**：選取這些「檔案」（不含 `picture` 資料夾）：
   `index.html`、`style.css`、`app.js`、`photos.js`、`music.js`、
   `resize_photos.py`、`README.md`，以及 **整個 `music` 資料夾** 和 **整個 `img` 資料夾**，
   一起拖曳到瀏覽器的虛線框「Drag files here to add them to your repository」。
   - 拖「資料夾」進去時，GitHub 會保留資料夾結構（會看到 `music/cherrytonight.mp3`）。
   - 若拖資料夾沒反應，改用 Chrome 或 Edge 瀏覽器。
4. 等清單全部出現後，往下捲到「Commit changes」，
   第一格可填 `first upload`（或留預設），按綠色「**Commit changes**」。
5. 回到 repo 首頁，再按「**Add file**」→「**Upload files**」。
6. **第二批**：拖曳 **整個 `picture` 資料夾**（68 張，未超過 100 個檔案）。
   若日後相片超過 100 張，就把 `picture` 裡的檔案分成兩次拖曳：
   兩次都拖「資料夾」進去即可，GitHub 會自動合併到同一個 `picture/`。
7. 按「**Commit changes**」。
8. 回到 repo 首頁，確認看得到 `index.html`、`picture/`、`music/`、`img/`。

---

## 三、開啟 GitHub Pages 並取得網址

1. 在 repo 頁面上方點「**Settings**」（齒輪圖示，最右邊那個分頁）。
2. 左邊選單往下找到「**Pages**」（在 Code and automation 底下）。
3. 「**Build and deployment**」→「Source」選「**Deploy from a branch**」。
4. 「**Branch**」下拉選「**main**」，右邊資料夾選「**/ (root)**」，按「**Save**」。
5. 等 **1～5 分鐘**，重新整理這個 Pages 設定頁面，最上方會出現：
   「Your site is live at `https://你的帳號.github.io/missing/`」
   旁邊有「**Visit site**」按鈕。
6. 網址就是 `https://你的帳號.github.io/missing/`（結尾的斜線可省略）。
   建議用手機拍下或加入書籤。

> 第一次啟用通常要等幾分鐘，若顯示 404 請再等一下並重新整理。
> 之後每次上傳新檔案，也要等 1～2 分鐘才會更新到網址。

---

## 四、之後要新增或更換相片

1. 把新的原始相片放進 `D:\Missing\pictures`（要移除的相片就從這裡刪掉）。
2. 開啟「命令提示字元」或 PowerShell，執行：
   ```
   cd D:\Missing\missing
   python resize_photos.py
   ```
   - 第一次執行若出現「找不到 Pillow」，先執行 `pip install Pillow` 再重跑。
   - 腳本會重新產生 `picture/` 內的所有縮圖，並重寫 `photos.js`（依拍攝日期排序）。
   - 如果原始相片不在 `D:\Missing\pictures`，可指定：
     `python resize_photos.py --src "其他資料夾路徑"`
3. 到 GitHub repo 頁面：
   - 新增／更換相片 → 「**Add file**」→「**Upload files**」，
     拖曳整個 `picture` 資料夾 **和** 新的 `photos.js`，按 **Commit changes**。
     （同名檔案會直接覆蓋。）
   - 若有「刪掉」的相片，GitHub 上的舊檔不會自動消失；
     可到 `picture/` 點該檔案 → 右上角「…」→「**Delete file**」，
     或不理它也沒關係（`photos.js` 沒列的檔案不會被播放）。
4. 等 1～2 分鐘後用網址確認。

### 更換或增加音樂

1. 把 mp3 放進 `music/`。
2. 用記事本打開 `music.js`，依播放順序列出檔名，例如：
   ```js
   const MUSIC = [
     "cherrytonight.mp3",
     "second_song.mp3",
   ];
   ```
3. 上傳 `music/` 與 `music.js`。

### 調整停留秒數

用記事本打開 `app.js`，最上面幾行：
`SLIDE_MS = 6000`（每張 6 秒）、`FADE_MS = 1500`（淡入淡出 1.5 秒）。
若修改 `FADE_MS`，請一併把 `style.css` 裡 `.layer` 的 `transition: opacity 1.5s` 改成相同秒數。

---

## 五、告別式當天的建議

**事前（前一天）**

1. **用會場的裝置實際打開一次網址**（電視、投影機接的筆電、或平板），
   按「開始」確認：有進全螢幕、有聲音、相片會換、按 Esc 會回首頁。
   不同裝置的瀏覽器行為略有差異，務必用當天要用的那一台試。
2. **隨身碟備份離線版**：把整個 `D:\Missing\missing` 資料夾複製到隨身碟。
   會場網路不穩時，直接在該裝置上雙擊隨身碟裡的 `index.html` 也能完整播放。
   （Chrome／Edge／Safari 直接開啟本機檔案都可以，不需要架伺服器。）
3. 若用筆電接電視或投影機：
   - Windows 按 `Win + P` 選「**複製**」或「**僅第二螢幕**」。
   - 關閉筆電的螢幕保護／自動睡眠（設定 → 系統 → 電源 → 螢幕與睡眠 → 永不）。
   - 把系統音量與瀏覽器音量調到適當大小，並接好音響。

**全螢幕與瀏覽器注意事項**

- 按「開始」會自動進入全螢幕；若瀏覽器跳出「按 Esc 可離開全螢幕」的提示，等幾秒會自動消失。
- **不要按 Esc、不要按 F11、不要點到其他視窗**，否則會退出全螢幕並回到首頁
  （這是設計好的停止方式）。要重新開始只要再按一次「開始」。
- 手機／iPad 若不支援全螢幕，會改用整個視窗播放；**點一下畫面**右上角會出現「結束」按鈕。
- iPhone／iPad 請把靜音開關切到有聲，並把音量調高。
- 播放中請勿讓裝置進入睡眠；可在系統設定把「自動鎖定」改成「永不」。
- 若播放時畫面上有滑鼠游標，把滑鼠稍微移動一下後放著，幾秒後游標會自動隱藏。
- 電視內建瀏覽器功能差異較大，若無法正常全螢幕，建議改用筆電接 HDMI。

**當天流程**

1. 開啟網址（或隨身碟的 `index.html`）→ 看到首頁「懷念」。
2. 儀式開始前按「**開始**」。
3. 需要暫停或結束時按 **Esc**（手機／平板：點畫面 → 「結束」）。

---

## 技術說明（給有興趣的人）

- 無任何框架、CDN 或外部連線；不含任何追蹤或分析程式碼。
- 相片清單以 `photos.js`（`const PHOTOS = [...]`）方式載入，而非 `fetch` JSON，
  因此用 `file://` 直接開啟也能運作。
- 相片切換：兩個圖層交叉淡入淡出（1.5 秒），並預先載入下一張避免閃白；
  極輕微的 Ken Burns 緩慢放大；`object-fit: contain` 完整顯示不裁切。
- 停止：監聽 `fullscreenchange`（含 webkit 前綴），任何方式退出全螢幕都會停止；
  無全螢幕 API 的裝置改為覆蓋視窗模式，並提供「結束」按鈕。
- 相容 Chrome、Edge、Safari（桌機與行動版）。
