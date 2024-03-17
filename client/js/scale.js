if (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches) {
  document.addEventListener('dblclick', function(event) {
    if (event.target.closest('.conversation') !== null) {
      const content = event.target.closest('.conversation');
      const currentScale = window.getComputedStyle(content).transform;
      const scaleMatrix = new WebKitCSSMatrix(currentScale);
      const scaleX = scaleMatrix.a;
      const scaleY = scaleMatrix.d;

      if (scaleX === 1 && scaleY === 1) {
        content.style.transform = "scaleX(1.2) scaleY(1.2)";
        content.classList.add("enlarged");
      } else {
        content.style.transform = "scaleX(1) scaleY(1)";
        content.classList.remove("enlarged");
      }
    }
  });
}

const shareButton = document.getElementById("share-button");
const pdfButton = document.getElementById("pdf-button");

if (navigator.share) {  
  shareButton.addEventListener("click", async () => {
    try {      
      const contentElements = document.querySelectorAll(".content");      
      let text = "";     
      for (let element of contentElements) {
        text += element.textContent + "\n";
      }      
      await navigator.clipboard.writeText(text);
      await navigator.share({
        title: "FreeGPT",
        text: text,
      });
    } catch (error) {
        console.error("Error sharing content", error);
    }
  });

  pdfButton.addEventListener("click", () => {
    try {
      let currentPage = 0;
      const pdf = new jspdf.jsPDF();
      const messageElements = document.querySelectorAll('.message.user, .message.assistant');
      const sortedElements = Array.from(messageElements).sort((a, b) => {
        return a.compareDocumentPosition(b) & 2 ? 1 : -1;
      });
  
      sortedElements.forEach(element => {
        let cleanText = "\n" + element.textContent.replace(/^[\t\s]+/, '').replace(/[\t\s]+$/, '').replace(/content_copycontent_copy/g, '').replace(/content_copy/g, '');
        
        if (element.classList.contains('user')) {
          pdf.getFont();
          pdf.setFont('Helvetica', 'italic');
          pdf.setFontSize(12);
          pdf.setLineHeightFactor(0.5);
        } else {
          pdf.getFont();
          pdf.setFont('Helvetica', 'normal');
          pdf.setFontSize(12);
          pdf.setLineHeightFactor(0.5);
        }
        let lines = pdf.splitTextToSize(cleanText, pdf.internal.pageSize.width - 20);
        lines.forEach(line => {
          if (currentPage * 10 + 10 >= pdf.internal.pageSize.height) {
            pdf.addPage();
            currentPage = 0;
          }
          pdf.text(line, 10, 10 + (currentPage * 10));
          currentPage++;
        });
      });
  
      pdf.save("FreeGPT.pdf");
    } catch (error) {
      console.error("Error printing content", error);
    }
  });
} else {
  shareButton.style.display = "none";
  pdfButton.style.display = "none";
};