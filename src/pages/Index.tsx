import { useState } from "react";
import FanScene from "@/components/FanScene";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const Index = () => {
  const [spinning, setSpinning] = useState(false);
  const [clicks, setClicks] = useState(0);
  const [fakeSpeed, setFakeSpeed] = useState<number[]>([50]); // does absolutely nothing

  const toggleSpin = () => {
    setSpinning((s) => !s);
    setClicks((c) => c + 1);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary/40">
      <section className="container py-16">
        <div className="max-w-4xl mx-auto space-y-8 text-center animate-fade-in">
          <header>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              3D Table Fan Playground
            </h1>
            <p className="mt-3 text-muted-foreground">
              Click the button to start a totally serious cooling simulation.
            </p>
          </header>

          <Card className="backdrop-blur border shadow-sm">
            <CardContent className="p-4 md:p-6">
              <div className="aspect-[16/9] rounded-md overflow-hidden border">
                <FanScene spinning={spinning} />
              </div>
              <div className="mt-6 flex flex-col items-center gap-4">
                <Button size="lg" variant={spinning ? "secondary" : "default"} onClick={toggleSpin} className="hover-scale">
                  {spinning ? "Stop the breeze" : "Start the breeze"}
                </Button>
                {spinning && (
                  <p className="text-sm text-primary animate-fade-in">
                    You&apos;re cooling off pixels 🧊
                  </p>
                )}
                <div className="w-full max-w-sm text-left">
                  <label className="text-sm text-muted-foreground">Fan speed (does nothing)</label>
                  <Slider value={fakeSpeed} onValueChange={setFakeSpeed} className="mt-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          <footer className="text-xs text-muted-foreground">
            Built with React, Tailwind, and a gentle breeze.
          </footer>
        </div>
      </section>
    </main>
  );
};

export default Index;
