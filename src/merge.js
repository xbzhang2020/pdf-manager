(() => {
  const { PDFDocument } = PDFLib;
  let mergedPdfDoc = null;

  async function merge() {
    const fileList = document.getElementById("file");
    const files = fileList.files;
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

  const previewBtn = document.getElementById("preview-btn");
  previewBtn.addEventListener("click", preview);

  const downloadBtn = document.getElementById("download-btn");
  downloadBtn.addEventListener("click", download);
})();
