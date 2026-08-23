import os
import time
import pathlib
import win32com.client

pptx_path = pathlib.Path("SEMICON_India_Hackathon_SemiRestoreAI.pptx").resolve()
downloads_dir = pathlib.Path(os.environ["USERPROFILE"]) / "Downloads"
pdf_path = downloads_dir / "SEMICON_India_Hackathon_SemiRestoreAI.pdf"
local_pdf = pptx_path.parent / "SEMICON_India_Hackathon_SemiRestoreAI.pdf"

print(f"Opening presentation: {pptx_path}")
ppt_app = win32com.client.Dispatch("PowerPoint.Application")
ppt_app.Visible = 1
ppt_app.WindowState = 2 # Minimized

try:
    presentation = ppt_app.Presentations.Open(str(pptx_path), 1, 0, 1) # ReadOnly=1, Untitled=0, WithWindow=1
    time.sleep(1)
    print(f"Saving to PDF: {pdf_path}")
    presentation.SaveAs(str(pdf_path), 32) # 32 = ppSaveAsPDF
    presentation.SaveAs(str(local_pdf), 32)
    presentation.Close()
    print("SUCCESS: PDF Exported Successfully!")
finally:
    ppt_app.Quit()
