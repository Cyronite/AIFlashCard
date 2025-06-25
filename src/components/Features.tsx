export default function Features() {
    return (
        <section id="features" className="w-full max-w-5xl mx-auto py-20 px-4 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2d3142] mb-8 text-center font-serif">Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                <div className="bg-[#f5efe6] border border-[#e0d9c7] rounded-2xl p-8 flex flex-col items-center shadow-sm">
                    <span className="text-4xl mb-4">⚡</span>
                    <h3 className="text-xl font-bold mb-2 text-[#2d3142] text-center font-serif">Instant AI Generation</h3>
                    <p className="text-[#4f5d75] text-center">Create flash cards for any topic in seconds using advanced AI—no manual entry required.</p>
                </div>
                <div className="bg-[#f5efe6] border border-[#e0d9c7] rounded-2xl p-8 flex flex-col items-center shadow-sm">
                    <span className="text-4xl mb-4">🎯</span>
                    <h3 className="text-xl font-bold mb-2 text-[#2d3142] text-center font-serif">Smart Review</h3>
                    <p className="text-[#4f5d75] text-center">Focus on what you need to learn most with spaced repetition and intelligent reminders.</p>
                </div>
                <div className="bg-[#f5efe6] border border-[#e0d9c7] rounded-2xl p-8 flex flex-col items-center shadow-sm">
                    <span className="text-4xl mb-4">🧘‍♂️</span>
                    <h3 className="text-xl font-bold mb-2 text-[#2d3142] text-center font-serif">Minimal & Distraction-Free</h3>
                    <p className="text-[#4f5d75] text-center">Enjoy a clean, elegant interface designed for focus and ease of use on any device.</p>
                </div>
            </div>
        </section>
    );
}
