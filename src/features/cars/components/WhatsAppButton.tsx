import { MessageCircle } from "lucide-react";
import { translations as t } from "@/lib/i18n";
import { useTr } from "@/components/site/SiteShell";
import { buildCarWhatsAppUrl } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  carTitle: string;
  carUrl?: string;
  whatsappNumber?: string | null;
  className?: string;
  size?: "default" | "lg";
  /** primary = gradient CTA; outline = glass card style */
  variant?: "primary" | "outline";
  label?: string;
};

export function WhatsAppButton({
  carTitle,
  carUrl,
  whatsappNumber,
  className,
  size = "default",
  variant = "primary",
  label,
}: WhatsAppButtonProps) {
  const { lang, tr } = useTr();

  const href = buildCarWhatsAppUrl({
    carTitle,
    carUrl,
    lang,
    whatsappNumber,
  });

  const displayLabel =
    label ?? (variant === "outline" ? tr(t.cars.whatsapp) : tr(t.cars.detail.contactWhatsApp));

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-2.5 rounded-full font-medium transition-all",
        variant === "primary" && [
          "text-primary-foreground bg-[var(--gradient-purple)] hover:scale-[1.02] glow",
          size === "lg" ? "px-8 py-4 text-base w-full sm:w-auto" : "px-5 py-2.5 text-sm",
        ],
        variant === "outline" && ["glass hover:border-primary text-sm px-4 py-2.5 flex-1"],
        className,
      )}
    >
      <MessageCircle
        className={cn(
          variant === "outline"
            ? "w-4 h-4 text-primary-glow"
            : size === "lg"
              ? "w-5 h-5"
              : "w-4 h-4",
        )}
      />
      {displayLabel}
    </a>
  );
}
