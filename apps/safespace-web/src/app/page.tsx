"use client";

import { animateTextChange } from "@/utils/encryption";
import { useEffect, useState } from "react";

export default function Home() {
  const originalText = "lorem ipsum dolor sit amet consectetur";
  const [text, setText] = useState("");

  useEffect(() => {
    animateTextChange(setText, originalText, true);
  }, []);

  return (
    <div className="h-screen w-screen flex items-center flex-col justify-center">
      <p
        onMouseOver={() => {
          animateTextChange(setText, originalText, false);
        }}
        onMouseOut={() => {
          animateTextChange(setText, originalText, true);
        }}
      >
        {text}
      </p>
    </div>
  );
}
