import Sidebar from "@/components/app/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "App | SafeSpace",
  description: "SafeSpace App",
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="pt-20 flex justify-between">
      <aside className="border-r w-[5%] pt-5 h-screen">
        <Sidebar />
      </aside>
      <main className="w-full h-screen overflow-hidden">{children}</main>
    </section>
  );
}
