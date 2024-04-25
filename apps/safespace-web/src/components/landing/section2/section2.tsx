import { cn } from "@ui/lib/utils";
import {
  Fingerprint,
  Key,
  KeyRound,
  PencilRuler,
  ShieldCheck,
} from "lucide-react";

const items = [
  {
    icon: <Key className="w-8 h-8" />,
    text: "A secure encryption key is generated for each user.",
    gradient: "from-cyan-300 to-blue-500",
  },
  {
    icon: <PencilRuler className="w-8 h-8" />,
    text: "A Rich note-taking experience, with a WYSIWYG editor.",
    gradient: "from-yellow-300 to-green-500",
  },
  {
    icon: <Fingerprint className="w-8 h-8" />,
    text: "All notes are encrypted with your unique key before being sent to our servers.",
    gradient: "from-blue-500 to-purple-400",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    text: "You receive encrypted notes from our servers and decrypt them with your key from your device.",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    icon: <KeyRound className="w-8 h-8" />,
    text: "Your key is rotated every few days to ensure your notes are always secure.",
    gradient: "from-pink-500 to-red-400",
  },
];

const Section2 = () => {
  return (
    <div className="safe-paddings pt-48 pb-24 lg:pt-40 md:pt-32">
      <div className="container bg-stone-900 py-20 text-white">
        <h2 className="heading-2xl lg:heading-6xl">
          Get a complete understanding of how your notes get transferred from
          your machine to our servers.
        </h2>
        <section className="flex flex-wrap gap-20 justify-center w-fit mt-20">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center mt-6 max-w-48"
            >
              <div
                className={cn(
                  "flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr",
                  item.gradient,
                )}
              >
                {item.icon}
              </div>
              <p
                className="mt-5 text-center"
                dangerouslySetInnerHTML={{ __html: item.text }}
              />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Section2;
