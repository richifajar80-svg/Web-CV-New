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

    // Capture element with html2canvas-pro (full support for modern CSS / Tailwind v4)
    const canvas = await html2canvas(element, {
      scale: 2, // 2x for sharp 300 DPI text & graphics
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

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    const pdfWidth = 210;
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Handle pagination if content spans beyond 1 A4 page
    if (pdfHeight > 297) {
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= 297;

      while (heightLeft > 5) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
        heightLeft -= 297;
      }
    } else {
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
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
