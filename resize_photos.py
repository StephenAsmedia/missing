"""用法：py resize_photos.py [相片來源資料夾]；需要 Pillow。"""
from pathlib import Path
import argparse
import json
import re
import tempfile
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent

def natural_key(path):
    return tuple((1, int(part)) if part.isdigit() else (0, part.casefold())
                 for part in re.split(r'(\d+)', path.name))

def resize(source, destination):
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((1920, 1920), Image.Resampling.LANCZOS)
        image.save(destination, 'JPEG', quality=85, optimize=True)

def main():
    parser = argparse.ArgumentParser(description='依檔名自然排序、修正 EXIF 方向、縮圖並更新 photos.js')
    parser.add_argument('source', nargs='?', default=r'D:\Missing\pictures')
    args = parser.parse_args()
    source = Path(args.source).resolve()
    output = ROOT / 'picture'
    if source == output.resolve():
        raise SystemExit('來源不能是輸出的 picture 資料夾，請指定原始相片資料夾。')
    if not source.is_dir():
        raise SystemExit(f'找不到來源資料夾：{source}')
    files = sorted((p for p in source.iterdir() if p.is_file() and p.suffix.lower() in {'.jpg', '.jpeg'}), key=lambda p: (natural_key(p), p.name))
    if not files:
        raise SystemExit(f'來源沒有 JPG 相片：{source}。既有輸出未變更。')
    names = [p.stem + '.jpg' for p in files]
    if len({name.casefold() for name in names}) != len(names):
        raise SystemExit('有同名 JPG/JPEG，請先改名以免覆寫。')
    # 所有相片都成功轉換後，才更新輸出；原始素材永不修改。
    with tempfile.TemporaryDirectory(prefix='resize-', dir=ROOT) as temporary:
        stage = Path(temporary)
        for source_file, name in zip(files, names):
            resize(source_file, stage / name)
        output.mkdir(exist_ok=True)
        for old in output.iterdir():
            if old.is_file() and old.suffix.lower() in {'.jpg', '.jpeg'}:
                old.unlink()
        for name in names:
            (stage / name).replace(output / name)
        (ROOT / 'photos.js').write_text('// 自動產生：依檔名自然排序。\nconst PHOTOS = ' + json.dumps(names, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    print(f'已處理 {len(names)} 張相片；長邊最多 1920px、JPEG 品質 85。')

if __name__ == '__main__':
    main()
