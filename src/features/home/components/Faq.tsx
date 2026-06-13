import { translations as t } from "@/lib/i18n";
import { SectionHeader, useTr } from "@/components/site/SiteShell";
import { Reveal } from "@/components/site/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Faq() {
  const { tr } = useTr();

  return (
    <section id="faq" className="relative py-20 scroll-mt-24">
      <div className="container mx-auto px-5">
        <Reveal>
          <SectionHeader title={tr(t.home.faq.title)} subtitle={tr(t.home.faq.subtitle)} />
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-3">
              {t.home.faq.items.map((item, i) => (
                <AccordionItem
                  key={i}
                  value={`item-${i}`}
                  className="glass rounded-2xl border border-border px-5"
                >
                  <AccordionTrigger className="text-start text-sm md:text-base font-semibold hover:no-underline">
                    {tr(item.q)}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                    {tr(item.a)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
