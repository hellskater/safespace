import { cn } from "@ui/lib/utils";
import Image from "next/image";

const items = [
  { className: "violet-gradient-text", text: "Web" },
  { className: "orange-gradient-text", text: "Extension" },
  { className: "green-gradient-text", text: "Server" },
];

const Section3 = () => {
  return (
    <div className="safe-paddings pt-10 pb-24">
      <h2 className="container heading-2xl md:heading-6xl flat-none lg:flat-breaks my-20">
        Make use of the{" "}
        <span className="green-gradient-text">full powers of AI</span> without
        leaking your personal information. SafeSpace filters out all the
        personal information from your data using{" "}
        <span className="orange-gradient-text">Pangea Redact</span> before
        sending it to the AI models.
      </h2>
      <div className="relative w-full h-[40rem] mb-28 mt-32">
        <Image
          fill
          src="/images/editor-screenshot.png"
          alt="Editor Screenshot"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="container">
        <h2 className="heading-2xl md:heading-6xl flat-none lg:flat-breaks">
          A completely transparent and secure ecosystem of tools to help you
          browse the internet without worrying about your personal or data
          privacy.
        </h2>

        <section className="flex flex-col md:flex-row md:items-center gap-10 mt-14">
          {items.map(({ className, text }, index) => (
            <div
              className="flex flex-col items-center border-[3px] border-black p-10"
              key={index}
            >
              <span className="text-3xl font-semibold">SafeSpace</span>
              <span className={cn(className, "text-6xl font-semibold mt-2")}>
                {text}
              </span>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default Section3;
