"use client";

import { useCallback, useState } from "react";
import { Camera, Heart } from "lucide-react";
import { siteConfig } from "@/config/site";
import { BrandSymbol } from "./brand";
import { ParticleName } from "./particle-name";

export function Portrait() {
  const [failed, setFailed] = useState(false);
  const hasPhoto = Boolean(siteConfig.photo.src) && !failed;
  const checkPhoto = useCallback((image: HTMLImageElement | null) => {
    // O erro pode ocorrer antes de o React conectar o evento onError.
    if (image?.complete && image.naturalWidth === 0) setFailed(true);
  }, []);

  return (
    <div className="portrait-composition">
      <figure className={`portrait${hasPhoto ? " has-photo" : ""}`}>
        <div className="portrait-halo" aria-hidden="true" />
        <span className="portrait-sticker" aria-hidden="true">vamos criar<br />algo seu?<Heart size={17} strokeWidth={1.7} /></span>
        <div className="portrait-media">
          {hasPhoto ? (
            // A foto original é preservada; o recorte e a máscara são apenas visuais.
            // eslint-disable-next-line @next/next/no-img-element
            <img ref={checkPhoto} src={siteConfig.photo.src} alt={siteConfig.photo.alt} width={1090} height={1600} style={{ objectPosition: siteConfig.photo.position }} fetchPriority="high" onError={() => setFailed(true)} />
          ) : (
            <div className="portrait-art" role="img" aria-label="Espaço reservado para a foto de Sued, com composição gráfica da marca">
              <svg className="portrait-flower" viewBox="0 0 240 260" aria-hidden="true"><path d="M122 22C168-19 185 32 180 54C235 37 251 90 217 111C262 146 228 185 199 185C213 237 162 257 137 229C101 276 57 245 63 213C8 231-13 174 25 151C-18 115 11 66 48 76C35 26 88-1 108 29Z" fill="currentColor" /></svg>
              <span className="portrait-monogram" aria-hidden="true">S<span>.</span></span>
              <span className="photo-placeholder-tag"><Camera size={12} aria-hidden="true" />sua foto aqui</span>
            </div>
          )}
        </div>
        <figcaption className="portrait-caption">
          <span className="caption-intro">oi, eu sou a</span><ParticleName name={siteConfig.name} /><span className="caption-role">Eu crio sites.</span>
        </figcaption>
        <BrandSymbol className="portrait-doodle" />
      </figure>
    </div>
  );
}
