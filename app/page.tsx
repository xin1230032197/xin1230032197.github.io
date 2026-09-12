import { Hero } from "@/components/Hero";
import { Library } from "@/components/Library";
import { StatusBar } from "@/components/StatusBar";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden">
      <Hero />
      <Library />
      <StatusBar />
    </main>
  );
}
