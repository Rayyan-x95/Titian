import { Phone } from 'lucide-react';
import type { OnboardingStepProps } from '../types';

export default function PhoneStep({ profile, onProfileChange }: OnboardingStepProps) {
  return (
    <div className="mx-auto max-w-xl text-center">
      <Phone className="mx-auto h-10 w-10 text-primary" aria-hidden="true" />
      <input
        autoFocus
        type="tel"
        value={profile.phoneNumber || ''}
        onChange={(event) => onProfileChange({ phoneNumber: event.target.value })}
        placeholder="+91 00000 00000"
        className="mt-8 w-full bg-transparent text-center text-4xl font-black tracking-tight text-foreground outline-none placeholder:text-muted-foreground/30 sm:text-6xl"
        autoComplete="tel"
        aria-label="Your phone number"
      />
      <div className="mx-auto mt-5 h-px max-w-sm bg-gradient-to-r from-transparent via-border to-transparent" />
      <p className="mt-4 text-xs font-medium text-muted-foreground">
        Optional. Helps identify friends in splits.
      </p>
      <div className="mt-8 flex flex-col items-center">
        <input
          type="text"
          value={profile.upiId || ''}
          onChange={(event) => {
            const val = event.target.value.toLowerCase().replace(/\s/g, '');
            onProfileChange({ upiId: val });
          }}
          placeholder="yourname@upi"
          className="w-full max-w-[280px] rounded-xl border border-border/50 bg-secondary/30 px-4 py-3 text-center text-lg font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/30 focus:border-primary/50"
          autoComplete="off"
          spellCheck={false}
          aria-label="Your UPI ID"
        />
        <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          UPI ID (required for payments)
        </p>
      </div>
    </div>
  );
}
