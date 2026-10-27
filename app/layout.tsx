import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RigPicker - Recomendador de PC con TOPSIS",
  description: "Encuentra la mejor configuración de PC según tus necesidades.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="es">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header persistente en todas las páginas */}
      <Header />

      {/* El contenido de cada página (app/page.tsx, app/wizard/page.tsx, etc.) se renderiza aquí */}
      <main className="flex-1">{children}</main>

      {/* Footer persistente en todas las páginas */}
      <Footer />
      </body>
      </html>
  );
}