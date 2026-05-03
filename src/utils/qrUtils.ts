import { toDataURL } from 'qrcode';

export async function generateShareableQR(
  upiUrl: string,
  amount: number,
  note?: string,
): Promise<string> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = 1080;
  canvas.height = 1920;

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#020617');
  grad.addColorStop(1, '#0f172a');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Decorative blobs
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = '#3b82f6';
  ctx.beginPath();
  ctx.arc(0, 0, 600, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#8b5cf6';
  ctx.beginPath();
  ctx.arc(canvas.width, canvas.height, 800, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Header Title
  ctx.fillStyle = 'white';
  ctx.font = '900 120px Inter, system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('TITAN', canvas.width / 2, 300);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 48px Inter, system-ui';
  ctx.letterSpacing = '12px';
  ctx.fillText('FINANCIAL ECOSYSTEM', canvas.width / 2, 380);

  // QR Code Area
  const qrSize = 700;
  const qrX = (canvas.width - qrSize) / 2;
  const qrY = 550;

  // White background for QR
  ctx.fillStyle = 'white';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 100;
  ctx.beginPath();
  ctx.roundRect(qrX - 40, qrY - 40, qrSize + 80, qrSize + 80, 80);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Generate QR
  const qrDataUrl = await toDataURL(upiUrl, {
    margin: 1,
    width: qrSize,
    color: { dark: '#020617', light: '#ffffff' },
  });

  const qrImg = new Image();
  qrImg.decoding = 'async';
  qrImg.src = qrDataUrl;
  await new Promise<void>((resolve, reject) => {
    qrImg.onload = () => resolve();
    qrImg.onerror = () => reject(new Error('Failed to load generated QR image.'));
  });
  ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

  // Add Logo in Middle of QR
  const logoSize = 140;
  const logoX = canvas.width / 2 - logoSize / 2;
  const logoY = qrY + qrSize / 2 - logoSize / 2;
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.roundRect(logoX - 10, logoY - 10, logoSize + 20, logoSize + 20, 30);
  ctx.fill();

  const logoImg = new Image();
  logoImg.src = '/icons/falcon.png'; // Updated from titan-logo.png
  await new Promise((resolve) => {
    logoImg.onload = resolve;
    logoImg.onerror = resolve; // Continue if logo fails
  });
  if (logoImg.complete && logoImg.naturalWidth > 0) {
    ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
  }

  // Amount Section
  ctx.fillStyle = 'white';
  ctx.font = '900 160px Inter, system-ui';
  ctx.fillText(`₹${(amount / 100).toLocaleString()}`, canvas.width / 2, 1450);

  if (note) {
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 48px Inter, system-ui';
    ctx.fillText(note, canvas.width / 2, 1550);
  }

  // Footer
  ctx.fillStyle = '#3b82f6';
  ctx.font = '700 40px Inter, system-ui';
  ctx.fillText('SECURE UPI PAYMENT', canvas.width / 2, 1750);

  return canvas.toDataURL('image/png');
}
