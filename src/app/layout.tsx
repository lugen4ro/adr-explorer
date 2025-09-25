// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from "@mantine/core";
import { Navigation } from "@/components/Navigation";
import { Sidebar } from "@/components/Sidebar";
import { getAllADRs } from "@/lib/staticGeneration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ADR Explorer",
  description: "Explore and understand architectural decision records",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { directory } = await getAllADRs();

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineProvider>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navigation directory={directory} />
            <div>
              <Sidebar directory={directory}>{children}</Sidebar>
            </div>
          </div>
        </MantineProvider>
      </body>
    </html>
  );
}
