import { NextResponse } from "next/server";
import { getInvoice } from "@/lib/xendit";

export const runtime = "nodejs";

/**
 * GET /api/invoice-status?id=<xenditInvoiceId>
 * Returns the current payment status of a Xendit invoice.
 * Used when the user returns from the Xendit payment page (Option A: no webhook/DB).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Query param 'id' wajib diisi" },
      { status: 400 }
    );
  }

  if (!process.env.XENDIT_SECRET_KEY) {
    return NextResponse.json(
      { error: "XENDIT_SECRET_KEY belum diset" },
      { status: 500 }
    );
  }

  try {
    const invoice = await getInvoice(id);
    // PAID and SETTLED both mean payment received.
    const paid = invoice.status === "PAID" || invoice.status === "SETTLED";
    return NextResponse.json({
      invoiceId: invoice.id,
      externalId: invoice.external_id,
      status: invoice.status,
      paid,
      amount: invoice.amount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Gagal mengambil status invoice", detail: message },
      { status: 502 }
    );
  }
}
