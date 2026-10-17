import { siteConfig } from "@/config/site";

export function Brand({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand${small ? " brand-small" : ""}`}>
      {siteConfig.brand}<span className="brand-dot">.</span>
    </span>
  );
}

export function BrandSymbol({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M50 0C53 32 68 47 100 50C68 53 53 68 50 100C47 68 32 53 0 50C32 47 47 32 50 0Z" fill="currentColor" />
    </svg>
  );
}
