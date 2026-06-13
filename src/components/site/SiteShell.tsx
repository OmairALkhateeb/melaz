import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { MessageCircle, Menu, X, Instagram } from "lucide-react";
import logo from "@/assets/logo.png";
import { translations as t, links, type Lang } from "@/lib/i18n";
import { useLang } from "@/lib/useLang";

type NavItem = { to: string; hash?: string; label: { ar: string; en: string } };

const navItems: NavItem[] = [
  { to: "/", label: t.nav.home },
  { to: "/cars", label: t.cars.title },
  { to: "/", hash: "services", label: t.nav.about },
  { to: "/", hash: "how", label: t.nav.how },
  { to: "/", hash: "contact", label: t.nav.contact },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useLang();
  const tr = (k: { ar: string; en: string }) => k[lang];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const renderNavLink = (n: NavItem, onClick?: () => void) => {
    const className = "text-sm text-muted-foreground hover:text-foreground transition-colors relative group";
    const inner = (
      <>
        {tr(n.label)}
        <span className="absolute -bottom-1 left-0 w-0 group-hover:w-full h-px bg-primary transition-all duration-300" />
      </>
    );
    if (n.hash) {
      return (
        <a key={`${n.to}#${n.hash}`} href={`/#${n.hash}`} onClick={onClick} className={className}>
          {inner}
        </a>
      );
    }
    return (
      <Link key={n.to} to={n.to} onClick={onClick} className={className} activeOptions={{ exact: true }}>
        {inner}
      </Link>
    );
  };

  return (
    <div className="relative min-h-screen text-foreground overflow-x-hidden">
      {/* ANIMATED BACKGROUND */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden pointer-events-none site-bg">
        <div className="absolute inset-0 bg-base" />
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-mesh-anim mix-blend-screen opacity-90" />
        <div className="absolute -top-40 -left-40 w-[620px] h-[620px] rounded-full blob-electric blur-[150px] animate-blob-1" />
        <div className="absolute top-1/3 -right-48 w-[720px] h-[720px] rounded-full blob-deep blur-[170px] animate-blob-2" />
        <div className="absolute bottom-[-12%] left-1/4 w-[680px] h-[680px] rounded-full blob-violet blur-[160px] animate-blob-3" />
        <div className="absolute inset-0 bg-conic-slow opacity-[0.18] mix-blend-screen" />
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="absolute inset-0 bg-noise opacity-[0.04] mix-blend-overlay" />
        <div className="absolute inset-0 bg-vignette" />
      </div>


      {/* HEADER */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 backdrop-blur-xl bg-background/70 border-b border-border" : "py-5"
        }`}
      >
        <div className="container mx-auto px-5 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center group">
            <span className="font-display text-base sm:text-lg tracking-[0.3em] text-foreground font-bold">
              AL MELAZ
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((n) => renderNavLink(n))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="px-3 py-1.5 rounded-full text-xs font-medium border border-border hover:border-primary hover:text-primary transition-all"
              aria-label="Toggle language"
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-primary-foreground bg-[var(--gradient-purple)] hover:opacity-90 transition-all glow-soft"
            >
              <MessageCircle className="w-4 h-4" />
              {tr(t.nav.whatsapp)}
            </a>
            <button onClick={() => setMenuOpen((v) => !v)} className="lg:hidden p-2 text-foreground" aria-label="Menu">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden mt-3 mx-5 rounded-2xl glass p-4 flex flex-col gap-3">
            {navItems.map((n) => renderNavLink(n, () => setMenuOpen(false)))}
          </div>
        )}
      </header>

      {children}

      {/* FOOTER */}
      <footer className="relative border-t border-border mt-10 py-12">
        <div className="container mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={logo} alt="AL MELAZ" className="h-10 w-10 object-contain" />
            <div className="text-sm">
              <div className="font-display tracking-[0.2em] text-foreground">AL MELAZ MOTORS</div>
              <div className="text-xs text-muted-foreground">{tr(t.footer.tag)}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href={links.igOffice} target="_blank" rel="noreferrer" className="p-2.5 rounded-full glass hover:border-primary transition-colors" aria-label="Instagram office">
              <Instagram className="w-4 h-4 text-primary-glow" />
            </a>
            <a href={links.igOwner} target="_blank" rel="noreferrer" className="p-2.5 rounded-full glass hover:border-primary transition-colors" aria-label="Instagram owner">
              <Instagram className="w-4 h-4 text-primary-glow" />
            </a>
            <a href={links.whatsapp} target="_blank" rel="noreferrer" className="p-2.5 rounded-full glass hover:border-primary transition-colors" aria-label="WhatsApp">
              <MessageCircle className="w-4 h-4 text-primary-glow" />
            </a>
          </div>
          <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} AL MELAZ MOTORS. {tr(t.footer.rights)}.</div>
        </div>
      </footer>
    </div>
  );
}

export function SectionHeader({
  title,
  subtitle,
  titleId,
}: {
  title: string;
  subtitle: string;
  titleId?: string;
}) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <h2 id={titleId} className="text-3xl md:text-5xl font-bold text-gradient">
        {title}
      </h2>
      <p className="mt-3 text-muted-foreground">{subtitle}</p>
      <div className="mx-auto mt-5 w-20 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
    </div>
  );
}

export function useTr(): { lang: Lang; tr: (k: { ar: string; en: string }) => string } {
  const [lang] = useLang();
  return { lang, tr: (k) => k[lang] };
}
