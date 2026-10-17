import { Camera, LayoutTemplate, MessageCircle } from "lucide-react";
import { ActionLink } from "@/components/action-link";
import { Brand, BrandSymbol } from "@/components/brand";
import { Reveal } from "@/components/motion-provider";
import { Portrait } from "@/components/portrait";
import { VslPlayer } from "@/components/vsl-player";
import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="site-wrap" id="inicio">
      <header className="site-header container">
        <div className="header-identity">
          <a href="#inicio" className="home-link" aria-label={`${siteConfig.brand}, início`}><Brand /></a>
          <div className="availability"><span className={`status-dot${siteConfig.available ? "" : " status-busy"}`} aria-hidden="true" /><span>{siteConfig.available ? "Disponível para novos projetos" : "Agenda de projetos fechada"}</span></div>
        </div>
        <span className="header-caption">sua ideia pode começar por aqui.</span>
        <ThemeSwitch />
      </header>

      <main id="conteudo" className="container bio-stage" tabIndex={-1}>
          <Reveal className="bio-intro">
            <div className="eyebrow hero-eyebrow">SITES FEITOS PARA O SEU NEGÓCIO</div>
            <Reveal delay={0.06}><h1 id="hero-heading">{siteConfig.headline.opening} <span>{siteConfig.headline.highlight}</span></h1></Reveal>
            <Reveal delay={0.12}><p className="hero-description">{siteConfig.description}</p></Reveal>
            <div className="intro-signet" aria-hidden="true"><BrandSymbol /><span>Você me conta o que precisa.<br />Eu te ajudo a pensar no site.</span></div>
          </Reveal>
          <div className="bio-card">
            <Reveal className="bio-profile" delay={0.08}><Portrait /></Reveal>
            <Reveal className="bio-links" delay={0.12}>
              <p className="links-caption">Tem uma ideia em mente?</p>
              <nav className="hero-actions" aria-label="Links da Sued" id="links">
                <ActionLink destination="whatsapp"><span className="action-label"><MessageCircle size={20} strokeWidth={1.7} aria-hidden="true" />Vamos criar seu site</span></ActionLink>
                <ActionLink destination="portfolio" variant="secondary"><span className="action-label"><LayoutTemplate size={19} strokeWidth={1.5} aria-hidden="true" />Ver portfólio</span></ActionLink>
              </nav>
            </Reveal>
            <Reveal className="bio-video" delay={0.16}>
              <section id="apresentacao" aria-labelledby="presentation-heading">
                <div className="video-section-title">MEU TRABALHO</div>
                <h2 id="presentation-heading">{siteConfig.video.heading}</h2>
                <VslPlayer />
                <ActionLink destination="whatsapp" variant="text">Me conta sua ideia</ActionLink>
              </section>
            </Reveal>
            <div className="bio-panel-footer"><span>Feito por mim<span className="orange">.</span></span><ActionLink destination="instagram" variant="social"><Camera size={15} strokeWidth={1.5} aria-hidden="true" /><span>Instagram</span></ActionLink></div>
          </div>
      </main>

      <footer className="site-footer container">
        <span>© {new Date().getFullYear()} {siteConfig.brand}<span className="orange">.</span></span><p>Sites com a sua cara.</p><a href="#inicio" aria-label="Voltar ao início">Voltar ao topo</a>
      </footer>
    </div>
  );
}
