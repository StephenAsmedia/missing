#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
resize_photos.py — 懷念 相片前處理腳本

功能：
  1. 依 EXIF 修正旋轉方向（手機／相機直拍會自動轉正）
  2. 長邊縮到 1920px，存成 JPEG 品質 85
  3. 讀取 EXIF 拍攝日期（DateTimeOriginal），由舊到新排序；
     沒有日期的排最前面、依檔名排序
  4. 輸出到 picture/ 並自動產生 photos.js

用法（在 missing/ 資料夾內執行）：
  python resize_photos.py
  python resize_photos.py --src "D:\\Missing\\pictures"     # 指定來源資料夾

需要先安裝 Pillow：
  pip install Pillow
"""

import argparse
import os
import re
import sys
from datetime import datetime

try:
    from PIL import Image, ImageOps
except ImportError:
    print("找不到 Pillow，請先執行：pip install Pillow")
    sys.exit(1)

MAX_SIDE = 1920
QUALITY = 85
EXIF_DATETIME_ORIGINAL = 36867
EXIF_DATETIME_DIGITIZED = 36868
EXIF_DATETIME = 306
VALID_EXT = {".jpg", ".jpeg", ".png"}


def read_capture_time(img):
    """回傳 datetime 或 None。優先 DateTimeOriginal，其次 Digitized、再其次 DateTime。"""
    try:
        exif = img.getexif()
    except Exception:
        return None
    if not exif:
        return None
    candidates = []
    try:
        ifd = exif.get_ifd(0x8769)  # Exif SubIFD
        candidates.append(ifd.get(EXIF_DATETIME_ORIGINAL))
        candidates.append(ifd.get(EXIF_DATETIME_DIGITIZED))
    except Exception:
        pass
    candidates.append(exif.get(EXIF_DATETIME_ORIGINAL))
    candidates.append(exif.get(EXIF_DATETIME))
    for raw in candidates:
        if not raw or not isinstance(raw, str):
            continue
        raw = raw.strip()
        for fmt in ("%Y:%m:%d %H:%M:%S", "%Y-%m-%d %H:%M:%S", "%Y:%m:%d"):
            try:
                dt = datetime.strptime(raw[:19], fmt)
                if dt.year > 1900:
                    return dt
            except ValueError:
                continue
    return None


def safe_name(filename):
    """把檔名整理成網址友善的形式：空白→底線，副檔名一律小寫 .jpg。"""
    stem, _ = os.path.splitext(filename)
    stem = re.sub(r"\s+", "_", stem.strip())
    stem = re.sub(r"[^A-Za-z0-9_\-().\u4e00-\u9fff]", "_", stem)
    return stem + ".jpg"


def process(src_dir, out_dir):
    files = [f for f in os.listdir(src_dir)
             if os.path.splitext(f)[1].lower() in VALID_EXT]
    if not files:
        print(f"在 {src_dir} 找不到任何 .jpg 檔案")
        sys.exit(1)

    os.makedirs(out_dir, exist_ok=True)
    records = []  # (has_date, datetime, filename_lower, out_name)
    used = set()

    for name in sorted(files, key=str.lower):
        path = os.path.join(src_dir, name)
        try:
            with Image.open(path) as im:
                taken = read_capture_time(im)
                im = ImageOps.exif_transpose(im)  # 依 EXIF 轉正
                if im.mode not in ("RGB", "L"):
                    im = im.convert("RGB")
                w, h = im.size
                scale = MAX_SIDE / max(w, h)
                if scale < 1:
                    im = im.resize((round(w * scale), round(h * scale)),
                                   Image.LANCZOS)
                out_name = safe_name(name)
                base, ext = os.path.splitext(out_name)
                n = 1
                while out_name in used:
                    n += 1
                    out_name = f"{base}_{n}{ext}"
                used.add(out_name)
                # 不保留 EXIF（已轉正，避免瀏覽器再轉一次）
                im.save(os.path.join(out_dir, out_name), "JPEG",
                        quality=QUALITY, optimize=True, progressive=True)
        except Exception as e:
            print(f"  [略過] {name}: {e}")
            continue

        records.append((taken is not None, taken or datetime.min,
                        name.lower(), out_name))
        date_str = taken.strftime("%Y-%m-%d") if taken else "（無日期）"
        print(f"  {date_str}  {name}  ->  {out_name}  {im.size[0]}x{im.size[1]}")

    # 沒日期的排最前面（依檔名），有日期的依日期由舊到新
    records.sort(key=lambda r: (r[0], r[1], r[2]))
    return [r[3] for r in records]


def write_photos_js(names, js_path):
    lines = ["// 由 resize_photos.py 自動產生，請勿手動編輯",
             "// 相片依拍攝日期由舊到新排列；沒有日期的排最前面",
             "const PHOTOS = ["]
    for n in names:
        lines.append(f'  "{n}",')
    lines.append("];")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    parser = argparse.ArgumentParser(description="懷念 相片縮圖與排序")
    parser.add_argument("--src", default=os.path.join(here, "..", "pictures"),
                        help="原始相片資料夾（預設：上一層的 pictures/）")
    parser.add_argument("--out", default=os.path.join(here, "picture"),
                        help="輸出資料夾（預設：picture/）")
    args = parser.parse_args()

    src = os.path.abspath(args.src)
    out = os.path.abspath(args.out)
    if not os.path.isdir(src):
        print(f"找不到來源資料夾：{src}")
        sys.exit(1)

    print(f"來源：{src}")
    print(f"輸出：{out}")
    names = process(src, out)
    js_path = os.path.join(here, "photos.js")
    write_photos_js(names, js_path)
    print(f"\n完成：共 {len(names)} 張，已寫入 {js_path}")


if __name__ == "__main__":
    main()
