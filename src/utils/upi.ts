export function buildUpiLink(upiId: string, name: string, amount?: number, note?: string): string {
  const params = new URLSearchParams({
    pa: upiId,
    pn: name || 'Titan User',
  });

  if (amount !== undefined && amount > 0) {
    // Format to 2 decimal places as UPI apps expect e.g., 500.00
    params.append('am', amount.toFixed(2));
  }

  if (note) {
    params.append('tn', note.substring(0, 50)); // UPI limit for notes is typically 50 chars
  }

  return `upi://pay?${params.toString()}`;
}

export function validateUpiId(upiId: string): boolean {
  if (!upiId) return false;
  if (upiId.includes(' ')) return false;

  const parts = upiId.split('@');
  if (parts.length !== 2) return false;
  if (parts[0].length === 0 || parts[1].length === 0) return false;

  return true;
}
