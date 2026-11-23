"use client";

import React, { useState } from "react";
import {PcBuild} from "@/app/types/quiz";

interface FormData {
    q1: string[];
    q2: string;
    q3: string[]; // Asumimos selección múltiple para tipos de juegos, puedes cambiarlo a string si es única
    q4: string;
    q5: string;
    q6: string;
    q7: string;
    q8: string;
    q9: string;
    q10: string;
    q11: string;
    q12: string;
    qgpu: string;
}

export default function PcBuilderQuiz() {
    const [formData, setFormData] = useState<FormData>({
        q1: [],
        q2: "",
        q3: [],
        q4: "",
        q5: "",
        q6: "",
        q7: "",
        q8: "",
        q9: "",
        q10: "",
        q11: "",
        q12: "",
        qgpu: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState<boolean>(false);
    const [apiResponse, setApiResponse] = useState({})
    const [showResults, setShowResults] = useState<boolean>(false);
    const [showEmail, setShowEmail] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [isSending, setIsSending] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const formatNumberWithDots = (value: string) => {
        const numericValue = value.replace(/\D/g, "");

        if (!numericValue) return "";

        return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };


    // Condiciones de visibilidad
    const showQ2 = formData.q1.includes("A");
    const showQ3AndQ4 = formData.q1.includes("B");
    const showQgpu = formData.q1.includes("D");

    // Manejador para checkboxes (Pregunta 1 y 3)
    const handleCheckboxChange = (question: "q1" | "q3", value: string) => {
        setFormData((prev) => {
            const currentValues = prev[question];
            const updatedValues = currentValues.includes(value)
                ? currentValues.filter((item) => item !== value)
                : [...currentValues, value];

            // Limpiar respuestas condicionales si se desmarcan A o B en Q1
            if (question === "q1") {
                return {
                    ...prev,
                    q1: updatedValues,
                    q2: updatedValues.includes("A") ? prev.q2 : "",
                    q3: updatedValues.includes("B") ? prev.q3 : [],
                    q4: updatedValues.includes("B") ? prev.q4 : "",
                    qgpu: updatedValues.includes("D") ? prev.qgpu : "",
                };
            }

            return { ...prev, [question]: updatedValues };
        });
    };

    // Manejador para radio buttons e inputs de texto/número
    const handleInputChange = (question: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [question]: value }));
    };

    const handleSave = () => {
        setShowEmail(true)
    }

    const handleSendEmail = async () => {
        setIsSending(true);
        setEmailError("");
        setEmailSent(false);

        try {
            const response = await fetch("/api/send-suggestions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    builds: apiResponse,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                setError(errorData?.error || `Error del servidor (${response.status})`);
                setShowError(true);
                return;
            }

            setEmailSent(true);
        } catch (err: any) {
            setEmailError(err.message || "No se pudo enviar el correo.");
            setShowError(true);
        } finally {
            setIsSending(false);
        }
    };

    const handleEmailSubmit = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email.trim() || !emailRegex.test(email)) {
            setEmailError("Por favor, ingresa un correo electrónico válido.");
            return;
        }
        setEmailError("");
        handleSendEmail().then();
    }

    const handleReset = () => {
        setFormData({
            q1: [],
            q2: "",
            q3: [],
            q4: "",
            q5: "",
            q6: "",
            q7: "",
            q8: "",
            q9: "",
            q10: "",
            q11: "",
            q12: "",
            qgpu: "",
        });
        setShowResults(false)
        setApiResponse({});
        setShowEmail(false)
        setError(null);
        setShowError(false);
        setShowResults(false);
    };


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>)=> {
        e.preventDefault();
        setShowResults(false);
        setApiResponse({})
        setIsLoading(true);
        setError(null);
        setShowError(false);

        const numericBudget = Number(formData.q11.replace(/\./g, ""));



        const params = new URLSearchParams();
        if (formData.q1.length > 0) params.append("q1", formData.q1.join(","));
        if (formData.q3.length > 0) params.append("q3", formData.q3.join(","));

        if (formData.q2) params.append("q2", formData.q2);
        if (formData.q4) params.append("q4", formData.q4);
        if (formData.q5) params.append("q5", formData.q5);
        if (formData.q6) params.append("q6", formData.q6);
        if (formData.q7) params.append("q7", formData.q7);
        if (formData.q8) params.append("q8", formData.q8);
        if (formData.q9) params.append("q9", formData.q9);
        if (formData.q10) params.append("q10", formData.q10);
        if (numericBudget) params.append("q11", numericBudget.toString());
        if (formData.q12) params.append("q12", formData.q12);
        if (formData.qgpu) params.append("qgpu", formData.qgpu);

        const url = `/api/optimize?${params.toString()}`;

        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                setError(errorData?.error || `Error del servidor (${response.status})`);
                setShowError(true);
                return; // Corta la ejecución acá (el bloque finally se ejecuta igual)
            }

            const data = await response.json();
            if (!Array.isArray(data) || Array(data).length === 0) {
                setApiResponse([]);
                return;
            }
            setApiResponse(data);
            setShowResults(true)
        } catch (err: unknown) {
            // Este catch ahora solo captura errores reales de red (sin internet, DNS, etc.)
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Error de conexión al consultar la API");
            }
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-md my-10 text-gray-800">
            <h1 className="text-2xl font-bold mb-6 text-gray-900">
                Configurador de PC Ideal
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* PREGUNTA 1 */}
                <div className="space-y-3">
                    <label className="block font-semibold text-lg">
                        1. ¿Qué actividades se van a realizar con la computadora?{" "}
                        <span className="text-sm font-normal text-gray-500">
              (Elegir todas las que correspondan)
            </span>
                    </label>
                    {[
                        { id: "A", label: "Edición de video, imágenes, diseño, modelado en 3D o similar" },
                        { id: "B", label: "Jugar videojuegos" },
                        { id: "C", label: "Live streaming y/o creación de contenido" },
                        { id: "D", label: "Programación" },
                        { id: "E", label: "Ejecutar modelos de IA localmente"},
                        { id: "F", label: "Navegar en internet, leer y escribir correo, ver series, películas o videos" },
                    ].map((option) => (
                        <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.q1.includes(option.id)}
                                onChange={() => handleCheckboxChange("q1", option.id)}
                                className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"
                            />
                            <span>
                <strong>{option.id}-</strong> {option.label}
              </span>
                        </label>
                    ))}
                </div>

                {/* PREGUNTA 2 (Condicional: Solo si Q1 incluye A) */}
                {showQ2 && (
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg space-y-3 transition-all">
                        <label className="block font-semibold text-lg">
                            A-1. Dijo que va a usar la computadora para tareas de edición, ¿con qué nivel y frecuencia va a hacerlas?
                        </label>
                        {[
                            { id: "A", label: "Muy esporádicamente" },
                            { id: "B", label: "Como hobby/casualmente" },
                            { id: "C", label: "Frecuentemente, como estudiante" },
                            { id: "D", label: "Todos los días, de forma profesional" },
                        ].map((option) => (
                            <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="q2"
                                    required={showQ2}
                                    checked={formData.q2 === option.id}
                                    onChange={() => handleInputChange("q2", option.id)}
                                    className="h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span>
                  <strong>{option.id}-</strong> {option.label}
                </span>
                            </label>
                        ))}
                    </div>
                )}

                {/* PREGUNTAS 3 Y 4 (Condicionales: Solo si Q1 incluye B) */}
                {showQ3AndQ4 && (
                    <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg space-y-6 transition-all">
                        {/* PREGUNTA 3 */}
                        <div className="space-y-3">
                            <label className="block font-semibold text-lg">
                                B-1. Dijo que va a usar la computadora para videojuegos, ¿qué tipo de juegos va a jugar?{" "}
                                <span className="text-sm font-normal text-gray-500">
                  (Puede elegir varios)
                </span>
                            </label>
                            {[
                                { id: "A", label: "Juegos nuevos/triple A" },
                                { id: "B", label: "Juegos competitivos/e-sports/juegos online" },
                                { id: "C", label: "Juegos indie" },
                                { id: "D", label: "Juegos retro" },
                            ].map((option) => (
                                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.q3.includes(option.id)}
                                        onChange={() => handleCheckboxChange("q3", option.id)}
                                        className="h-4 w-4 text-purple-600 rounded border-gray-300"
                                    />
                                    <span>
                    <strong>{option.id}-</strong> {option.label}
                  </span>
                                </label>
                            ))}
                        </div>

                        {/* PREGUNTA 4 */}
                        <div className="space-y-3">
                            <label className="block font-semibold text-lg">
                                B-2. Dijo que va a usar la computadora para videojuegos, ¿a qué resolución quiere jugar?
                            </label>
                            {[
                                { id: "A", label: "1080p" },
                                { id: "B", label: "1440p" },
                                { id: "C", label: "2160p" },
                            ].map((option) => (
                                <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="q4"
                                        required={showQ3AndQ4}
                                        checked={formData.q4 === option.id}
                                        onChange={() => handleInputChange("q4", option.id)}
                                        className="h-4 w-4 text-purple-600 border-gray-300"
                                    />
                                    <span>
                    <strong>{option.id}-</strong> {option.label}
                  </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {showQgpu && (
                    <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg space-y-3 transition-all">
                        <label className="block font-semibold text-lg">
                            D-1. Dijo que va a usar la computadora para tareas de programación, ¿Esto incluye tareas de
                            renderizado 3D, desarrollo de video juegos o machine learning?
                        </label>
                        {[
                            { id: "A", label: "Si" },
                            { id: "B", label: "No" },
                        ].map((option) => (
                            <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="qgpu"
                                    required={showQgpu}
                                    checked={formData.qgpu === option.id}
                                    onChange={() => handleInputChange("qgpu", option.id)}
                                    className="h-4 w-4 text-blue-600 border-gray-300"
                                />
                                <span>
                  <strong>{option.id}-</strong> {option.label}
                </span>
                            </label>
                        ))}
                    </div>
                )}

                {/* PREGUNTA 5 */}
                <div className="space-y-3">
                    <label className="block font-semibold text-lg">
                        3. ¿Qué tipo de archivos espera almacenar en la computadora?
                    </label>

                    {[
                        { id: "A", label: "Poco y nada, guardo todo remotamente" },
                        { id: "B", label: "Documentos, planillas, archivos de texto u otros archivos de tamaño pequeño" },
                        { id: "C", label: "Archivos multimedia, fotos, videos, música, películas" },
                        { id: "D", label: "ISOs de Linux ;D"}
                    ].map((option) => (
                        <label key={option.id} className="flex items-start space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="q5"
                                required
                                checked={formData.q5 === option.id}
                                onChange={() => handleInputChange("q5", option.id)}
                                className="mt-1 h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <span>
                <strong>{option.id}-</strong> {option.label}
              </span>
                        </label>
                    ))}
                </div>

                {/* PREGUNTA 6 */}
                <div className="space-y-3">
                    <label className="block font-semibold text-lg">
                        4. ¿Le gustaría poder expandir el almacenamiento en un futuro?
                    </label>
                    {[
                        { id: "A", label: "Sí" },
                        { id: "B", label: "No es necesario pero suma" },
                        { id: "C", label: "No" },
                    ].map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="q6"
                                required
                                checked={formData.q6 === option.id}
                                onChange={() => handleInputChange("q6", option.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <span>
                <strong>{option.id}-</strong> {option.label}
              </span>
                        </label>
                    ))}
                </div>

                {/* PREGUNTA 7 */}
                <div className="space-y-3">
                    <label className="block font-semibold text-lg">
                        5. ¿Cómo se va a conectar a internet?
                    </label>
                    {[
                        { id: "A", label: "Mediante cable ethernet" },
                        { id: "B", label: "Wi-Fi" },
                    ].map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="q7"
                                required
                                checked={formData.q7 === option.id}
                                onChange={() => handleInputChange("q7", option.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <span>
                <strong>{option.id}-</strong> {option.label}
              </span>
                        </label>
                    ))}
                </div>

                {/* PREGUNTA 8 */}
                <div className="space-y-3">
                    <label className="block font-semibold text-lg">
                        6. ¿Le molesta que una PC sea ruidosa?
                    </label>
                    {[
                        { id: "A", label: "Para nada" },
                        { id: "B", label: "Un poco" },
                        { id: "C", label: "Mucho" },
                        { id: "D", label: "Extremadamente" },
                    ].map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="q8"
                                required
                                checked={formData.q8 === option.id}
                                onChange={() => handleInputChange("q8", option.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <span>
                <strong>{option.id}-</strong> {option.label}
              </span>
                        </label>
                    ))}
                </div>

                {/* PREGUNTA 9 */}
                <div className="space-y-3">
                    <label className="block font-semibold text-lg">
                        7. Sobre el RGB en la computadora:
                    </label>
                    {[
                        { id: "A", label: "Preferiría que no tenga" },
                        { id: "B", label: "Me da igual" },
                        { id: "C", label: "Preferiría que tenga" },
                    ].map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="q9"
                                required
                                checked={formData.q9 === option.id}
                                onChange={() => handleInputChange("q9", option.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <span>
                <strong>{option.id}-</strong> {option.label}
              </span>
                        </label>
                    ))}
                </div>

                {/* PREGUNTA 10 */}
                <div className="space-y-3">
                    <label className="block font-semibold text-lg">
                        8. ¿Le gustaría que las partes sean reutilizables en el futuro?{" "}
                        <span className="text-sm font-normal text-gray-500">
              (ya sea para armar una nueva PC o para venderlas como usadas)
            </span>
                    </label>
                    {[
                        { id: "A", label: "No me interesa" },
                        { id: "B", label: "No es importante pero suma" },
                        { id: "C", label: "Es fundamental" },
                    ].map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="q10"
                                required
                                checked={formData.q10 === option.id}
                                onChange={() => handleInputChange("q10", option.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <span>
                <strong>{option.id}-</strong> {option.label}
              </span>
                        </label>
                    ))}
                </div>

                {/* PREGUNTA 11 */}
                <div className="space-y-3">
                    <label htmlFor="budget" className="block font-semibold text-lg">
                        9. ¿Cuál es el monto máximo que está dispuesto a gastar? En ARS
                    </label>
                    <div className="relative rounded-md shadow-sm max-w-xs">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                            type="text"
                            inputMode="numeric" // Abre el teclado numérico en celulares
                            id="budget"
                            required
                            placeholder="Ej: 2.000.000"
                            value={formData.q11}
                            onChange={(e) => {
                                const formatted = formatNumberWithDots(e.target.value);
                                handleInputChange("q11", formatted);
                            }}
                            className="block w-full rounded-md border-gray-300 pl-7 pr-12 py-2 border focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* PREGUNTA 12 */}
                <div className="space-y-3">
                    <label className="block font-semibold text-lg">
                        10. ¿Qué tan importante considera el precio final?
                    </label>
                    {[
                        { id: "A", label: "No me importa gastarme todo el presupuesto" },
                        { id: "B", label: "Si puedo gastar un poco menos mejor, pero no es lo que importa" },
                        { id: "C", label: "Me gustaría gastar menos" },
                        { id: "D", label: "Quiero gastar lo menos posible" },
                    ].map((option) => (
                        <label key={option.id} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="q12"
                                required
                                checked={formData.q12 === option.id}
                                onChange={() => handleInputChange("q12", option.id)}
                                className="h-4 w-4 text-blue-600 border-gray-300"
                            />
                            <span>
                <strong>{option.id}-</strong> {option.label}
              </span>
                        </label>
                    ))}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Obtener recomendación
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                >
                    Resetear Cuestionario
                </button>
            </form>

            {isLoading && (
                <div className="flex flex-col items-center justify-center my-6">
                    <img
                        src="/loading.gif"
                        alt="Cargando recomendación..."
                        className="w-48 h-48 object-contain rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-500 animate-pulse">
                        Buscando los mejores componentes...
                    </p>
                </div>
            )}

            {showError && (
                <div className="flex flex-col items-center justify-center my-6">
                    <img
                        src="/cat-error.webp"
                        alt="Error del servidor"
                        className="w-xl h-xl object-contain rounded-lg"
                    />
                    <p className="mt-2 text-sm text-gray-500 animate-pulse">
                        Error en el servidor, nuestros técnicos están trabajando para solucionarlo
                    </p>
                    {error && (
                        <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md font-mono">
                            {error}
                        </p>
                    )}
                </div>
            )}

            {showResults && Array.isArray(apiResponse) && apiResponse.length > 0 && (() => {
                // Separamos la mejor opción (índice 0) del resto
                const [bestBuild, ...otherBuilds] = apiResponse;

                // Función auxiliar para estructurar los componentes de cualquier armado
                const getComponents = (build: PcBuild) => [
                    { label: "Procesador", name: build.cpu_model, link: build.cpu_link },
                    { label: "Placa de Video", name: build.gpu_model, link: build.gpu_link },
                    { label: "Motherboard", name: build.motherboard_model, link: build.motherboard_link },
                    {
                        label: "Memoria RAM",
                        name: `${build.ram_sticks > 1 ? `${build.ram_sticks}x ` : ""}${build.ram_model}`,
                        link: build.ram_link,
                    },
                    { label: "Almacenamiento", name: build.storage_model, link: build.storage_link },
                    { label: "Cooler CPU", name: build.cooler_model, link: build.cooler_link },
                    { label: "Fuente", name: build.psu_model, link: build.psu_link },
                    { label: "Gabinete", name: build.case_model, link: build.case_link },
                ];

                // Formateador de moneda
                const formatPrice = (price: number) =>
                    new Intl.NumberFormat("es-AR", {
                        style: "currency",
                        currency: "ARS",
                        maximumFractionDigits: 0,
                    }).format(price);

                return (
                    <div className="mt-8 space-y-8">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Configuraciones Recomendadas ({apiResponse.length})
                        </h2>

                        {/* 🏆 OPCIÓN #1: TARJETA DESTACADA (ANCHO COMPLETO) */}
                        <div className="bg-white border-2 border-indigo-500 rounded-2xl shadow-lg overflow-hidden">
                            {/* Cabecera destacada */}
                            <div className="p-6 bg-linear-to-r from-indigo-50 via-white to-indigo-50/40 border-b border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2.5 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white bg-indigo-600 px-3 py-1 rounded-full shadow-sm">
                ★ Mejor Opción (#1)
              </span>
                                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                Match: {(bestBuild.score * 100).toFixed(1)}%
              </span>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        La configuración con el mejor equilibrio rendimiento/precio para tu búsqueda.
                                    </p>
                                </div>

                                <div className="sm:text-right">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Precio Total Estimado
                                    </p>
                                    <p className="text-3xl sm:text-4xl font-black text-gray-900">
                                        {formatPrice(bestBuild.price)}
                                    </p>
                                </div>
                            </div>

                            {/* Lista de componentes en 2 columnas para aprovechar el ancho */}
                            <div className="p-6">
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 text-sm">
                                    {getComponents(bestBuild).map((item, idx) => (
                                        <li
                                            key={idx}
                                            className="py-3 border-b border-gray-100 flex flex-col justify-center"
                                        >
                <span className="text-xs font-semibold text-indigo-500/80 uppercase tracking-wider">
                  {item.label}
                </span>
                                            <a
                                                href={item.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-semibold text-gray-800 hover:text-indigo-600 transition-colors mt-0.5 flex items-center justify-between group text-base"
                                                title={item.name}
                                            >
                                                <span className="truncate pr-3">{item.name}</span>
                                                <span className="text-gray-400 group-hover:text-indigo-600 text-sm shrink-0">
                    ↗
                  </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 📋 RESTO DE OPCIONES (GRILLA DE 3 COLUMNAS COMO ANTES) */}
                        {otherBuilds.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Otras alternativas ({otherBuilds.length})
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {otherBuilds.map((build, index) => (
                                        <div
                                            key={index}
                                            className="flex flex-col justify-between bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                                        >
                                            <div className="p-5 bg-gray-50 border-b border-gray-100">
                                                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-gray-600 bg-gray-200/70 px-2.5 py-1 rounded-full">
                      Opción #{index + 2}
                    </span>
                                                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Match: {(build.score * 100).toFixed(1)}%
                    </span>
                                                </div>

                                                <div className="mt-3">
                                                    <p className="text-xs text-gray-500">Precio Total Estimado</p>
                                                    <p className="text-2xl font-extrabold text-gray-900">
                                                        {formatPrice(build.price)}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-5 flex-1">
                                                <ul className="divide-y divide-gray-100 text-sm">
                                                    {getComponents(build).map((item, idx) => (
                                                        <li key={idx} className="py-2.5 flex flex-col">
                        <span className="text-xs font-medium text-gray-400">
                          {item.label}
                        </span>
                                                            <a
                                                                href={item.link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="font-medium text-gray-700 hover:text-indigo-600 transition-colors line-clamp-1 mt-0.5 flex items-center justify-between group"
                                                                title={item.name}
                                                            >
                                                                <span className="truncate pr-2">{item.name}</span>
                                                                <span className="text-gray-400 group-hover:text-indigo-600 text-xs shrink-0">
                            ↗
                          </span>
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleSave}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                        >
                            Quiero que me envien las listas de partes generadas
                        </button>
                        {showEmail && (
                            <div className="space-y-3">
                                <div>
                                    <label
                                        htmlFor="suggestion-email"
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                    >
                                        Tu correo electrónico
                                    </label>
                                    <input
                                        id="suggestion-email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                            // Oculta el error apenas el usuario empieza a corregir
                                            if (emailError) setEmailError("");
                                        }}
                                        placeholder="ejemplo@correo.com"
                                        className={`w-full px-4 py-2.5 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 transition-colors ${
                                            emailError
                                                ? "border-red-500 focus:ring-red-200 bg-red-50/30"
                                                : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                    />
                                    {emailError && (
                                        <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                                            <span>⚠</span> {emailError}
                                        </p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleEmailSubmit}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
                                >
                                    Enviar Listados de partes
                                </button>
                            </div>
                        )}
                        {isSending && (
                            <div className="flex flex-col items-center justify-center my-6">
                                <img
                                    src="/cat-pc.gif"
                                    alt="Enviando Email"
                                    className="w-xl h-xl object-contain rounded-lg"
                                />
                                <p className="mt-2 text-sm text-gray-500 animate-pulse">
                                    Enviando Email
                                </p>
                            </div>
                        )}
                        {emailSent && (
                            <p className="mt-2 text-xs text-green-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-md font-mono">
                                Email Enviado con éxito
                            </p>
                        )}
                    </div>
                );
            })()}
        </div>
    );
}