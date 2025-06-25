export default function Footer() {
    return (
        <footer className="w-full bg-[#f5efe6] border-t border-[#e0d9c7] py-8 flex flex-col items-center mt-12">
            <div className="text-[#4f5d75] text-sm mb-2">&copy; {new Date().getFullYear()} AI Flash Card. All rights reserved.</div>
            <div className="flex gap-4 text-[#4f5d75] text-xs">
                <a href="#features" className="hover:text-[#2d3142] transition">Features</a>
                <a href="#about" className="hover:text-[#2d3142] transition">About</a>
                <a href="#contact" className="hover:text-[#2d3142] transition">Contact</a>
            </div>
        </footer>
    );
}
