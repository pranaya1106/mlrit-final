# PDF Documents Directory

Place your department PDF documents in this folder.

## Naming Convention
Name PDFs clearly to help the system identify departments:
- `CSE_Department_Profile.pdf`
- `ECE_Department_Overview.pdf`
- `Mechanical_Engineering.pdf`
- `Admissions_Guide.pdf`
- `Placement_Brochure.pdf`

## Supported Formats
- PDF files only (.pdf)
- Subfolders are supported

## Auto-Indexing
PDFs are automatically indexed when the server starts.
Use POST /reindex to manually re-index after adding new PDFs.

## ⚠️ One PDF per department

Department tagging (`chatbot/pdf_processor.py`) matches on filename/path keywords — it cannot split a single PDF's content across two departments. **`CSD CSM.pdf` is a known example of what NOT to do**: it covers CSE (Data Science) and AIML together, doesn't match either department's filename keywords, and gets tagged "General" as a result — so neither department gets real PDF-backed answers from it. If a document covers multiple departments, split it into one PDF per department (each containing only that department's content) before adding it here.
