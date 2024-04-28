import { Button } from "@ui/components/ui/button";
import { Github } from "lucide-react";

const Footer = () => (
  <footer className="safe-paddings border-t-2">
    <div className="p-5 flex justify-end pt-20">
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/hellskater/safespace"
      >
        <Button className="flex items-center gap-2 h-12">
          <Github className="w-4 h-4" />
          <p>Star on GitHub</p>
        </Button>
      </a>
    </div>
  </footer>
);

export default Footer;
