import logo from '../assets/logo.png';
import { useState } from 'react';

export default function Nav() {
    const [menuOpen, setMenuOpen] = useState(false);
    return (
        <nav className="w-full h-20 flex justify-center items-center bg-gradient-to-b from-[#f5efe6] to-[#e9e4d8] shadow-md fixed top-0 left-0 z-50 border-b border-[#e0d9c7]">
            <div className="max-w-[1420px] w-full flex flex-row justify-between items-center px-4 md:px-8">
                {/* Left: Logo and Title */}
                <div className="flex items-center h-12">
                    <img src={logo} alt="logo" className="h-10 w-10 rounded-lg shadow-sm mr-3" />
                    <h1 className="text-[#2d3142] text-2xl font-bold tracking-wide font-serif">AI Flash Card</h1>
                </div>
                {/* Center: Navigation Links (hidden on mobile) */}
                <div className="hidden md:flex gap-8">
                    <a href="#home" className="text-[#4f5d75] hover:text-[#2d3142] transition font-medium">Home</a>
                    <a href="#features" className="text-[#4f5d75] hover:text-[#2d3142] transition font-medium">Features</a>
                    <a href="#about" className="text-[#4f5d75] hover:text-[#2d3142] transition font-medium">About</a>
                    <a href="#faq" className="text-[#4f5d75] hover:text-[#2d3142] transition font-medium">FAQ</a>
                    <a href="#contact" className="text-[#4f5d75] hover:text-[#2d3142] transition font-medium">Contact</a>
                </div>
                {/* Right: Auth Buttons (hidden on mobile) */}
                <div className="hidden md:flex gap-3 h-10">
                    <button className="bg-[#2d3142] text-[#f5efe6] px-4 py-2 rounded-full hover:bg-[#4f5d75] transition font-bold shadow">Sign In</button>
                    <button className="bg-[#f5efe6] border border-[#2d3142] text-[#2d3142] px-4 py-2 rounded-full hover:bg-[#e9e4d8] transition font-bold shadow">Sign Up</button>
                </div>
                {/* Hamburger menu for mobile */}
                <button className="md:hidden flex flex-col justify-center items-center w-10 h-10" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open menu">
                    <span className={`block w-6 h-0.5 bg-[#2d3142] mb-1 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-[#2d3142] mb-1 transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
                    <span className={`block w-6 h-0.5 bg-[#2d3142] transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                </button>
                {/* Mobile menu overlay */}
                {menuOpen && (
                    <div className="fixed inset-0 bg-[#2d3142] bg-opacity-95 flex flex-col items-center justify-center gap-8 md:hidden z-50 animate-fade-in">
                        <a href="#home" className="text-[#f5efe6] text-xl font-bold" onClick={() => setMenuOpen(false)}>Home</a>
                        <a href="#features" className="text-[#f5efe6] text-xl font-bold" onClick={() => setMenuOpen(false)}>Features</a>
                        <a href="#about" className="text-[#f5efe6] text-xl font-bold" onClick={() => setMenuOpen(false)}>About</a>
                        <a href="#faq" className="text-[#f5efe6] text-xl font-bold" onClick={() => setMenuOpen(false)}>FAQ</a>
                        <a href="#contact" className="text-[#f5efe6] text-xl font-bold" onClick={() => setMenuOpen(false)}>Contact</a>
                        <button className="bg-[#f5efe6] text-[#2d3142] px-6 py-2 rounded-full font-bold w-40" onClick={() => setMenuOpen(false)}>Sign In</button>
                        <button className="bg-[#2d3142] border border-[#f5efe6] text-[#f5efe6] px-6 py-2 rounded-full font-bold w-40" onClick={() => setMenuOpen(false)}>Sign Up</button>
                    </div>
                )}
            </div>
        </nav>
    );
}