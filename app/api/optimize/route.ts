import { NextResponse } from "next/server";
import {answersToWeights, categoriesToQueryString} from "@/app/util/util";

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url);

    // Opcional: Si necesitas leer algún parámetro específico para validarlo antes:
    // const presupuesto = searchParams.get("q11");
    // const q1 = searchParams.get("q1");
    const sendParams = answersToWeights(searchParams);
    const queryString = categoriesToQueryString(sendParams);
    const apiUrl = process.env.BACKEND_API

    if (!apiUrl) {
        console.error("Falta configurar EXTERNAL_API_URL en las variables de entorno");
        return NextResponse.json(
            { error: "Error de configuración en el servidor" },
            { status: 500 }
        );
    }

    try {
        // 2. Armar la URL de tu API externa con esos mismos parámetros
        const externalApiUrl = `${apiUrl}/best-pcs/?${queryString.toString()}`;

        // 3. Hacer el fetch GET a la API externa
        const response = await fetch(externalApiUrl, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                // Si tu API externa pide clave/token, ponelo acá usando variables de entorno:
                // "Authorization": `Bearer ${process.env.API_SECRET_KEY}`,
            },
            // En Next.js es buena práctica desactivar caché si los resultados son dinámicos:
            cache: "no-store",
        });

        // 4. Si la API externa falla, reenviar el error al frontend
        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            return NextResponse.json(
                { error: errorBody?.message || "Error al consultar el optimizador externo" },
                { status: response.status }
            );
        }

        // 5. Devolver los datos exitosos a tu componente React
        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error("Error en /api/optimize:", error);
        return NextResponse.json(
            { error: "Error interno de conexión con el servidor" },
            { status: 500 }
        );
    }
}

