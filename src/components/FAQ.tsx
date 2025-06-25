export default function FAQ() {
    return(
    <div className="w-full max-w-5xl mx-auto py-20 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl mb-16 bg-[#f5efe6] border border-[#e0d9c7] rounded-2xl p-12 shadow-sm">
        <h3 className="text-3xl md:text-4xl font-extrabold text-[#2d3142] mb-8 text-center font-serif">FAQ</h3>
        <ul className="space-y-10">
            <li>
                <p className="font-semibold text-[#2d3142] text-lg md:text-xl mb-2">Is AI Flash Card free to use?</p>
                <p className="text-[#4f5d75] text-base md:text-lg">Yes! You can generate and study flash cards for free, no sign up required.</p>
            </li>
            <li>
                <p className="font-semibold text-[#2d3142] text-lg md:text-xl mb-2">Do I need to create an account?</p>
                <p className="text-[#4f5d75] text-base md:text-lg">No account is needed. Just enter your topic and start learning instantly.</p>
            </li>
            <li>
                <p className="font-semibold text-[#2d3142] text-lg md:text-xl mb-2">How does the AI generate flash cards?</p>
                <p className="text-[#4f5d75] text-base md:text-lg">Our AI analyzes your topic or notes and creates smart, relevant flash cards to help you study efficiently.</p>
            </li>
            <li>
                <p className="font-semibold text-[#2d3142] text-lg md:text-xl mb-2">Can I use this on my phone?</p>
                <p className="text-[#4f5d75] text-base md:text-lg">Absolutely! The site is fully responsive and works great on all devices.</p>
            </li>
        </ul>
    </div>

    </div>
    );
};