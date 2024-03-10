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

// Get the button element
const shareButton = document.getElementById("share-button");

// Check if the Web Share API is available
if (navigator.share) {
  // Add a click event listener to the button
  shareButton.addEventListener("click", async () => {
    try {
      // Get all the elements with the class content
      const contentElements = document.querySelectorAll(".content");
      // Initialize an empty string to store the text content
      let text = "";
      // Loop through the content elements and append their text content to the string
      for (let element of contentElements) {
        text += element.textContent + "\n";
      }
      // Copy the text to the clipboard
      await navigator.clipboard.writeText(text);
      // Share the text with the Web Share API
      await navigator.share({
        title: "FreeGPT",
        text: text
      });
    } catch (error) {
      // Handle error
      console.error("Error sharing content", error);
    }
  });
} else {
  // Hide the button if the Web Share API is not supported
  shareButton.style.display = "none";
}

// Get the print button element
const printButton = document.getElementById("print-button");

// Add a click event listener to the print button
printButton.addEventListener("click", () => {
  try {
    // Get all the elements with the class content
    const contentElements = document.querySelectorAll(".content");
    // Initialize an empty string to store the text content
    let text = "";
    // Loop through the content elements and append their text content to the string
    for (let element of contentElements) {
      text += element.textContent + "\n";
    }
    // Create a new jsPDF instance
    const pdf = new jsPDF();
    // Set the font size to 12
    pdf.setFontSize(12);
    // Split the text into lines that fit the page width
    const lines = pdf.splitTextToSize(text, pdf.internal.pageSize.width - 20);
    // Add the lines to the PDF document
    pdf.text(lines, 10, 10);
    // Save the PDF document with the title as the file name
    pdf.save("FreeGPT.pdf");
  } catch (error) {
    // Handle error
    console.error("Error printing content", error);
  }
});

