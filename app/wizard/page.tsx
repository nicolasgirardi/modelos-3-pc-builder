"use client"
import React, { useState } from 'react';
import {
    Gamepad2,
    Video,
    Code2,
    Briefcase,
    Sparkles,
    Monitor,
    DollarSign,
    Palette,
    Volume2,
    ShieldCheck,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Layers
} from 'lucide-react';

interface Answers {
    useCase: string;
    secondaryUses: string[];
    resolution: string;
    budgetPriority: string;
    storage: string
    aestheticsAndNoise: string;
    futureProof: boolean;
}

export default function WizardPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 5;

    // Estado para guardar las respuestas seleccionadas con tipado explícito
    const [answers, setAnswers] = useState<Answers>({
        useCase: 'gaming',          // Paso 1: Uso principal
        secondaryUses: [],          // Paso 2: Usos secundarios
        resolution: '1440p',        // Paso 3: Resolución / Exigencia
        storage: 'high',
        budgetPriority: 'balanced', // Paso 4: Prioridad de presupuesto
        aestheticsAndNoise: 'balanced', // Paso 5: Ruido y estética
        futureProof: true            // Paso 5: Capacidad de actualización
    });

    // Función genérica para que acepte tanto string, string[] como boolean según la clave
    const handleSelect = <K extends keyof Answers>(key: K, value: Answers[K]) => {
        setAnswers((prev) => ({ ...prev, [key]: value }));
    };

    const handleToggleSecondaryUse = (useId: string) => {
        setAnswers((prev) => {
            const current = prev.secondaryUses || [];
            const updated = current.includes(useId)
                ? current.filter((id) => id !== useId)
                : [...current, useId];
            return { ...prev, secondaryUses: updated };
        });
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased flex items-center justify-center p-4">
            {/* Background Decorativo */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 max-w-2xl w-full bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-2xl">

                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white via-slate-200 to-purple-300 bg-clip-text text-transparent">
                        Configurador de Preferencias
                    </h1>
                    <p className="text-slate-400 text-xs sm:text-sm mt-1">
                        Responde estas preguntas para determinar el perfil de tu PC ideal.
                    </p>
                </div>

                {/* Wizard Steps Navigation */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                    {[
                        { num: 1, title: 'Uso Principal' },
                        { num: 2, title: 'Secundarios' },
                        { num: 3, title: 'Imagen' },
                        { num: 4, title: 'Presupuesto' },
                        { num: 5, title: 'Preferencias' },
                    ].map((step) => (
                        <div
                            key={step.num}
                            onClick={() => setCurrentStep(step.num)}
                            className="flex items-center cursor-pointer"
                        >
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                                currentStep === step.num
                                    ? 'bg-gradient-to-tr from-purple-600 to-cyan-500 text-white shadow-lg shadow-purple-500/25 scale-105'
                                    : currentStep > step.num
                                        ? 'bg-slate-800 text-cyan-400 border border-cyan-500/30'
                                        : 'bg-slate-800/60 text-slate-500 border border-slate-700/50'
                            }`}>
                                {currentStep > step.num ? <CheckCircle2 className="w-4 h-4" /> : step.num}
                            </div>
                            <span className={`ml-2 text-xs font-medium hidden sm:inline transition-colors ${
                                currentStep === step.num ? 'text-white' : 'text-slate-400'
                            }`}>
                {step.title}
              </span>
                            {step.num < totalSteps && (
                                <div className="w-4 sm:w-8 h-0.5 bg-slate-800 mx-2 hidden xs:block" />
                            )}
                        </div>
                    ))}
                </div>

                {/* PASO 1: USO PRINCIPAL */}
                {currentStep === 1 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Gamepad2 className="w-5 h-5 text-purple-400" />
                                1. ¿Cuál será el uso principal de la computadora?
                            </h2>
                            <p className="text-slate-400 text-xs mt-1">Selecciona la actividad a la que dedicarás la mayor parte del tiempo.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { id: 'gaming', title: 'Gaming / Esports', desc: 'Juegos de alta tasa de refresco, AAA y deportes electrónicos', icon: Gamepad2 },
                                { id: 'editing', title: 'Edición de Video & 3D', desc: 'Renderizado, modelado 3D, animación y producción audiovisual', icon: Video },
                                { id: 'dev', title: 'Programación & Ciencia de Datos', desc: 'Compilación de código, máquinas virtuales y desarrollo', icon: Code2 },
                                { id: 'office', title: 'Uso General / Oficina', desc: 'Navegación, documentos, llamadas y multitarea ligera', icon: Briefcase },
                                { id: 'streaming', title: 'Streaming / Creación de Contenido', desc: 'Transmisión en vivo mientras juegas o trabajas', icon: Sparkles }
                            ].map((item) => {
                                const IconComponent = item.icon;
                                const isSelected = answers.useCase === item.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleSelect('useCase', item.id)}
                                        className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                                            isSelected
                                                ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500'
                                                : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-700/50 text-slate-300'}`}>
                                                <IconComponent className="w-4 h-4" />
                                            </div>
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-100 text-sm">{item.title}</p>
                                            <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* PASO 2: USOS SECUNDARIOS */}
                {currentStep === 2 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Layers className="w-5 h-5 text-purple-400" />
                                2. ¿Cuáles son los usos secundarios de la PC?
                            </h2>
                            <p className="text-slate-400 text-xs mt-1">Selecciona otras actividades secundarias. Puedes elegir varias o ninguna.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { id: 'gaming', title: 'Gaming / Video Juegos', desc: 'Video juegos de cualquier tipo, nuevos o retro, AAA o indies', icon: Gamepad2 },
                                { id: 'editing', title: 'Edición de Video & 3D', desc: 'Renderizado, modelado 3D, animación y producción audiovisual', icon: Video },
                                { id: 'dev', title: 'Programación & Ciencia de Datos', desc: 'Compilación de código, máquinas virtuales y desarrollo', icon: Code2 },
                                { id: 'office', title: 'Uso General / Oficina', desc: 'Navegación, documentos, llamadas y multitarea ligera', icon: Briefcase },
                                { id: 'streaming', title: 'Streaming / Creación de Contenido', desc: 'Transmisión en vivo mientras juegas o trabajas', icon: Sparkles }
                            ]
                                .filter((item) => item.id !== answers.useCase) // Ocultar el seleccionado como principal
                                .map((item) => {
                                    const IconComponent = item.icon;
                                    const isSelected = answers.secondaryUses.includes(item.id);
                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleToggleSecondaryUse(item.id)}
                                            className={`text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                                                isSelected
                                                    ? 'bg-purple-950/40 border-purple-500 ring-1 ring-purple-500'
                                                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-purple-600 text-white' : 'bg-slate-700/50 text-slate-300'}`}>
                                                    <IconComponent className="w-4 h-4" />
                                                </div>
                                                {isSelected && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-100 text-sm">{item.title}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                        </div>

                        <button
                            type="button"
                            onClick={() => handleSelect('secondaryUses', [])}
                            className={`w-full py-2.5 px-4 rounded-xl border text-xs font-semibold transition-all ${
                                answers.secondaryUses.length === 0
                                    ? 'bg-purple-950/40 border-purple-500 text-purple-300'
                                    : 'bg-slate-800/30 border-slate-700/50 text-slate-400 hover:bg-slate-800'
                            }`}
                        >
                            Ninguna / Uso exclusivo principal
                        </button>
                    </div>
                )}

                {/* PASO 3: RESOLUCIÓN / IMAGEN */}
                {currentStep === 3 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Monitor className="w-5 h-5 text-cyan-400" />
                                3. ¿A qué nivel de resolución apuntas?
                            </h2>
                            <p className="text-slate-400 text-xs mt-1">Determina la exigencia visual y gráfica requerida.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[
                                { id: '1080p', label: '1080p (Full HD)', desc: 'Considerado el standard actual. Si no sabe que elegir, elija esta' },
                                { id: '1440p', label: '1440p (Quad HD)', desc: 'El punto de equilibrio perfecto entre calidad visual y rendimiento' },
                                { id: '4k', label: '4K Ultra HD', desc: 'Máxima calidad gráfica y fidelidad visual, muy demandante sobre el equipo' },
                            ].map((res) => {
                                const isSelected = answers.resolution === res.id;
                                return (
                                    <button
                                        key={res.id}
                                        type="button"
                                        onClick={() => handleSelect('resolution', res.id)}
                                        className={`text-left p-4 rounded-xl border transition-all ${
                                            isSelected
                                                ? 'bg-cyan-950/40 border-cyan-500 ring-1 ring-cyan-500'
                                                : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-semibold text-sm text-slate-100">{res.label}</span>
                                            {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{res.desc}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* PASO 4: PRESUPUESTO Y PRIORIDAD */}
                {currentStep === 4 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-400" />
                                4. ¿Cuál es tu enfoque respecto al presupuesto?
                            </h2>
                            <p className="text-slate-400 text-xs mt-1">Indica la prioridad económica para equilibrar el costo y la potencia.</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { id: 'budget', name: 'Económico / Ajustado', desc: 'Buscar la mejor relación costo-beneficio sin gastar en extras innecesarios.' },
                                { id: 'balanced', name: 'Equilibrado', desc: 'Invertir en buenos componentes equilibrando costo y alto rendimiento.' },
                                { id: 'performance', name: 'Máximo Rendimiento', desc: 'Priorizar el máximo rendimiento posible sin restricciones severas de presupuesto.' }
                            ].map((p) => {
                                const isSelected = answers.budgetPriority === p.id;
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => handleSelect('budgetPriority', p.id)}
                                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start justify-between ${
                                            isSelected
                                                ? 'bg-emerald-950/30 border-emerald-500 ring-1 ring-emerald-500'
                                                : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-100 text-sm">{p.name}</p>
                                            <p className="text-xs text-slate-400 mt-1">{p.desc}</p>
                                        </div>
                                        {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 ml-2" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* PASO 5: ESTÉTICA Y RUIDO */}
                {currentStep === 5 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Palette className="w-5 h-5 text-pink-400" />
                                5. Estética, Ruido y Durabilidad
                            </h2>
                            <p className="text-slate-400 text-xs mt-1">Ajustes finales sobre apariencia y longevidad del equipo.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                                    ¿Qué estilo prefieres para el gabinete y ventilación?
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {[
                                        { id: 'stealth', label: 'Silencioso / Minimalista', icon: Volume2 },
                                        { id: 'balanced', label: 'Estándar / Balanceado', icon: ShieldCheck },
                                        { id: 'rgb-show', label: 'Iluminación RGB / Gamer', icon: Sparkles }
                                    ].map((item) => {
                                        const IconComponent = item.icon;
                                        const isSelected = answers.aestheticsAndNoise === item.id;
                                        return (
                                            <button
                                                key={item.id}
                                                type="button"
                                                onClick={() => handleSelect('aestheticsAndNoise', item.id)}
                                                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                                                    isSelected
                                                        ? 'bg-pink-950/30 border-pink-500 text-pink-300'
                                                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                                                }`}
                                            >
                                                <IconComponent className="w-4 h-4" />
                                                <span className="text-xs font-medium">{item.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-slate-200">Priorizar posibilidad de actualización futura</p>
                                    <p className="text-xs text-slate-400">Seleccionar tarjetas madres y fuentes de poder con margen para upgrades.</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={answers.futureProof}
                                    onChange={(e) => handleSelect('futureProof', e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-purple-600 focus:ring-purple-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* NAVEGACIÓN Y BOTONES */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
                    <button
                        type="button"
                        onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                        disabled={currentStep === 1}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                            currentStep === 1
                                ? 'opacity-40 cursor-not-allowed text-slate-500'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                    </button>

                    {currentStep < totalSteps ? (
                        <button
                            type="button"
                            onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-all hover:scale-[1.02]"
                        >
                            Siguiente
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={() => console.log('Respuestas finales del usuario:', answers)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                        >
                            Guardar Respuestas
                        </button>
                    )}
                </div>

            </div>
        </div>
    );
}