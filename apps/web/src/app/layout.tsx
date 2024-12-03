import { ThemeProvider } from "@/components/provider/theme-provider";
import { Toaster } from "@/components/ui/toaster";

import { cn } from "@/lib/utils";


import NextTopLoader from "nextjs-toploader";

import { Inter } from "next/font/google";
import "../../globals.css";


const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: {
//     default: siteConfig.name,
//     template: `%s - ${siteConfig.name}`,
//   },
//   metadataBase: new URL(siteConfig.url),
//   description: siteConfig.description,
//   keywords: [
//     "Next.js",
//     "React",
//     "Tailwind CSS",
//     "Server Components",
//     "Radix UI",
//   ],
//   authors: [
//     {
//       name: "yamato",
//       url: "https://casiry.com",
//     },
//   ],
//   creator: "yamato",
//   openGraph: {
//     type: "website",
//     locale: "en_US",
//     url: siteConfig.url,
//     title: siteConfig.name,
//     description: siteConfig.description,
//     siteName: siteConfig.name,
//     images: [
//       {
//         url: siteConfig.ogImage,
//         width: 1200,
//         height: 630,
//         alt: siteConfig.name,
//       },
//     ],
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: siteConfig.name,
//     description: siteConfig.description,
//     images: [siteConfig.ogImage],
//     creator: "@shadcn",
//   },
//   icons: {
//     icon: "/apps/web/src/app/[lang]/icon.ico",
//   },
// };

export default async function RootLayout({
  children,
  
}: {
  children: React.ReactNode;
  
}) {
  return (
    <html lang="jp" suppressHydrationWarning>
      <head>
        {/* <Suspense>
          <GoogleAnalytics />
        </Suspense> */}
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
        
            <div className="h-full">{children}</div>
        
        </ThemeProvider>
        <Toaster />
      </body>
      {/* <GoogleAdsense /> */}
    </html>
  );
}
