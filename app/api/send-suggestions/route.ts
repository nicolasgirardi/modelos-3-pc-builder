import { NextResponse } from "next/server";
import { Resend } from "resend";
import {PcBuild} from "@/app/types/quiz";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, builds }: { email: string; builds: PcBuild[] } = body;

        if (!email || !builds || builds.length === 0) {
            return NextResponse.json(
                { error: "Faltan datos obligatorios (email o configuraciones)." },
                { status: 400 }
            );
        }

        // Formateador de moneda para el correo
        const formatPrice = (price: number) =>
            new Intl.NumberFormat("es-AR", {
                style: "currency",
                currency: "ARS",
                maximumFractionDigits: 0,
            }).format(price);

        // Armamos el HTML del correo con las opciones y sus enlaces
        const buildsHtml = builds
            .map(
                (build, index) => `
        <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin-bottom: 16px; background-color: ${
                    index === 0 ? "#eef2ff" : "#ffffff"
                };">
          <h3 style="margin: 0 0 8px 0; color: #111827;">
            ${index === 0 ? "★ Mejor Opción (#1)" : `Opción #${index + 1}`} — ${formatPrice(build.price)}
          </h3>
          <ul style="margin: 0; padding-left: 18px; color: #374151; font-size: 14px; line-height: 1.6;">
            <li><strong>CPU:</strong> <a href="${build.cpu_link}">${build.cpu_model}</a></li>
            <li><strong>GPU:</strong> <a href="${build.gpu_link}">${build.gpu_model}</a></li>
            <li><strong>Motherboard:</strong> <a href="${build.motherboard_link}">${build.motherboard_model}</a></li>
            <li><strong>RAM:</strong> <a href="${build.ram_link}">${build.ram_sticks > 1 ? `${build.ram_sticks}x ` : ""}${build.ram_model}</a></li>
            <li><strong>Almacenamiento:</strong> <a href="${build.storage_link}">${build.storage_model}</a></li>
            <li><strong>Cooler:</strong> <a href="${build.cooler_link}">${build.cooler_model}</a></li>
            <li><strong>Fuente:</strong> <a href="${build.psu_link}">${build.psu_model}</a></li>
            <li><strong>Gabinete:</strong> <a href="${build.case_link}">${build.case_model}</a></li>
          </ul>
        </div>
      `
            )
            .join("");

        const { data, error } = await resend.emails.send({
            from: "PC Builder Assistant <onboarding@resend.dev>", // En modo prueba solo envía a tu propio mail registrado en Resend
            to: [email],
            subject: "Tus configuraciones de PC recomendadas",
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937;">Aquí tienes tus presupuestos de PC</h2>
          <p style="color: #4b5563;">Te compartimos las configuraciones recomendadas con enlaces directos a cada componente:</p>
          ${buildsHtml}
        </div>
      `,
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, id: data?.id });
    } catch (err) {
        return NextResponse.json(
            { error: "Error interno del servidor al enviar el correo." },
            { status: 500 }
        );
    }
}