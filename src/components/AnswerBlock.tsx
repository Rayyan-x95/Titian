import { type ReactNode } from 'react';

interface AnswerBlockProps {
  question: string;
  answer: string | ReactNode;
  className?: string;
}

export function AnswerBlock({ question, answer, className = '' }: AnswerBlockProps) {
  return (
    <section className={`answer-block rounded-2xl border border-primary/20 bg-primary/5 p-8 transition-all hover:border-primary/40 ${className}`}>
      <h2 className="mb-4 text-xl font-bold text-foreground sm:text-2xl">{question}</h2>
      <div className="text-base leading-relaxed text-muted-foreground sm:text-lg">
        {typeof answer === 'string' ? <p>{answer}</p> : answer}
      </div>
    </section>
  );
}
