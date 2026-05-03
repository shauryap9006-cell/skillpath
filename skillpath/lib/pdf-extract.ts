// lib/pdf-extract.ts
// Must use the legacy build — the default pdfjs-dist entry
// tries to load workers which don't exist in serverless
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// Disable worker entirely — mandatory for serverless/Node environments
(pdfjsLib as any).GlobalWorkerOptions.workerSrc = '';

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument({
      data:             new Uint8Array(buffer),
      useWorkerFetch:   false,
      isEvalSupported:  false,
      useSystemFonts:   true,
      disableFontFace:  true,
    });

    const pdf   = await loadingTask.promise;
    const texts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text    = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      texts.push(text);
    }

    const result = texts.filter(Boolean).join('\n\n').trim();
    if (!result) throw new Error('No text found — PDF may be image/scanned');
    return result;

  } catch (err) {
    console.error('[PDF Extract Error]:', err);
    throw new Error(err instanceof Error ? err.message : 'PDF extraction failed');
  }
}
