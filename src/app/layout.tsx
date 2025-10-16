// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";
import type { Metadata } from "next";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ColorSchemeScript, mantineHtmlProps } from "@mantine/core";
import { Layout } from "@/components";
import { MantineClientProvider } from "@/components/providers/MantineClientProvider";
import { theme } from "@/lib/theme";
import { FileService } from "@/services/fileService";

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
  const fileService = new FileService("adr");
  const { directory } = await fileService.getAllADRs();

  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MantineClientProvider theme={theme}>
          <Layout directory={directory}>{children}</Layout>
        </MantineClientProvider>
      </body>
    </html>
  );
}
