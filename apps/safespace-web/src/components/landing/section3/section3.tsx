import { cn } from "@ui/lib/utils";

const items = [
  { className: "violet-gradient-text", text: "Web" },
  { className: "orange-gradient-text", text: "Extension" },
  { className: "green-gradient-text", text: "Server" },
];

const Section3 = () => {
  return (
    <div className="safe-paddings pt-10 pb-24 lg:pt-40 md:pt-32">
      <div className="container">
        <h2 className="heading-2xl md:heading-6xl flat-none lg:flat-breaks">
          A completely transparent and secure ecosystem of tools to help you
          browse the internet without worrying about your personal or data
          privacy.
        </h2>

        <section className="flex flex-col md:flex-row md:items-center gap-10 mt-14">
          {items.map(({ className, text }, index) => (
            <div
              className="flex flex-col items-center border-[3px] border-black p-4"
              key={index}
            >
              <span className="text-2xl font-semibold">SafeSpace</span>
              <span className={cn(className, "text-4xl font-semibold mt-2")}>
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
