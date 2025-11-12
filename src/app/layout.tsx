import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import PrefetchRoutes from "@/components/PrefetchRoutes";
import { ThemeProvider } from "@/components/ThemeProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Software Engineer Growth Community",
  description: "Komunitas Para Software Engineer Tumbuh Bareng",
  metadataBase: new URL("https://swegrowth.id"),
  openGraph: {
    title: "Software Engineer Growth Community",
    description: "Komunitas Para Software Engineer Tumbuh Bareng - Platform untuk belajar, berbagi, dan tumbuh bersama",
    url: "https://swegrowth.id",
    siteName: "SWE Growth Community",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software Engineer Growth Community",
    description: "Komunitas Para Software Engineer Tumbuh Bareng - Platform untuk belajar, berbagi, dan tumbuh bersama",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorReporter />
          <PrefetchRoutes />
          <Script
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
            strategy="afterInteractive"
            data-target-origin="*"
            data-message-type="ROUTE_CHANGE"
            data-include-search-params="true"
            data-only-in-iframe="true"
            data-debug="true"
            data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
          />
          {children}
          <VisualEditsMessenger />
        </ThemeProvider>
      </body>
    </html>
  );
}
