import { useState, useRef } from 'react';
import { X, Copy, Share2, CheckCircle2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Button } from '@/shared/ui';
import { buildUpiLink } from '@/utils/upi';
import { formatMoney, useSettings } from '@/core/settings';

interface QRScreenProps { open: boolean; onOpenChange: (open: boolean) => void; upiId: string; payeeName: string; amount: number; note?: string; onSettled?: () => void; }

export function QRScreen({ open, onOpenChange, upiId, payeeName, amount, note, onSettled }: QRScreenProps) {
  const { currency } = useSettings();
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const qrRef = useRef<HTMLCanvasElement>(null);

  if (!open) return null;

  const upiLink = buildUpiLink(upiId, payeeName, amount / 100, note);

  const handleCopyUpi = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy UPI ID', err);
    }
  };

  const handleShare = async () => {
    if (!qrRef.current) return;
    setIsSharing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const gradient = ctx.createRadialGradient(canvas.width / 2, 0, 100, canvas.width / 2, 0, 800);
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.15)');
      gradient.addColorStop(1, 'rgba(9, 9, 11, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('TITAN', canvas.width / 2, 120);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '500 40px Inter, sans-serif';
      ctx.fillText(`Paying ${payeeName}`, canvas.width / 2, 280);
      ctx.fillStyle = '#38bdf8';
      ctx.font = '900 110px Inter, sans-serif';
      ctx.fillText(formatMoney(amount, currency), canvas.width / 2, 400);
      const qrSize = 600;
      const qrX = (canvas.width - qrSize) / 2;
      const qrY = 500;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(qrX - 40, qrY - 40, qrSize + 80, qrSize + 80, 40);
      ctx.fill();
      ctx.drawImage(qrRef.current, qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = '#a1a1aa';
      ctx.font = '600 36px Inter, sans-serif';
      ctx.fillText(upiId, canvas.width / 2, qrY + qrSize + 100);
      if (note) {
        ctx.font = 'italic 32px Inter, sans-serif';
        ctx.fillStyle = '#71717a';
        ctx.fillText(`"${note}"`, canvas.width / 2, qrY + qrSize + 160);
      }
      const blob = await new Promise<Blob | null>((resolve) => { canvas.toBlob(resolve, 'image/png'); });
      if (!blob) throw new Error('Failed to generate image');
      const file = new File([blob], `titan-payment-${payeeName.replace(/\s+/g, '-').toLowerCase()}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ title: `Payment to ${payeeName}`, text: `Pay ${formatMoney(amount, currency)} via UPI${note ? ` for ${note}` : ''}`, files: [file] });
      } else {
        await navigator.clipboard.writeText(upiLink);
        alert('Payment link copied. Share API not supported on this device.');
      }
    } catch (err) {
      console.error('Error sharing QR', err);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/80 px-4 py-4 backdrop-blur-md sm:items-center">
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-[2.5rem] border border-border bg-card shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between border-b border-border/50 bg-secondary/20 px-8 py-5">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">UPI Payment</p><h3 className="text-lg font-bold tracking-tight">Scan to Pay</h3></div>
          <button type="button" onClick={() => onOpenChange(false)} className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary transition-colors"><X className="h-5 w-5 text-muted-foreground" /></button>
        </div>
        <div className="flex flex-col items-center px-8 py-8 space-y-6">
          <div className="text-center space-y-1"><p className="text-sm font-medium text-muted-foreground">Paying {payeeName}</p><p className="text-4xl font-black tracking-tighter text-primary">{formatMoney(amount, currency)}</p></div>
          <div className="rounded-3xl bg-white p-6 shadow-sm border-4 border-secondary/20">
            <QRCodeCanvas ref={qrRef} value={upiLink} size={240} level="H" includeMargin={false} imageSettings={{ src: '/icons/titan-logo.png', height: 56, width: 56, excavate: true }} />
          </div>
          <div className="flex items-center justify-center gap-2 rounded-xl bg-secondary/30 px-4 py-2 border border-border/50 w-full">
            <span className="text-sm font-semibold truncate max-w-[200px]">{upiId}</span>
            <button type="button" onClick={() => void handleCopyUpi()} className="ml-auto text-primary hover:text-primary/80 transition-colors" title="Copy UPI ID">{copied ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> : <Copy className="h-5 w-5" />}</button>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-border/50 bg-secondary/10 px-8 py-6">
          <Button onClick={() => void handleShare()} disabled={isSharing} className="w-full gap-2 rounded-full py-6"><Share2 className="h-5 w-5" />{isSharing ? 'Sharing...' : 'Share QR'}</Button>
          {onSettled && (<Button variant="outline" onClick={onSettled} className="w-full rounded-full border-primary/20 hover:bg-primary/5 text-primary">Mark as Settled</Button>)}
        </div>
      </div>
    </div>
  );
}
