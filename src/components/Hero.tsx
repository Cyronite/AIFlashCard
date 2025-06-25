import React from 'react';
import '../App.css';

export default function Hero() {
    return (
        <section className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#f5efe6] to-[#e9e4d8] relative">
            <h1 className="text-[#2d3142] text-5xl md:text-6xl font-extrabold mb-6 text-center font-serif tracking-tight drop-shadow">Master Anything with AI Flash Cards</h1>
            <p className="text-[#4f5d75] text-lg md:text-2xl mb-8 text-center max-w-2xl font-medium">
                Instantly generate, study, and review smart flash cards powered by AI. Boost your learning, ace your exams, and never forget what matters most.
            </p>
            <div className="flex flex-col md:flex-row gap-4 mb-10">
                <button className="bg-[#2d3142] text-[#f5efe6] px-8 py-3 rounded-full text-lg font-bold hover:bg-[#4f5d75] transition shadow">Get Started</button>
                <a href="#features" className="bg-[#f5efe6] border border-[#2d3142] text-[#2d3142] px-8 py-3 rounded-full text-lg font-bold hover:bg-[#e9e4d8] transition flex items-center justify-center">Learn More</a>
            </div>
            {/* Go down symbol */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce cursor-pointer">
                <svg width="32" height="32" fill="none" stroke="#2d3142" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                <span className="text-xs text-[#2d3142] mt-1 opacity-60">Scroll</span>
            </div>
        </section>
    );
}
