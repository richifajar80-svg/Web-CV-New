/**
 * Direct PDF Download Utility for CV Documents
 * Uses html2canvas-pro (Tailwind v4 / oklch support) + jsPDF
 * Directly downloads CV as a .pdf file without opening the browser print dialog.
 */

export async function exportCVToPDF(
  elementId: string = 'cv-paper-document',
  fileName: string = 'CV.pdf',
  options?: { removeWatermark?: boolean }
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
    const prevWidth = element.style.width;
    const prevHeight = element.style.height;
    const prevMinHeight = element.style.minHeight;
    const prevDisplay = element.style.display;
    const prevFlexDirection = element.style.flexDirection;

    // Hide watermark temporarily during official PDF export if requested (clean export for paid users)
    const shouldRemoveWatermark = options?.removeWatermark !== false;
    const watermarkEl = shouldRemoveWatermark
      ? (element.querySelector('.cv-watermark-overlay') as HTMLElement | null)
      : null;
    const prevWatermarkDisplay = watermarkEl ? watermarkEl.style.display : null;

    // Helper to restore element styles safely
    const restoreStyles = () => {
      if (watermarkEl && prevWatermarkDisplay !== null) {
        watermarkEl.style.display = prevWatermarkDisplay;
      }
      element.style.transform = prevTransform;
      element.style.transformOrigin = prevTransformOrigin;
      element.style.position = prevPosition;
      element.style.top = prevTop;
      element.style.left = prevLeft;
      element.style.boxShadow = prevBoxShadow;
      element.style.border = prevBorder;
      element.style.borderRadius = prevBorderRadius;
      element.style.width = prevWidth;
      element.style.height = prevHeight;
      element.style.minHeight = prevMinHeight;
      element.style.display = prevDisplay;
      element.style.flexDirection = prevFlexDirection;
    };

    if (watermarkEl) {
      watermarkEl.style.display = 'none';
    }

    // Accurately measure content height to establish exact full A4 page multiples (1123px, 2246px, etc.)
    const rootRect = element.getBoundingClientRect();
    const rootScale =
      rootRect.width > 0 ? rootRect.width / (element.offsetWidth || 794) : 1;

    const templateEl = element.firstElementChild as HTMLElement | null;
    let maxContentBottom = 0;

    if (templateEl) {
      const sections = Array.from(templateEl.children) as HTMLElement[];
      for (const sec of sections) {
        if (sec.classList.contains('cv-watermark-overlay')) continue;
        if (sec.children.length === 0 && !sec.textContent?.trim()) continue;

        if (sec.children.length > 0) {
          const subItems = Array.from(sec.children) as HTMLElement[];
          for (const item of subItems) {
            const rect = item.getBoundingClientRect();
            if (rect.height > 0) {
              const b = (rect.bottom - rootRect.top) / (rootScale || 1);
              if (b > maxContentBottom) maxContentBottom = b;
            }
          }
        } else {
          const rect = sec.getBoundingClientRect();
          if (rect.height > 0) {
            const b = (rect.bottom - rootRect.top) / (rootScale || 1);
            if (b > maxContentBottom) maxContentBottom = b;
          }
        }
      }
    }

    if (maxContentBottom === 0) {
      maxContentBottom = element.scrollHeight || element.offsetHeight || 1123;
    }

    const PAGE_A4_PX = 1123;
    let totalPages = 1;
    let targetCaptureHeight = PAGE_A4_PX;

    if (maxContentBottom > 1165) {
      totalPages = Math.ceil((maxContentBottom + 10) / PAGE_A4_PX);
      targetCaptureHeight = totalPages * PAGE_A4_PX;
    } else if (maxContentBottom > PAGE_A4_PX && maxContentBottom <= 1165) {
      // Minor overflow (1-2 lines): capture natural height to fit onto 1 page without trailing blank page
      totalPages = 1;
      targetCaptureHeight = Math.ceil(maxContentBottom);
    } else {
      totalPages = 1;
      targetCaptureHeight = PAGE_A4_PX;
    }

    // Set exact capture styles ensuring 100% full-height column stretch from top to bottom
    element.style.transform = 'none';
    element.style.transformOrigin = 'initial';
    element.style.position = 'static';
    element.style.boxShadow = 'none';
    element.style.border = 'none';
    element.style.borderRadius = '0';
    element.style.width = '794px';
    element.style.height = `${targetCaptureHeight}px`;
    element.style.minHeight = `${targetCaptureHeight}px`;
    element.style.display = 'flex';
    element.style.flexDirection = 'column';

    // Wait a brief moment for styles and layout reflow
    await new Promise((resolve) => setTimeout(resolve, 80));

    let canvas;
    try {
      // Capture element with html2canvas-pro at high-density scale (300+ DPI Ultra-HD print quality)
      canvas = await html2canvas(element, {
        scale: 3, // 3x (~300 DPI true print sharpness for crisp vector-like text)
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1200,
        scrollY: 0,
        scrollX: 0,
      });
    } finally {
      // Always restore original styles regardless of capture success/failure
      restoreStyles();
    }

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

    // Handle pagination:
    if (totalPages === 1 && maxContentBottom > PAGE_A4_PX && maxContentBottom <= 1165) {
      // Scale-fit slight 1-page overflow edge-to-edge into single 297mm page
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pageA4Height, undefined, 'FAST');
    } else {
      // Multi-page or standard 1-page: each page is filled 100% with exact full-height continuous canvas
      const totalPdfHeight = totalPages * pageA4Height;
      for (let p = 0; p < totalPages; p++) {
        if (p > 0) {
          pdf.addPage();
        }
        const yOffset = -p * pageA4Height;
        pdf.addImage(imgData, 'PNG', 0, yOffset, pdfWidth, totalPdfHeight, undefined, 'FAST');
      }
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

