import {
  normalizeParseResult,
  parseTextToTransaction,
  type ParsedTransaction,
  type ParseResult,
} from '@/lib/core/parserEngine';

export type { ParsedTransaction, ParseResult };

type OCRWorker = {
  recognize: (input: File) => Promise<{ data: { text: string } }>;
};

let sharedWorker: OCRWorker | null = null;
let isInitializing = false;

async function getWorker() {
  try {
    if (sharedWorker) return sharedWorker;
    if (isInitializing) {
      let attempts = 0;
      while (isInitializing && attempts < 50) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
      if (sharedWorker) return sharedWorker;
    }

    isInitializing = true;
    const { createWorker } = await import('tesseract.js');

    // Use default local initialization to avoid CDN/Network errors
    // Vite handles bundling these workers automatically when using the library normally
    const worker = (await createWorker('eng')) as OCRWorker;

    sharedWorker = worker;
    return sharedWorker;
  } catch (error) {
    console.error('[OCR] Worker initialization failed:', error);
    throw error;
  } finally {
    isInitializing = false;
  }
}

export async function warmupOCR() {
  try {
    await getWorker();
  } catch {
    // Pre-warm is opportunistic; parsing will retry on demand.
  }
}

export async function parseImage(file: File): Promise<ParseResult> {
  try {
    const worker = await getWorker();

    if (!file.type.startsWith('image/')) {
      return { transactions: [], errors: ['File is not a valid image.'] };
    }

    const {
      data: { text },
    } = await worker.recognize(file);

    if (!text || text.trim().length < 3) {
      return {
        transactions: [],
        errors: ['Could not extract readable text. Try a clearer photo.'],
      };
    }

    const transaction = parseTextToTransaction(text, 'image');
    return normalizeParseResult({
      // Allow if we found at least an amount, merchant, or significant text
      transactions:
        transaction.amount > 0 || transaction.merchant || text.length > 20 ? [transaction] : [],
      errors: [],
    });
  } catch (error) {
    console.error('[Parser] Image parsing failed:', error);

    const errorMsg = error instanceof Error ? error.message : String(error);
    if (
      errorMsg.includes('worker') ||
      errorMsg.includes('terminate') ||
      errorMsg.includes('NetworkError')
    ) {
      sharedWorker = null;
    }

    return {
      transactions: [],
      errors: [
        `Scan failed: ${errorMsg}. Please ensure you have an active internet connection for the first load, or try again.`,
      ],
    };
  }
}

export async function parsePDF(file: File): Promise<ParseResult> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    // Using a more robust local-first worker configuration for PDF.js
    const workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const transactions: ParsedTransaction[] = [];
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText +=
        textContent.items
          .map((item) => {
            if (typeof item === 'object' && item !== null && 'str' in item) {
              return (item as { str: string }).str;
            }
            return '';
          })
          .join(' ') + '\n';
    }

    if (!fullText.trim()) {
      return { transactions: [], errors: ['No readable text found in PDF.'] };
    }

    const transaction = parseTextToTransaction(fullText, 'pdf');
    if (transaction.amount > 0 || transaction.merchant) {
      transactions.push(transaction);
    }

    return normalizeParseResult({
      transactions,
      errors: transactions.length === 0 ? ['Could not extract transaction data.'] : [],
    });
  } catch (error) {
    console.error('[Parser] PDF parsing failed:', error);
    return {
      transactions: [],
      errors: [`PDF Scan failed: ${error instanceof Error ? error.message : 'Unknown error'}`],
    };
  }
}

export async function parseFile(file: File): Promise<ParseResult> {
  const fileType = file.type.toLowerCase();
  if (fileType.includes('image')) return parseImage(file);
  if (fileType.includes('pdf')) return parsePDF(file);
  return { transactions: [], errors: [`Unsupported file type: ${file.type}`] };
}

export function parseText(text: string): ParseResult {
  const transaction = parseTextToTransaction(text, 'sms');
  return normalizeParseResult({ transactions: [transaction], errors: [] });
}
