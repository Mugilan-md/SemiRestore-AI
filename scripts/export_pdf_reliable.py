import time
import shutil
import pathlib
import comtypes.client

src = str(pathlib.Path("SEMICON_India_Hackathon_SemiRestoreAI.pptx").resolve())
pdf = str(pathlib.Path("SEMICON_India_Hackathon_SPARTANS_Final.pdf").resolve())

print("Launching PowerPoint application...")
ppt = comtypes.client.CreateObject("PowerPoint.Application")
time.sleep(2)
ppt.Visible = 1
time.sleep(1)

print("Opening presentation...")
pres = ppt.Presentations.Open(src)
time.sleep(2)

print(f"Exporting PDF to: {pdf} ...")
pres.SaveAs(pdf, 32) # 32 = ppSaveAsPDF
time.sleep(1)

try:
    pres.Close()
except Exception:
    pass

try:
    ppt.Quit()
except Exception:
    pass

print(f"[SUCCESS] PDF successfully created: {pdf}")

dl = pathlib.Path("C:/Users/acer/Downloads")
for dest in [
    "SEMICON_India_Hackathon_SPARTANS_Final.pdf",
    "SEMICON_India_Hackathon_SPARTANS_Final.pptx",
    "SEMICON_India_Hackathon_SemiRestoreAI.pdf",
    "SEMICON_India_Hackathon_SemiRestoreAI.pptx"
]:
    fsrc = pdf if dest.endswith(".pdf") else src
    shutil.copy2(fsrc, dl / dest)
    print(f"[SUCCESS] Copied to Downloads: {dest} (Size: {pathlib.Path(dl / dest).stat().st_size} bytes)")
