/**
 * Direct PDF Download Utility for CV Documents
 * Uses html2canvas-pro (Tailwind v4 / oklch support) + jsPDF
 * Directly downloads CV as a .pdf file without opening the browser print dialog.
 */

export async function exportCVToPDF(
  elementId: string = 'cv-paper-document',
  fileName: string = 'CV.pdf'
): Promise<boolean> {
  if (typeof window === 'undefined') return false;

  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element #${elementId} not found for PDF export.`);
    return false;
  }

  try {
    // Dynamically import in browser to prevent any SSR issues
    const html2canvasModule = await import('html2canvas-pro');
    const html2canvas = html2canvasModule.default || html2canvasModule;
    const { jsPDF } = await import('jspdf');

    // Save previous inline styles
    const prevTransform = element.style.transform;
    const prevTransformOrigin = element.style.transformOrigin;
    const prevPosition = element.style.position;
    const prevTop = element.style.top;
    const prevLeft = element.style.left;
    const prevBoxShadow = element.style.boxShadow;
    const prevBorder = element.style.border;
    const prevBorderRadius = element.style.borderRadius;

    // Reset scaling and styling for clean capture at exact full A4 dimensions
    element.style.transform = 'none';
    element.style.transformOrigin = 'initial';
    element.style.position = 'static';
    element.style.boxShadow = 'none';
    element.style.border = 'none';
    element.style.borderRadius = '0';

    // Wait a brief moment for styles to apply
    await new Promise((resolve) => setTimeout(resolve, 80));

    // Capture element with html2canvas-pro at high-density scale (300+ DPI Ultra-HD print quality)
    const canvas = await html2canvas(element, {
      scale: 3, // 3x (~300 DPI true print sharpness for crisp vector-like text)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      scrollY: 0,
      scrollX: 0,
    });

    // Restore original styles immediately
    element.style.transform = prevTransform;
    element.style.transformOrigin = prevTransformOrigin;
    element.style.position = prevPosition;
    element.style.top = prevTop;
    element.style.left = prevLeft;
    element.style.boxShadow = prevBoxShadow;
    element.style.border = prevBorder;
    element.style.borderRadius = prevBorderRadius;

    // Create A4 PDF (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Lossless PNG encoding for razor-sharp typography with zero compression halos
    const imgData = canvas.toDataURL('image/png');
    const pdfWidth = 210;
    const pageA4Height = 297;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Handle pagination with smart overflow tolerance:
    // If content is just 1-3 lines over 1 page (<= 308mm), scale gently to fit 1 page cleanly without blank 2nd page!
    if (pdfHeight > pageA4Height && pdfHeight <= 308) {
      const fitScale = pageA4Height / pdfHeight;
      const fitWidth = pdfWidth * fitScale;
      const xOffset = (pdfWidth - fitWidth) / 2;
      pdf.addImage(imgData, 'PNG', xOffset, 0, fitWidth, pageA4Height, undefined, 'FAST');
    } else if (pdfHeight > pageA4Height) {
      // Genuinely multi-page CV (e.g. 2 or more full pages)
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageA4Height;

      while (heightLeft > 10) {
        position -= pageA4Height;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= pageA4Height;
      }
    } else {
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    }

    const safeFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    
    // Trigger direct browser file download
    pdf.save(safeFileName);

    return true;
  } catch (err) {
    console.error('Direct PDF export error:', err);
    return false;
  }
}

/**
 * Triggers native browser print dialog to export 100% True Vector Text PDF.
 * Uses @media print CSS rules to output crisp, selectable, lossless vector typography.
 */
export function printCVToVectorPDF(): void {
  if (typeof window !== 'undefined') {
    window.print();
  }
}

