import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mad Libs Playground",
  description: "An exploration of LLMs as software components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
