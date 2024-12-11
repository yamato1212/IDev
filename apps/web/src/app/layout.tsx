import { ThemeProvider } from "@/components/provider/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import { cn } from "@/lib/utils";


import NextTopLoader from "nextjs-toploader";

import { Inter } from "next/font/google";
import "../../globals.css";
import { Header } from "@/layouts/header";
import { Suspense } from "react";
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics";
import GoogleAdsense from "@/components/GoogleAdsense/GoogleAdsense";

import { Metadata } from "next";


const inter = Inter({ subsets: ["latin"] });

const siteConfig = {
  name: "AI Book Platform",
  url: "https://casiry.com",
  description: "Explore the world of AI-generated technology books and resources. Discover innovative insights and expand your knowledge with our curated collection of AI-powered content.",
  ogImage: "/og-image.jpg", // Update with your actual OG image path
};

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: [
    "AI Books",
    "Technology",
    "Programming",
    "Artificial Intelligence",
    "Machine Learning",
    "Tech Resources",
    "AI-Generated Content",
    "Digital Learning",
    "Programming Languages",
    "Technology Education"
  ],
  authors: [
    {
      name: "yamato",
      url: "https://casiry.com",
    },
  ],
  creator: "yamato",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: "AI Book Platform Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@yamato", // Update with your Twitter handle
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
    shortcut: "/favicon-16x16.png",
  },
  manifest: "/site.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-site-verification", // Add your Google verification code
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'ja-JP': '/jp',
      'en-US': '/en',
    },
  }
};
export default async function RootLayout({
  children,
  
}: {
  children: React.ReactNode;
  
}) {
  return (
    <html lang="jp" suppressHydrationWarning>
      <head>
        <Suspense>
          <GoogleAnalytics />
        </Suspense>
      </head>
      <body className={cn(inter.className)}>
        <NextTopLoader
          color="#2299DD"
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
        <Header />
            <div className="h-full">{children}</div>
        
        </ThemeProvider>
        <Toaster />
      </body>
      <GoogleAdsense />
    </html>
  );
}
