"use client";

import LandingPage from "@/components/landing";
import { animateTextChange } from "@/utils/encryption";
import { useEffect, useState } from "react";

export default function Home() {
  const originalText = "lorem ipsum dolor sit amet consectetur";
  const [text, setText] = useState("");

  useEffect(() => {
    animateTextChange(setText, originalText, true);
  }, []);

  return (
    <div className="text-white">
      {/* <p
        onMouseOver={() => {
          animateTextChange(setText, originalText, false);
        }}
        onMouseOut={() => {
          animateTextChange(setText, originalText, true);
        }}
      >
        {text}
      </p> */}
      <LandingPage />
    </div>
  );
}
