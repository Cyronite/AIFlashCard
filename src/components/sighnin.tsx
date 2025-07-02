import Nav from "./Nav";

export default function SignIn({ onSignUp, onNavigate, setEmail}: { onSignUp: () => void; onNavigate: (hash?: string) => void; setEmail:React.Dispatch<React.SetStateAction<string>>}) {
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        const response = await fetch("http://localhost:3000/api/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password }),
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log("Sign In successful:", data);
            setEmail(email as string);
            // Handle successful sign-in (e.g., redirect to dashboard)
        }else if (response.status === 401) {
            alert("Invalid email or password. Please try again.");
        }
    
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Nav onSignIn={() => {}} onSignUp={onSignUp} onNavigate={(e?: React.MouseEvent<HTMLAnchorElement>) => {
                const hash = e?.currentTarget?.getAttribute('href') || undefined;
                if (window.location.hash !== (hash || '')) {
                    window.location.hash = '';
                    setTimeout(() => onNavigate(hash), 0);
                } else {
                    onNavigate(hash);
                }
            }} />
            <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#f5efe6] to-[#e9e4d8] px-4">
                <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 w-full max-w-md flex flex-col items-center border border-[#e0d9c7]">
                    <h2 className="text-3xl font-extrabold text-[#2d3142] mb-6 font-serif">Sign In</h2>
                    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                        <input type="email" name="email" placeholder="Email" className="border border-[#e0d9c7] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142]" />
                        <input type="password" name="password" placeholder="Password" className="border border-[#e0d9c7] rounded-lg px-4 py-3 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142]" />
                        <button type="submit" className="bg-[#2d3142] text-[#f5efe6] px-6 py-3 rounded-full font-bold hover:bg-[#4f5d75] transition shadow mt-2">Sign In</button>
                    </form>
                    <div className="mt-6 text-sm text-[#4f5d75]">
                        Don't have an account? <button type="button" className="text-[#2d3142] font-bold hover:underline" onClick={onSignUp}>Sign Up</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
