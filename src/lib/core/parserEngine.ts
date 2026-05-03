import { parseSmsExpense } from '@/utils/smsParser';
import { dollarsToCentsSafe } from './financeEngine';
import { toLocalDateString } from '@/utils/date';

export interface ParsedTransaction {
  amount: number;
  merchant: string;
  date: Date;
  type: 'expense' | 'income';
  category: string;
  rawText: string;
  source: 'sms' | 'image' | 'pdf';
  confidence: 'high' | 'medium' | 'low';
  missingFields: string[];
}

export interface ParseResult {
  transactions: ParsedTransaction[];
  errors: string[];
}

export interface QuickParseResult {
  title: string;
  merchant?: string;
  amount?: number; // in cents
  type: 'expense' | 'income';
  category: string;
  dueDate?: string;
  note?: string;
}

export interface QuickFinanceParseResult {
  amountDollars: number;
  type: 'expense' | 'income';
  category: string;
  date?: string;
  note?: string;
  merchant?: string;
}

const amountPatterns = [
  /\b(?:total|amount|due|grand\s+total|sum|final|paid|net|net\s+pay|gross\s+pay|payable)\b.*?([\d,]+(?:\.\d{2})?)/i,
  /(?:\u20b9|rs\.?|inr|\$|€|£|¥)\s*([\d,]+(?:\.\d+)?)/i,
  /\b(?:paid|spent|debited|deducted|payment|purchase|total|sent|dr|credited|received)\b\s*(?:\u20b9|rs\.?|inr|\$|€|£|¥)?\s*([\d,]+(?:\.\d+)?)/i,
  /(?:^|\s)([\d,]+\.\d{2})(?:\s|$)/m,
  /(?:^|\s)([\d,]{3,10})(?:\s|$)/m,
  /(?:^|\s)([\d,]+)\s*(?:\u20b9|rs|inr|cr|dr)\b/i,
];

const merchantPatterns = [
  /\b(?:salary\s+slip|pay\s+slip|invoice|receipt)\s+of\s+(.+?)(?:\n|$)/i,
  /\bpaid\s+to\s+(.+?)(?:\s+via\b|\s+on\b|[.,;]|$)/i,
  /\bto\s+(.+?)\s+via\b/i,
  /\bat\s+(.+?)(?:\s+on\b|[.,;]|$)/i,
  /\b(?:merchant|store|shop|provider|vendor|employer|organization|college|university|school|company|limited|ltd)[:\s]+(.+?)(?:\n|$)/i,
  /\b(?:thank\s+you\s+for\s+shopping\s+at|your\s+purchase\s+from)[:\s]+(.+?)(?:\n|$)/i,
  /^(?:[^a-z0-9]*)([a-z0-9][^\n\r]{2,40})/im,
];

const datePatterns = [
  /\b(\d{1,2}[-/\s](?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*[-/\s]?\d{0,4})\b/i,
  /\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/i,
  /\b(\d{4}-\d{2}-\d{2})\b/i,
  /\bon\s+(\d{1,2}\s+[a-z]{3,9}(?:\s+\d{2,4})?)\b/i,
  /\b(?:month|for\s+the\s+month\s+of)[:\s]+([a-z]{3,9}\s+\d{2,4})/i,
];

const categoryRules = [
  {
    category: 'Salary',
    keywords: [
      'salary',
      'pay',
      'slip',
      'employee',
      'employer',
      'professor',
      'assistant',
      'department',
    ],
  },
  {
    category: 'Food',
    keywords: [
      'swiggy',
      'zomato',
      'restaurant',
      'cafe',
      'starbucks',
      'mcdonald',
      'kfc',
      'pizza',
      'burger',
      'bake',
      'coffee',
      'tea',
      'grill',
      'kitchen',
      'dining',
    ],
  },
  {
    category: 'Transport',
    keywords: [
      'uber',
      'ola',
      'taxi',
      'metro',
      'rail',
      'fuel',
      'petrol',
      'parking',
      'garage',
      'airline',
      'flight',
      'hotel',
      'stay',
      'indigo',
      'airtel',
      'recharge',
    ],
  },
  {
    category: 'Shopping',
    keywords: [
      'amazon',
      'flipkart',
      'myntra',
      'walmart',
      'target',
      'mall',
      'store',
      'retail',
      'fashion',
      'clothing',
      'shoe',
      'nike',
      'adidas',
    ],
  },
  {
    category: 'Entertainment',
    keywords: [
      'netflix',
      'spotify',
      'cinema',
      'movie',
      'theater',
      'game',
      'steam',
      'pvr',
      'inox',
      'bookmyshow',
    ],
  },
  {
    category: 'Utilities',
    keywords: [
      'electricity',
      'water',
      'gas',
      'internet',
      'phone',
      'mobile',
      'bill',
      'bescom',
      'bsnl',
      'jio',
      'vi ',
    ],
  },
  {
    category: 'Healthcare',
    keywords: [
      'pharmacy',
      'medical',
      'hospital',
      'clinic',
      'doctor',
      'medicine',
      'apollo',
      'pharmeasy',
    ],
  },
  {
    category: 'Groceries',
    keywords: [
      'grocery',
      'supermarket',
      'mart',
      'fresh',
      'vegetable',
      'fruit',
      'bigbasket',
      'blinkit',
      'zepto',
    ],
  },
];

const incomeKeywords = [
  'salary',
  'income',
  'bonus',
  'received',
  'plus',
  'dividend',
  'credited',
  'cr',
  'net pay',
  'gross pay',
  'pay slip',
];

const categoriesMap: Record<string, string[]> = {
  Food: [
    'swiggy',
    'zomato',
    'restaurant',
    'cafe',
    'food',
    'groceries',
    'dinner',
    'lunch',
    'breakfast',
  ],
  Travel: ['uber', 'ola', 'rapido', 'fuel', 'petrol', 'flight', 'train', 'bus', 'travel'],
  Rent: ['rent', 'maintenance'],
  Utilities: ['electricity', 'water', 'internet', 'recharge', 'bill'],
  Study: ['book', 'course', 'fees', 'tuition'],
  Personal: ['shopping', 'clothes', 'gym', 'health'],
  Entertainment: ['movie', 'netflix', 'prime', 'game', 'party'],
};

function stripAmounts(text: string): string {
  return text
    .replace(
      /(?:[\u20B9\u0024\u20AC\u00A3\u00A5]|rs\.?|inr)\s*[\d,]+(?:\.\d{1,2})?|[\d,]+(?:\.\d{1,2})\s*(?:[\u20B9\u0024\u20AC\u00A3\u00A5]|rs\.?|inr)/gi,
      '',
    )
    .replace(/(?:\s|^)[\d,]+(?:\.\d{2})?(?:\s|$)/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseAmountFromText(text: string): number {
  const matches: number[] = [];

  for (const pattern of amountPatterns) {
    const allMatches = text.matchAll(new RegExp(pattern.source, pattern.flags + 'g'));
    for (const match of allMatches) {
      const amountStr = match[1].replace(/,/g, '');
      const amount = Number.parseFloat(amountStr);
      if (Number.isFinite(amount) && amount > 0) {
        matches.push(amount);
      }
    }
  }

  if (matches.length === 0) return 0;
  return Math.max(...matches);
}

function parseMerchantFromText(text: string): string {
  for (const pattern of merchantPatterns.slice(0, -1)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const merchant = stripAmounts(match[1].trim());
      if (merchant.length > 1 && merchant.length < 50) return merchant;
    }
  }

  const fallbackMatch = text.match(merchantPatterns[merchantPatterns.length - 1]);
  if (fallbackMatch && fallbackMatch[1]) {
    const merchant = stripAmounts(fallbackMatch[1].trim());
    const noise = [
      'tax',
      'invoice',
      'receipt',
      'bill',
      'date',
      'total',
      'tel',
      'phone',
      'spent',
      'paid',
      'at',
      'rs',
      'inr',
    ];
    if (!noise.some((n) => merchant.toLowerCase().includes(n)) && merchant.length > 3) {
      return merchant;
    }
  }

  return '';
}

function parseDateFromText(text: string, referenceDate = new Date()): Date {
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (!match) continue;

    const parsed = new Date(match[1]);
    if (Number.isFinite(parsed.getTime())) {
      const diffYears = Math.abs(parsed.getFullYear() - referenceDate.getFullYear());
      if (diffYears <= 10) return parsed;
    }
  }

  return referenceDate;
}

function categorizeTransaction(merchant: string, text: string): string {
  const haystack = `${merchant} ${text}`.toLowerCase();
  const match = categoryRules.find((rule) =>
    rule.keywords.some((keyword) => haystack.includes(keyword)),
  );
  return match?.category ?? 'Other';
}

function detectTypeFromText(text: string): 'expense' | 'income' {
  const lower = text.toLowerCase();
  if (incomeKeywords.some((keyword) => lower.includes(keyword))) {
    return 'income';
  }
  return 'expense';
}

export function parseTextToTransaction(
  text: string,
  source: 'sms' | 'image' | 'pdf',
): ParsedTransaction {
  if (source === 'sms') {
    const smsResult = parseSmsExpense(text);
    return {
      amount: smsResult.amount,
      merchant: smsResult.merchant,
      date: smsResult.date,
      type: 'expense',
      category: smsResult.category,
      rawText: text,
      source: 'sms',
      confidence: smsResult.status === 'parsed' ? 'high' : 'medium',
      missingFields: smsResult.missingFields,
    };
  }

  const amount = parseAmountFromText(text);
  const merchant = parseMerchantFromText(text);
  const date = parseDateFromText(text);
  const category = categorizeTransaction(merchant, text);
  const type = detectTypeFromText(text);

  const missingFields: string[] = [];
  if (amount <= 0) missingFields.push('amount');
  if (!merchant) missingFields.push('merchant');

  const confidence = amount > 0 && merchant ? 'high' : amount > 0 || merchant ? 'medium' : 'low';

  return {
    amount,
    merchant,
    date,
    type,
    category,
    rawText: text,
    source,
    confidence,
    missingFields,
  };
}

export function parseQuickCapture(input: string, now = new Date()): QuickParseResult {
  try {
    const lower = input.toLowerCase();
    let amount: number | undefined;
    let type: 'expense' | 'income' = 'expense';
    let category = 'Uncategorized';
    let dueDate: string | undefined;

    const amountMatch = input.match(
      /(?:[\u20B9\u0024\u20AC\u00A3\u00A5]|rs\.?|inr)\s*([\d,]+(?:\.\d{1,2})?)|([\d,]+(?:\.\d{1,2})?)\s*(?:[\u20B9\u0024\u20AC\u00A3\u00A5]|rs\.?|inr)|(?:\b|^)([\d,]+(?:\.\d{1,2})?)(?:\b|$)/i,
    );
    if (amountMatch) {
      const amountStr = amountMatch[1] || amountMatch[2] || amountMatch[3];
      const parsed = Number.parseFloat(amountStr.replace(/,/g, ''));
      if (Number.isFinite(parsed) && parsed > 0) {
        amount = dollarsToCentsSafe(parsed);
      }
    }

    if (incomeKeywords.some((keyword) => lower.includes(keyword))) {
      type = 'income';
    }

    for (const [mappedCategory, keywords] of Object.entries(categoriesMap)) {
      if (keywords.some((keyword) => lower.includes(keyword))) {
        category = mappedCategory;
        break;
      }
    }

    if (lower.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = toLocalDateString(tomorrow);
    } else if (lower.includes('today')) {
      dueDate = toLocalDateString(now);
    } else {
      const dayMatch = lower.match(/on\s+(\d+)(?:st|nd|rd|th)?/i);
      if (dayMatch) {
        const day = parseInt(dayMatch[1], 10);
        const targetDate = new Date(now);
        if (day >= 1 && day <= 31) {
          if (day < targetDate.getDate()) {
            targetDate.setMonth(targetDate.getMonth() + 1);
          }
          targetDate.setDate(day);
          dueDate = toLocalDateString(targetDate);
        }
      }
    }

    const merchant = parseMerchantFromText(input);
    const cleanTitle = stripAmounts(input)
      .replace(/\b(tomorrow|today)\b/gi, '')
      .replace(/\bon\s+\d+(?:st|nd|rd|th)?\b/gi, '')
      .replace(new RegExp(`\\b(${incomeKeywords.join('|')})\\b`, 'gi'), '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      title: merchant || cleanTitle || input.trim() || 'Untitled Entry',
      merchant,
      amount,
      type,
      category,
      dueDate,
      note: input.length > 200 ? `${input.slice(0, 200).trim()}...` : input.trim(),
    };
  } catch {
    return {
      title: input.trim() || 'Untitled Entry',
      type: 'expense',
      category: 'Uncategorized',
    };
  }
}

export function parseQuickFinance(input: string, now = new Date()): QuickFinanceParseResult {
  const quick = parseQuickCapture(input, now);
  return {
    amountDollars: quick.amount ? quick.amount / 100 : 0,
    type: quick.type,
    category: quick.category,
    date: quick.dueDate,
    note: quick.note,
    merchant: quick.merchant,
  };
}

export function normalizeParseResult(result: ParseResult): ParseResult {
  const transactions = result.transactions.filter((transaction) => {
    return Number.isFinite(transaction.amount) && transaction.amount >= 0;
  });

  return {
    transactions,
    errors: [...result.errors],
  };
}
