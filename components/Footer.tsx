export default function Footer() {
    const CURRENT_YEAR = 2026;

    return (
        <footer className="border-t border-slate-800 py-8 text-center text-xs text-slate-500">
            <p>© {CURRENT_YEAR} PC Builder Assistant - Creado con Next.js</p>
        </footer>
    );
}