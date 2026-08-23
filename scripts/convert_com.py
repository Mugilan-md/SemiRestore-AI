import time
import shutil
import pathlib
import comtypes.client

src = str(pathlib.Path("SEMICON_India_Hackathon_SemiRestoreAI.pptx").resolve())
pdf = str(pathlib.Path("SEMICON_India_Hackathon_SPARTANS_Final.pdf").resolve())

print("Opening PowerPoint via comtypes...")
ppt = comtypes.client.CreateObject("PowerPoint.Application")
ppt.Visible = 1
pres = ppt.Presentations.Open(src)
time.sleep(1)
pres.SaveAs(pdf, 32)
pres.Close()
ppt.Quit()
print("SUCCESS: Exported", pdf)

dl = pathlib.Path("C:/Users/acer/Downloads")
for name in [
    "SEMICON_India_Hackathon_SPARTANS_Final.pdf",
    "SEMICON_India_Hackathon_SPARTANS_Final.pptx",
    "SEMICON_India_Hackathon_SemiRestoreAI.pdf",
    "SEMICON_India_Hackathon_SemiRestoreAI.pptx"
]:
    fsrc = pdf if name.endswith(".pdf") else src
    shutil.copy2(fsrc, dl / name)
    print("Copied to Downloads:", name)
