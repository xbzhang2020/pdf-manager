(() => {
  const { PDFDocument } = PDFLib;
  let mergedPdfDoc = null;

  const mergerForm = document.getElementById("mergerForm");
  let files = null;

  function handleFiles(event) {
    files = event.target.files;
    const firstFileName = files[0]?.name;
    if (firstFileName) {
      mergerForm.elements["name"].value = firstFileName;
    }
  }

  async function merge() {
    if (!files) {
      alert("请先添加待合并文件");
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(files[i]);
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = () => {
          reject();
        };
      });

      const pdfDoc = await PDFDocument.load(data);
      if (i === 0) {
        // 在第一个 pdf 文件基础上添加其他文件，防止目录等元信息丢失
        mergedPdfDoc = pdfDoc;
      } else {
        const copiedPages = await mergedPdfDoc.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((item) => {
          mergedPdfDoc.addPage(item);
        });
      }
    }
  }

  async function getMergedDocURL() {
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
    const url = await getMergedDocURL();
    if (!url) return;

    window.open(url);
  }

  async function download() {
    if (!mergedPdfDoc) {
      await merge();
    }
    const url = await getMergedDocURL();
    if (!url) return;

    const link = document.createElement("a");
    link.download = mergerForm.elements["name"].value || "merged.pdf";
    link.href = url;
    link.click();
  }

  mergerForm.elements["file"].addEventListener("change", handleFiles);
  document.getElementById("previewBtn").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    preview();
  });
  document.getElementById("downloadBtn").addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    download();
  });
})();
