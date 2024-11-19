import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fill in the blanks",
  description: "An exploration of LLMs as software components",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <head>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>{`${metadata.title}`}</title>
            <meta name="description" content={`${metadata.description}`}/>
            <link
                rel="icon"
                // based on https://thenounproject.com/browse/icons/term/square-brackets/
                href="/brackets.png"
            />
        </head>
        <body>
        {children}
        </body>
    </html>
  );
}
