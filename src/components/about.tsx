export default function About() {
    return (
        <section id="about" className="w-full max-w-3xl mx-auto py-20 px-4 flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2d3142] mb-6 text-center font-serif">About</h2>
            <p className="text-[#4f5d75] text-lg md:text-xl text-center max-w-2xl mb-6 font-medium">
                <span className="font-bold text-[#2d3142]">AI Flash Card</span> is a modern, minimal web app designed to help you master any subject faster. Instantly generate smart flash cards using advanced AI, and study with a distraction-free interface that keeps you focused on what matters most.
            </p>
            <p className="text-[#4f5d75] text-base text-center max-w-2xl">
                Whether you're a student, professional, or lifelong learner, our mission is to make learning simple, effective, and enjoyable. No sign up required—just enter your topic and start learning!
            </p>
        </section>
    );
}
