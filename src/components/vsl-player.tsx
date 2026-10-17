"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { siteConfig } from "@/config/site";
import { resolveVideo } from "@/lib/links";
import { Brand, BrandSymbol } from "./brand";

export function VslPlayer() {
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState(false);
  const [posterFailed, setPosterFailed] = useState(false);
  const source = resolveVideo(siteConfig.video.url);
  const playable = source.kind === "embed" || source.kind === "file";

  return (
    <div className="vsl-shell">
      <div className="vsl-player">
        {started && playable && !error ? (
          source.kind === "file" ? (
            <video controls playsInline autoPlay preload="metadata" poster={siteConfig.video.poster || undefined} onError={() => setError(true)} aria-label={siteConfig.video.title}>
              <source src={source.src} type={/\.webm(?:\?|$)/i.test(source.src) ? "video/webm" : "video/mp4"} />
              {siteConfig.video.captionsUrl && <track kind="captions" src={siteConfig.video.captionsUrl} srcLang="pt-BR" label="Português" default />}
              Seu navegador não conseguiu carregar o vídeo.
            </video>
          ) : (
            <iframe src={source.src} title={siteConfig.video.title} allow="encrypted-media; fullscreen; picture-in-picture" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
          )
        ) : (
          <>
            <div className="vsl-art" aria-hidden="true">
              {siteConfig.video.poster && !posterFailed ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={siteConfig.video.poster} alt="" width={1280} height={720} loading="lazy" onError={() => setPosterFailed(true)} />
              ) : <BrandSymbol className="vsl-star" />}
            </div>
            {(!siteConfig.video.poster || posterFailed) && <div className="vsl-topline"><Brand small /><span>UM POUCO DO QUE EU FAÇO</span></div>}
            {notice || error ? (
              <div className="vsl-notice" role="status">
                <strong>{error ? "Não foi possível carregar o vídeo." : source.kind === "invalid" ? "Vídeo indisponível no momento." : "Ainda estou preparando esse vídeo."}</strong>
                <span>{error ? "Você pode tentar novamente." : "Me chama para falar sobre sua ideia."}</span>
                <button type="button" className="video-back" onClick={() => { setNotice(false); setStarted(false); setError(false); }}>Voltar</button>
              </div>
            ) : (
              <button type="button" className="play-button" aria-label={playable ? "Assistir à apresentação da Sued" : "Ver disponibilidade da apresentação"} onClick={() => playable ? setStarted(true) : setNotice(true)}>
                <Play size={23} fill="currentColor" strokeWidth={1} aria-hidden="true" />
              </button>
            )}
            {(!siteConfig.video.poster || posterFailed) && <div className="vsl-bottomline"><span>{playable ? "APERTE O PLAY. CONHEÇA A SUED." : "VÍDEO EM BREVE"}</span></div>}
          </>
        )}
      </div>
    </div>
  );
}
