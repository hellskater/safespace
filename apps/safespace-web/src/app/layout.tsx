import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "@repo/ui/globals.css";
import "../styles/main.css";
import PangeaAuthProvider from "@/components/providers/auth-provider";
import Header from "@/components/header";
import { cn } from "@ui/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SafeSpace: A Secure Ecosystem of Tools for Privacy",
  description:
    "SafeSpace is a completely transparent and secure ecosystem of tools to help you browse the internet without worrying about your personal or data privacy. SafeSpace offers a web extension, server, and editor to ensure your online safety.",
  keywords: [
    "code snippets",
    "snippet manager",
    "code management",
    "programming efficiency",
    "developer tools",
    "coding productivity",
    "code organization",
    "GitHub gists",
    "private repos",
    "VS Code extensions",
    "browser extension for developers",
    "code reuse",
    "coding shortcuts",
    "coding collaboration",
    "code versioning",
    "GitHub Apps",
    "GitHub OAuth",
    "developer workflow",
    "coding workflow",
    "integrated development environment",
    "code bookmarking",
  ],
  authors: [
    {
      name: "K Srinivas Rao",
      url: "https://twitter.com/Srinu53168",
    },
  ],
  creator: "K Srinivas Rao",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://safespace-web.vercel.app/",
    title: "SafeSpace: A Secure Ecosystem of Tools for Privacy",
    description:
      "SafeSpace is a completely transparent and secure ecosystem of tools to help you browse the internet without worrying about your personal or data privacy. SafeSpace offers a web extension, server, and editor to ensure your online safety.",
    siteName: "SafeSpace",
  },
  twitter: {
    card: "summary_large_image",
    title: "SafeSpace: A Secure Ecosystem of Tools for Privacy",
    description:
      "SafeSpace is a completely transparent and secure ecosystem of tools to help you browse the internet without worrying about your personal or data privacy. SafeSpace offers a web extension, server, and editor to ensure your online safety.",
    creator: "@Srinu53168",
  },
  metadataBase: new URL("https://safespace-web.vercel.app"),
  icons: {
    icon: "favicon.ico",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          poppins.className,
          "relative h-screen overflow-hidden w-screen",
        )}
      >
        <PangeaAuthProvider>
          <>
            <Header />
            {children}
            {/* <Footer /> */}
          </>
        </PangeaAuthProvider>
      </body>
    </html>
  );
}
