import Link from "next/link";

export default function Home() {
  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">

        {/* Hero Section */}
        <main className="flex-1">
          <section className="max-w-4xl mx-auto px-4 pt-20 pb-16 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              Recomendador Inteligente
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              La mejor PC para tus necesidades,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              calculada con precisión
            </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Sin sesgos ni preferencias de marcas. Responde un breve cuestionario sobre tus prioridades y nuestro algoritmo matemático ordenará las mejores configuraciones según tu presupuesto.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <Link
                  href="/wizard"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Comenzar Selección
              </Link>
            </div>
          </section>

          {/* Sección: ¿Cómo funciona? */}
          <section id="como-funciona" className="max-w-6xl mx-auto px-4 py-16 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-center mb-12 text-white">
              Elige tu Build en 3 pasos
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-lg flex items-center justify-center font-bold">
                  1
                </div>
                <h3 className="font-semibold text-lg text-white">Define tu Perfil</h3>
                <p className="text-slate-400 text-sm">
                  Indica para qué usas la computadora (Gaming 4K, Renderizado, Trabajo de Oficina) y cuál es tu presupuesto límite.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-lg flex items-center justify-center font-bold">
                  2
                </div>
                <h3 className="font-semibold text-lg text-white">Ponderación de Criterios</h3>
                <p className="text-slate-400 text-sm">
                  El sistema asigna automáticamente pesos a cada especificación técnica (VRAM, Núcleos, Frecuencia, Precio y Consumo).
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center font-bold">
                  3
                </div>
                <h3 className="font-semibold text-lg text-white">Ranking TOPSIS</h3>
                <p className="text-slate-400 text-sm">
                  Comparamos la distancia de cada alternativa respecto a la opción ideal matemática para darte una lista ordenada objetiva.
                </p>
              </div>
            </div>
          </section>

          {/* Sección explicativa sobre TOPSIS */}
          <section id="algoritmo" className="max-w-4xl mx-auto px-4 py-16">
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 text-center space-y-4">
              <h3 className="text-xl font-bold text-white">¿Qué es el método TOPSIS?</h3>
              <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
                <strong>TOPSIS</strong> (<em>Technique for Order of Preference by Similarity to Ideal Solution</em>) es un método de toma de decisiones multicriterio. Evalúa todas las combinaciones posibles de componentes y calcula matemáticamente cuál está más cerca de la solución ideal teórica y más alejada de la peor alternativa.
              </p>
            </div>
          </section>
        </main>

      </div>
  );
}