import os
import sys
import time
import pathlib
import comtypes.client
import pymupdf

sys.stdout.reconfigure(encoding="utf-8")

dl_dir = pathlib.Path("C:/Users/acer/Downloads").resolve()
src_pptx = dl_dir / "SEMICON_India_Hackathon_SPARTANS_Final.pptx"
dst_pdf = dl_dir / "SEMICON_India_Hackathon_SPARTANS_Final.pdf"

print(f"Source PPTX: {src_pptx} (Exists: {src_pptx.exists()})")

# Ensure old PDF is deleted first so we know it's a 100% fresh write
if dst_pdf.exists():
    try:
        dst_pdf.unlink()
        print("Deleted old PDF from Downloads.")
    except Exception as e:
        print(f"Could not delete old PDF: {e}")

print("Initializing PowerPoint COM...")
ppt = comtypes.client.CreateObject("PowerPoint.Application")
time.sleep(2)
ppt.Visible = 1
time.sleep(1)

print(f"Opening PPTX: {src_pptx} ...")
pres = ppt.Presentations.Open(str(src_pptx))
time.sleep(2)

print(f"Exporting fresh PDF: {dst_pdf} ...")
pres.SaveAs(str(dst_pdf), 32)
time.sleep(2)

try:
    pres.Close()
except Exception:
    pass

try:
    ppt.Quit()
except Exception:
    pass

print(f"[SUCCESS] Exported PDF: {dst_pdf} (Size: {dst_pdf.stat().st_size} bytes)")

# Verify with PyMuPDF
doc = pymupdf.open(str(dst_pdf))
page1 = doc[0]
blocks = page1.get_text("blocks")
print(f"\n=== VERIFYING SLIDE 1 TEXT BLOCKS IN PDF (Total: {len(blocks)}) ===")
ashwath_count = 0
for b in blocks:
    txt = b[4].strip()
    if "ASHWATH" in txt or "ashwath" in txt:
        ashwath_count += 1
        print(f"Ashwath Box {ashwath_count} at ({b[0]:.1f}, {b[1]:.1f}, {b[2]:.1f}, {b[3]:.1f}):\n{repr(txt)}\n")

print(f"Total Ashwath boxes found: {ashwath_count}")
if ashwath_count == 1:
    print("[VERIFICATION PASSED] Exactly 1 clean Ashwath box found! Zero overlapping text!")
else:
    print(f"[VERIFICATION WARNING] Found {ashwath_count} boxes!")
