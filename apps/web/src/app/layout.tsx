// app/layout.tsx
import { ThemeProvider } from "@/components/provider/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"
import NextTopLoader from "nextjs-toploader"
import { Inter } from "next/font/google"
import "../../globals.css"
import { Header } from "@/layouts/header"
import { Suspense } from "react"
import GoogleAnalytics from "@/components/GoogleAnalytics/GoogleAnalytics"
import GoogleAdsense from "@/components/GoogleAdsense/GoogleAdsense"
import { Metadata } from "next"


const inter = Inter({ subsets: ["latin"] })

const siteConfig = {
 name: "IDev",
 url: "https://casiry.com",
 description: "Explore the world of AI-generated technology books and resources. Discover innovative insights and expand your knowledge with our curated collection of AI-powered content.",
 ogImage: "/og-image.jpg",
}

export const metadata: Metadata = {
 title: {
   default: "Developer Resources & Technology Books | AI Book Hub",
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
   "Technology Education",
   "Swift Development",
   "TypeScript Guide",
   "iOS Programming",
   "Web Development"
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
   locale: "en_US",
   url: siteConfig.url,
   title: "Developer Resources & Technology Books | AI Book Hub",
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
   title: "Developer Resources & Technology Books",
   description: siteConfig.description,
   images: [siteConfig.ogImage],
   creator: "@yamato",
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
 alternates: {
   canonical: siteConfig.url,
 }
}

export default async function RootLayout({
 children,
}: {
 children: React.ReactNode
}) {
 return (
   <html lang="en" suppressHydrationWarning>
     <head>
       <Suspense>
         <GoogleAnalytics />
       </Suspense>
       {/* Schema.orgのマークアップを追加 */}
       <script
         type="application/ld+json"
         dangerouslySetInnerHTML={{
           __html: JSON.stringify({
             "@context": "https://schema.org",
             "@type": "WebSite",
             "url": "https://casiry.com",
             "name": "IDev",
             "description": "Discover comprehensive AI-generated technology books and programming resources.",
             "potentialAction": {
               "@type": "SearchAction",
               "target": "https://casiry.com/search?q={search_term_string}",
               "query-input": "required name=search_term_string"
             },
             "sameAs": [
               "https://casiry.com/books/swift",
               "https://casiry.com/books/typescript",
             ]
           })
         }}
       />
     </head>
     <body className={cn(inter.className, "flex min-h-screen flex-col")}>
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
       
         <main className="flex-1">
           <div className="h-full">{children}</div>
         </main>
       
       </ThemeProvider>
       <Toaster />
       <GoogleAdsense />
     </body>
   </html>
 )
}