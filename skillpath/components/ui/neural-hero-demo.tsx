import React from "react";
import NeuralBackground from "@/components/ui/flow-field-background";
import { ArrowRight, Sparkles } from "lucide-react";

export default function NeuralHeroDemo() {
  return (
    // Container must have a defined height, or use h-screen
    <div className="relative w-full h-screen">
      <NeuralBackground 
            color="#818cf8" // Indigo-400
            trailOpacity={0.1} // Lower = longer trails
            speed={0.8}
        />
        
        {/* Example Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-[10px] font-bold uppercase tracking-widest mb-8">
                <Sparkles className="w-3 h-3" />
                Next Generation Analysis
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mb-8">
                FLOW <br/> STATE
            </h1>
            <p className="text-white/40 max-w-md text-lg mb-12 font-medium">
                Experience the neural flow of your career trajectory with our AI-powered path exploration engine.
            </p>
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-3 hover:scale-105 transition-transform">
                Get Started
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    </div>
  );
}
