import { AlertCircle } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  message?: string;
  onRetry: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { tr } = useTr();

  return (
    <div className="glass rounded-2xl p-10 md:p-14 text-center max-w-xl mx-auto" role="alert">
      <div className="mx-auto w-16 h-16 rounded-2xl bg-destructive/15 border border-destructive/30 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="mt-6 text-xl font-bold text-foreground">{tr(t.cars.error.title)}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {message ?? tr(t.cars.error.desc)}
      </p>
      <Button
        onClick={onRetry}
        className="mt-8 rounded-full px-8 bg-[var(--gradient-purple)] hover:opacity-90 glow-soft border-0"
      >
        {tr(t.cars.error.retry)}
      </Button>
    </div>
  );
}
