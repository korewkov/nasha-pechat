import type { Metadata } from "next";
import "@fontsource/unbounded/400.css";
import "@fontsource/unbounded/700.css";
import "@fontsource/unbounded/900.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Наша печать — домашняя полиграфия",
  description:
    "Раскраски по фото, фото на документы, визитки, открытки и макеты. Рассчитайте стоимость печати и оставьте заявку онлайн.",
  openGraph: {
    title: "Наша печать — домашняя полиграфия",
    description:
      "Печатаем красиво. Делаем с душой. Рассчитайте стоимость печати и оставьте заявку онлайн.",
    images: ["/brand/brand-system-1.png"],
    type: "website"
  },
  icons: {
    icon: "/brand/logos/logo-mark-1.svg",
    shortcut: "/brand/logos/logo-mark-1.svg",
    apple: "/brand/logos/logo-mark-1.png"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
