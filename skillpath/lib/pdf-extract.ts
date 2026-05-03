// lib/pdf-extract.ts
import PDFParser from 'pdf2json';

export async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  return new Promise((resolve, reject) => {
    // pdf2json constructor options
    const parser = new (PDFParser as any)(null, true);

    parser.on('pdfParser_dataReady', (data: any) => {
      try {
        const text = data.Pages
          .flatMap((page: any) => page.Texts)
          .map((t: any) => decodeURIComponent(t.R.map((r: any) => r.T).join('')))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        if (!text) {
          reject(new Error('No text found — PDF may be image/scanned'));
          return;
        }
        resolve(text);
      } catch (e) {
        reject(new Error('Failed to parse PDF structure'));
      }
    });

    parser.on('pdfParser_dataError', (err: any) => {
      console.error('[PDF Parser Error]:', err);
      reject(new Error(err?.parserError ?? 'PDF parse error'));
    });

    // Use Buffer.from for Node-based pdf2json
    parser.parseBuffer(Buffer.from(buffer));
  });
}
