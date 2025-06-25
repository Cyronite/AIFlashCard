export default function Contact() {
    return (
        <section id="contact" className="w-full max-w-3xl mx-auto py-20 px-4 flex flex-col items-center">
    
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#2d3142] mb-6 text-center font-serif">Contact Us</h2>
            <p className="text-[#4f5d75] text-lg text-center mb-8 max-w-xl font-medium">
                Have questions, feedback, or need support? Reach out and we'll get back to you as soon as possible.
            </p>
            <form className="w-full max-w-md flex flex-col gap-4 bg-[#f5efe6] border border-[#e0d9c7] rounded-2xl p-8 shadow-sm mb-4">
                <input type="text" placeholder="Your Name" className="border border-[#e0d9c7] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2d3142] bg-white" />
                <input type="email" placeholder="Your Email" className="border border-[#e0d9c7] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2d3142] bg-white" />
                <textarea placeholder="Your Message" rows={4} className="border border-[#e0d9c7] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2d3142] bg-white resize-none" />
                <button type="submit" className="bg-[#2d3142] text-[#f5efe6] px-6 py-3 rounded-full font-bold hover:bg-[#4f5d75] transition shadow">Send Message</button>
            </form>
        </section>
    );
}
