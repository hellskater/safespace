import { Button } from "@ui/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

const Footer = () => (
  <footer className="safe-paddings border-t-2">
    <div className="p-5 flex justify-between pt-20">
      <Link
        className="bg-stone-800 px-6 py-2 w-fit h-12 flex justify-center items-center"
        href="/"
      >
        <span className="sr-only">SafeSpace Logo</span>
        <span className="text-white font-mono">SafeSpace</span>
      </Link>

      <Button className="flex items-center gap-2 h-12">
        <Github className="w-4 h-4" />
        <p>Star on GitHub</p>
      </Button>
    </div>
  </footer>
);

export default Footer;
