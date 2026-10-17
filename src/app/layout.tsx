import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { siteConfig } from "@/config/site";
import { safeWebUrl } from "@/lib/links";
import { DEFAULT_THEME, themeBootstrap } from "@/lib/theme";
import { IntroSignature, MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const publicUrl = safeWebUrl(siteConfig.siteUrl);

export const metadata: Metadata = {
  ...(publicUrl ? { metadataBase: new URL(publicUrl), alternates: { canonical: publicUrl } } : {}),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: siteConfig.brand,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.brand,
    locale: "pt_BR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
  icons: { icon: "/icon.svg", apple: "/apple-icon" },
};

export const viewport: Viewport = { colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={GeistSans.variable} data-theme={DEFAULT_THEME} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        <noscript><style>{".theme-switch { display: none; }"}</style></noscript>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <MotionProvider><IntroSignature />{children}</MotionProvider>
      </body>
    </html>
  );
}
