"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { safeWebUrl, whatsappUrl } from "@/lib/links";

type Destination = "whatsapp" | "portfolio" | "instagram";

const pendingContent: Record<Destination, { title: string; text: string }> = {
  portfolio: {
    title: "Estou organizando meu portfólio.",
    text: "Enquanto separo os projetos para mostrar aqui, me conta o que você quer criar.",
  },
  instagram: {
    title: "Meu Instagram ainda não está por aqui.",
    text: "Por enquanto, você pode me chamar no WhatsApp.",
  },
  whatsapp: {
    title: "Meu WhatsApp ainda não está disponível.",
    text: "Volte daqui a pouco para falar comigo.",
  },
};

export function ActionLink({
  destination,
  children,
  variant = "primary",
  className = "",
}: {
  destination: Destination;
  children: ReactNode;
  variant?: "primary" | "secondary" | "text" | "social";
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const whatsapp = whatsappUrl(siteConfig.whatsapp.number, siteConfig.whatsapp.message);
  const href = destination === "whatsapp"
    ? whatsapp
    : safeWebUrl(destination === "portfolio" ? siteConfig.portfolioUrl : siteConfig.instagramUrl);
  const content = pendingContent[destination];

  function move(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 5;
    event.currentTarget.style.setProperty("--magnetic-x", `${x}px`);
    event.currentTarget.style.setProperty("--magnetic-y", `${y}px`);
  }

  function reset(event: PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--magnetic-x", "0px");
    event.currentTarget.style.setProperty("--magnetic-y", "0px");
  }

  const contents = <span>{children}</span>;
  const classes = `action action-${variant} ${className}`;

  if (href) {
    return <a href={href} className={classes} target="_blank" rel="noopener noreferrer" onPointerMove={move} onPointerLeave={reset}>{contents}</a>;
  }

  return (
    <>
      <button ref={trigger} type="button" className={classes} aria-haspopup="dialog" onClick={() => dialog.current?.showModal()} onPointerMove={move} onPointerLeave={reset}>
        {contents}
      </button>
      <dialog ref={dialog} className="pending-dialog" aria-label={content.title} onClose={() => trigger.current?.focus()} onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }} onClick={(event) => {
        if (event.target === event.currentTarget) {
          const rect = event.currentTarget.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.current?.close();
        }
      }}>
        <div className="dialog-top"><span className="eyebrow">{siteConfig.brand}<span className="orange">.</span></span><button type="button" className="icon-button" aria-label="Fechar" onClick={() => dialog.current?.close()} autoFocus><X size={20} /></button></div>
        <h2>{content.title}</h2>
        <p>{content.text}</p>
        {whatsapp && <a className="action action-primary" href={whatsapp} target="_blank" rel="noopener noreferrer"><span>Conversar com a Sued</span></a>}
      </dialog>
    </>
  );
}
