import Link from "next/link";

export default function Header() {
    return (
        <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight text-white">
                    <span className="bg-blue-600 text-white px-2 py-1 rounded-md text-sm">PC</span>
                    <span>PC Builder Assistant</span>
                </Link>
            </div>
        </header>
    );
}