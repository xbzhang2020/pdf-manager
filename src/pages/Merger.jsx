import { useRef } from "react";
import { PDFDocument } from "pdf-lib";

let mergedPdfDoc = null;

function Merger() {
  const fileRef = useRef(null);

  async function merge() {
    const files = fileRef.current.files;
    mergedPdfDoc = await PDFDocument.create();

    for await (const file of files) {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
          resolve(reader.result);
        };
      });

      const pdfDoc = await PDFDocument.load(data);
      const copiedPages = await mergedPdfDoc.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((item) => {
        mergedPdfDoc.addPage(item);
      });
    }
  }

  async function getMergedPDFDocURL() {
    if (!mergedPdfDoc) return null;
    const pdfBytes = await mergedPdfDoc.save();
    const pdbBlob = new Blob([pdfBytes], {
      type: "application/pdf",
    });
    const url = URL.createObjectURL(pdbBlob);
    return url;
  }

  async function preview() {
    if (!mergedPdfDoc) {
      await merge();
    }

    const url = await getMergedPDFDocURL();
    // document.getElementById("pdf").src = url;
    window.open(url);
  }

  async function download() {
    if (!mergedPdfDoc) {
      await merge();
    }
    const url = await getMergedPDFDocURL();

    const link = document.createElement("a");
    link.download = "merged.pdf";
    link.href = url;
    link.click();
  }

  return (
    <div>
      <input ref={fileRef} type="file" id="file" multiple accept=".pdf" />

      <button id="preview-btn" onClick={preview}>
        预览
      </button>
      <button id="download-btn" onClick={download}>
        下载
      </button>
    </div>
  );
}

export default Merger;
