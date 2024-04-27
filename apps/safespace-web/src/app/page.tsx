"use client";

import Footer from "@/components/footer/footer";
import LandingPage from "@/components/landing";

export default function Home() {
  return (
    <div className="h-screen overflow-y-auto">
      <LandingPage />
      <Footer />
    </div>
  );
}
