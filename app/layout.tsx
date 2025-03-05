import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "My Next.js Project",
  description: "내 개인 니즈에 맞춘 Next.js 프로젝트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
