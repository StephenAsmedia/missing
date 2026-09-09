# 懷念・追思相片播放網頁

這是一份不需安裝網站套件、可直接離線播放的紀念網頁。目前已處理 68 張相片，依檔名從 001.jpg 排至 104.jpg（編號有跳號），另含 1 首音樂與 2 張首頁圖片。原始素材不會被修改。公開網站上的相片與音樂，任何取得網址的人都能觀看與下載。

## 1. 先在本機播放

1. 若收到 `missing.zip`，按滑鼠右鍵 →「全部解壓縮」→「解壓縮」。不要在 ZIP 裡直接開網頁。
2. 打開解壓縮後的 `missing` 資料夾，確認 `index.html`、`picture`、`img`、`music` 都在同一層。
3. 雙擊 `index.html`，或按右鍵 →「開啟檔案」→ Chrome／Edge／Safari。
4. 調整裝置及喇叭音量，按「開始」。支援的瀏覽器會進入全螢幕，音樂以 2 秒淡入，同時播放照片。
   - 若只要相片、不播放音樂，請改按「開始-無聲版」。照片順序、全螢幕及結束方式相同；返回首頁後仍可按「開始」播放有音樂版本。
5. 每張完全顯示 6 秒，接著用 1.5 秒交叉淡入淡出；下一張完全顯示後再停留 6 秒。照片不裁切，不使用放大效果。最後一張回到第一張，音樂也依清單循環。
6. 按 Esc 回首頁並停止聲音。也可點一下播放畫面 → 右上角「結束」。此按鈕約 4 秒後自動隱藏，再點畫面即可顯示。
7. 手機／iPad 若不支援網頁全螢幕，會使用滿視窗模式，瀏覽器列可能仍在。請用「結束」離開。
8. 若出現「點此開啟音樂」，點它以允許播放。iOS／iPadOS 的檔案預覽不一定是完整瀏覽器；若離線檔案無法執行，會場請用已測試的筆電 Chrome／Edge 離線版。

## 2. 建立或使用 GitHub 的 missing 專案

您已經有 `https://github.com/StephenAsmedia/missing`，可直接沿用，跳到下一節。以下供還沒有專案時使用：

1. 登入 GitHub，右上角按「+」→「New repository」。
2. 在「Repository name」填入 `missing`。此名稱是儲存庫識別字及網址的一部分，使用英文字母、數字、連字號等允許字元；中文「懷念」放在 Description 或網頁標題，儲存庫名稱請不要填中文。
3. Description 可填「懷念・家人追思相片」。
4. 選「Public」，將「Add README」設為開啟，按「Create repository」。這樣可以使用免費帳號的 GitHub Pages。

## 3. 移除舊版相片，再上傳新版

本交付資料夾是完整替換版，不含舊網站素材。上傳同名檔案會覆寫，但不會自動刪除 GitHub 裡其他舊相片！

1. 進入現有專案 →「Code」。如需備份，先按綠色「Code」→「Download ZIP」。
2. 進入舊的相片資料夾，確認路徑只包含要移除的舊網站照片。點檔案列表上方的「⋯」→「Delete directory」（不同版面可能顯示於右上角）。輸入說明「移除舊相片」，按「Commit changes」，選直接提交到 `main` 後確認。若沒有整個資料夾刪除選項，可逐一打開照片，按「⋯」→「Delete file」再提交。
3. 舊站如有其他不再使用的素材資料夾，也先確認內容再用相同方式移除。不要刪除整個 repository。GitHub 的歷史版本仍可能保留舊檔案；此步是移除目前版本的舊照片。
4. 回到專案最外層「Code」→「Add file」→「Upload files」。窄螢幕可能顯示「+」選單。
5. 在 Windows 檔案總管打開本機 `missing`，將**裡面的全部檔案和子資料夾**拖到「Drag files here」區域。不要拖最外面的 `missing` 資料夾，否則 `index.html` 會多一層路徑。也不要只上傳 ZIP，Pages 不會替您解壓縮。
6. 等每個檔案上傳完成。在「Commit changes」填入「更新追思網頁」，選「Commit directly to the main branch」，按綠色「Commit changes」。
7. 回到「Code」確認第一層可直接看到 `index.html`、`style.css`、`app.js`、`photos.js`、`music.js`、`picture/`、`music/`、`img/`。

### 上傳限制與分批方法

- **GitHub 網頁版每次最多 100 個檔案，單檔上限 25 MiB。** 資料夾裡的檔案也算入數量。
- 常見的 **100 MiB** 是一般 Git 推送時的單檔硬限制，不是網頁上傳額度。這份成品的縮圖與音樂均應小於 25 MiB。
- 若超過 100 個檔案，先上傳最外層的 HTML／CSS／JS／README／Python 與 `img`、`music` 資料夾，提交一次。
- 接著回最外層，再按「Add file → Upload files」，拖入 `picture` 資料夾（若照片未滿 100 張），再提交。
- 若 `picture` 本身超過 100 張：先用「Add file → Create new file」，在檔名欄填 `picture/.gitkeep`，提交建立資料夾。進入 GitHub 的 `picture`，按「Add file → Upload files」，從本機 `picture` 選最多 100 張照片拖入，提交；留在這個資料夾重複上傳剩餘照片。這裡拖的是照片，不能再拖整個 `picture`，以免變成 `picture/picture`。
- 使用「choose your files」通常只能選檔案，保留子資料夾結構請用桌面瀏覽器拖曳。

## 4. 開啟 GitHub Pages

1. 專案上方按「Settings」（找不到時展開「⋯」）。
2. 左側「Code and automation」區域點「Pages」。
3. 在「Build and deployment」的「Source」選「Deploy from a branch」。
4. 「Branch」選 `main`，旁邊資料夾選 `/(root)`，按「Save」。
5. 第一次等幾分鐘，最久可能約 10 分鐘，重新整理同一頁。
6. 出現「Your site is live at…」後，按「Visit site」。您的預期網址是 `https://stephenasmedia.github.io/missing/`；以 Pages 顯示的網址為準。這份交付不代表已經上線。
7. 若 404，確認 `index.html` 位於 `main` 最外層，再到「Actions」查看部署是否完成。更新後若仍是舊畫面，按 Ctrl+F5 重新載入（Mac 可按 Command+Shift+R）。

## 5. 之後新增或更換相片

播放網頁不需要 Python，只有重新處理相片時需要。

1. 安裝 Python：從 `https://www.python.org/downloads/` 下載 Windows 安裝程式，安裝時勾「Add python.exe to PATH」，按「Install Now」。
2. 將要播放的所有原始 JPG 放進 `D:\Missing\pictures`。要移除的相片移到其他備份資料夾。用 `001.jpg`、`002.jpg` 等檔名安排順序；腳本採自然排序，所以 `2.jpg` 會在 `10.jpg` 前，並非依拍攝日期排序。
3. 在本機成品 `missing` 資料夾空白處按右鍵 →「在終端機中開啟」。
4. 第一次輸入 `py -m pip install Pillow`，按 Enter，等待完成。
5. 輸入 `py resize_photos.py`，按 Enter。Mac 使用 `python3 -m pip install Pillow`，並用下一步指定來源路徑。
6. 若照片在別處，輸入 `py resize_photos.py "D:\您的照片資料夾"`。Mac 使用 `python3 resize_photos.py "/Users/您的名稱/Pictures/追思"`。
7. 腳本會修正 EXIF 方向，長邊最多 1920px（不放大小圖），JPEG 品質 85，移除原始 EXIF 資料，寫入 `picture` 並重建 `photos.js`。`picture` 是產出專用資料夾，重跑時其中 JPG 會被更新；請勿把唯一原檔放在這裡。來源空白或照片解碼失敗時，不會清空原有成品。
8. 雙擊 `index.html` 確認新順序。接著依第 3 節上傳 `photos.js` 及 `picture`。有刪除／改名的照片時，先移除 GitHub 舊 `picture` 再上傳，才能同步刪除舊檔。
9. 音樂放在 `music`，在 `music.js` 使用 `const MUSIC = ["檔名.mp3"];`，多首以逗號分隔，依序循環。首頁照片位於 `img/firstpic.jpg`，佛像背景位於 `img/west3saints.jpg`，可用相同檔名替換後重新上傳。

## 6. 告別式當天

- 事先使用會場的電腦、電視、喇叭及實際瀏覽器，用網址測試完整一輪。確認每張方向與完整顯示、音樂音量、最後一張回到第一張、Esc 回首頁後音樂停止。
- 整個 `missing` 複製到隨身碟，拔掉網路再雙擊 `index.html` 測試。現場可先從隨身碟複製到電腦再開啟。
- 接上電源、關閉通知，並預先調整睡眠／螢幕保護設定。網站會在瀏覽器允許時要求保持螢幕喚醒，但不能取代裝置設定。
- 按網頁「開始」進入全螢幕。F11 是瀏覽器自己的全螢幕，與網頁 Fullscreen API 不同；不要把 F11 當成開始播放。電視遙控器可用方向鍵／Tab 選按鈕、Enter 啟動，無法結束時點畫面顯示「結束」。
- Safari、iPad 與部分電視可能限制音樂或全螢幕。現場務必以實際設備結果為準，準備已驗證可播放的筆電作備援。

## 檔案清單

- `index.html`：首頁與播放器。
- `style.css`：米金色首頁、響應式版面、交叉淡化。
- `app.js`：播放、預載、音樂淡入、循環與結束控制。
- `picture/`、`photos.js`：縮圖與播放順序。
- `music/`、`music.js`：音樂及播放清單。
- `img/`：首頁與西方三聖圖片。
- `resize_photos.py`：縮圖更新工具。
- `.nojekyll`：靜態網站標記。
- `README.md`：本教學。

網頁本身無框架、CDN、外部字型、外部連線或追蹤程式。清單透過傳統 script 載入，不使用 fetch／JSON 或 JavaScript 模組。

## 官方說明（教學用連結，播放器不會連線）

- [GitHub 上傳檔案與 25 MiB／100 個檔案限制](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [GitHub 大型檔案與 100 MiB 限制](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github)
- [設定 Pages 發布來源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [建立 Pages 與等待時間](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## 本次驗證範圍（2026-09-09）

- 已執行縮圖腳本，確認全部 68 張可解碼、長邊不超過 1920px、沒有 EXIF 殘留，音樂與來源完全一致。另以帶旋轉標記的測試照片確認 EXIF 方向修正及自然排序。
- 本機 HTTP 瀏覽器預覽已實測開始、音樂播放時間前進、照片 contain 顯示、交叉淡化與 Esc 回首頁停止音樂。
- 獨立加速測試頁已跑過全部 68 張並回到第一張；單首音樂循環後仍保持播放。此測試頁不包含在成品。正式網頁仍是 6 秒停留、1.5 秒淡化。
- 自動邏輯測試已驗證原生 fullscreenchange 退出處理、滿視窗結束按鈕、照片與多首音樂清單循環及重新開始。
- 內建測試瀏覽器禁止 file://，且未允許原生全螢幕；因此尚未實機驗證離線雙擊、原生全螢幕退出，以及 Chrome／Edge／Safari／iPad／電視各機型。聲音播放狀態已檢查，現場喇叭是否出聲與音量仍需實際聆聽。
- 離線 file:// 使用原生 audio 音量淡入，避免 Web Audio 的本機來源限制；iOS 若限制程式控制音量，離線淡入可能無法生效，音量仍可由裝置按鍵控制。網址版使用 Web Audio 淡入。
- 尚未登入或修改 GitHub 遠端專案；請依第 3 節刪除目前版本的舊照片、上傳新成品並啟用 Pages。
