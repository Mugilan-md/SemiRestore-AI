$src = "C:\Users\acer\OneDrive - ELCOT\PROJECTS\SEMICON\SEMICON_India_Hackathon_SemiRestoreAI.pptx"
$pdf = "C:\Users\acer\OneDrive - ELCOT\PROJECTS\SEMICON\SEMICON_India_Hackathon_SPARTANS_Final.pdf"
$dl_pdf = "C:\Users\acer\Downloads\SEMICON_India_Hackathon_SPARTANS_Final.pdf"
$dl_pdf2 = "C:\Users\acer\Downloads\SEMICON_India_Hackathon_SemiRestoreAI.pdf"
$dl_pptx = "C:\Users\acer\Downloads\SEMICON_India_Hackathon_SPARTANS_Final.pptx"
$dl_pptx2 = "C:\Users\acer\Downloads\SEMICON_India_Hackathon_SemiRestoreAI.pptx"

Write-Host "Starting PowerPoint COM Conversion..."
$ppt = New-Object -ComObject PowerPoint.Application
$ppt.Visible = 1
$deck = $ppt.Presentations.Open($src, 1, 0, 1)
Start-Sleep -Seconds 1
$deck.SaveAs($pdf, 32)
$deck.Close()
$ppt.Quit()

[System.Runtime.InteropServices.Marshal]::ReleaseComObject($deck) | Out-Null
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($ppt) | Out-Null
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host "Distributing PDF & PPTX to Downloads..."
Copy-Item -Path $pdf -Destination $dl_pdf -Force
Copy-Item -Path $pdf -Destination $dl_pdf2 -Force
Copy-Item -Path $src -Destination $dl_pptx -Force
Copy-Item -Path $src -Destination $dl_pptx2 -Force

Write-Host "SUCCESS! Export complete."
Get-Item $dl_pdf | Format-List FullName, Length, LastWriteTime
