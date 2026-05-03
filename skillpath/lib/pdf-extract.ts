import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Disable the worker — required for serverless/Node environments
// where there's no browser worker thread available
if (typeof window === 'undefined') {
  GlobalWorkerOptions.workerSrc = '';
}

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  try {
    const loadingTask = getDocument({
      data: new Uint8Array(buffer),
      // Disable worker explicitly for server environments
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true,
    });

    const pdf   = await loadingTask.promise;
    const pages = pdf.numPages;
    const texts: string[] = [];

    for (let i = 1; i <= pages; i++) {
      const page    = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      texts.push(pageText);
    }

    const fullText = texts.join('\n\n').trim();

    if (!fullText) throw new Error('No text extracted — PDF may be image-based');

    return fullText;
  } catch (err) {
    console.error('[PDF Extract Error]:', err);
    throw new Error(
      err instanceof Error ? err.message : 'Failed to extract text from PDF'
    );
  }
}
