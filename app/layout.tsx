import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";
import { fontSans } from "@/config/fonts";

export const metadata: Metadata = {
  title: {
    default: "Business API",
    template: "%s - Business API",
  },
  description: "API for managing orders, products, and customers with a modern, responsive interface.",
  icons: {
    icon: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head>
        <link rel="preconnect" href="https://next-business-api.vercel.app" />
        <link rel="preload" as="style" href="https://next-business-api.vercel.app/css/2ce5f8feef3c7648.css" />
        <link rel="preload" as="style" href="https://next-business-api.vercel.app/css/910.css" />
      </head>
      <body
        className={clsx(
          "min-h-screen text-foreground bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <div className="relative flex flex-col h-screen">
            <main className="xl:py-16 xl:px-14 sm:p-10 p-6 flex-grow">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}