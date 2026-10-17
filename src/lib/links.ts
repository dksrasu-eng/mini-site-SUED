export function safeWebUrl(value: string): string | null {
  if (!value.trim()) return null;
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

export function whatsappUrl(number: string, message: string): string | null {
  const digits = number.replace(/\D/g, "");
  if (!/^\d{10,15}$/.test(digits)) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export type VideoSource =
  | { kind: "embed"; src: string }
  | { kind: "file"; src: string }
  | { kind: "missing" }
  | { kind: "invalid" };

/** Normalize only supported hosts. Never insert arbitrary iframe HTML. */
export function resolveVideo(value: string): VideoSource {
  if (!value.trim()) return { kind: "missing" };
  if (/^\/(?!\/).+\.(?:mp4|webm)(?:\?.*)?$/i.test(value)) {
    return { kind: "file", src: value };
  }
  const safe = safeWebUrl(value);
  if (!safe) return { kind: "invalid" };
  const url = new URL(safe);
  const host = url.hostname.replace(/^www\./, "");
  if (["youtube.com", "m.youtube.com", "youtube-nocookie.com", "youtu.be"].includes(host)) {
    const id = host === "youtu.be"
      ? url.pathname.split("/")[1]
      : url.searchParams.get("v") || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    if (!id || !/^[\w-]{11}$/.test(id)) return { kind: "invalid" };
    return { kind: "embed", src: `https://www.youtube-nocookie.com/embed/${id}?rel=0` };
  }
  if (["vimeo.com", "player.vimeo.com"].includes(host)) {
    const match = url.pathname.match(/^\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?\/?$/);
    if (!match) return { kind: "invalid" };
    const privacy = match[2] || url.searchParams.get("h");
    const suffix = privacy ? `?h=${encodeURIComponent(privacy)}` : "";
    return { kind: "embed", src: `https://player.vimeo.com/video/${match[1]}${suffix}` };
  }
  if (/\.(?:mp4|webm)$/i.test(url.pathname)) return { kind: "file", src: url.href };
  return { kind: "invalid" };
}
