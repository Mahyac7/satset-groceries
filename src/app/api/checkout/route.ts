import { NextResponse } from "next/server";
import { createInvoice } from "@/lib/xendit";

export const runtime = "nodejs";

interface CheckoutRequestItem {
  name: string;
  quantity: number;
  price: number;
}

interface CheckoutRequestBody {
  orderId: string;
  amount: number;
  items: CheckoutRequestItem[];
  customerName?: string;
  payerEmail?: string;
}

/** Resolve the app's public base URL for building redirect URLs. */
function getBaseUrl(req: Request): string {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  // Fallback: derive from request headers (works on Vercel).
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  const host = req.headers.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

export async function POST(req: Request) {
  let body: CheckoutRequestBody;
  try {
    body = (await req.json()) as CheckoutRequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { orderId, amount, items, customerName, payerEmail } = body;

  // Basic validation.
  if (!orderId || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json(
      { error: "orderId dan amount (>0) wajib diisi" },
      { status: 400 }
    );
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json(
      { error: "items tidak boleh kosong" },
      { status: 400 }
    );
  }

  if (!process.env.XENDIT_SECRET_KEY) {
    return NextResponse.json(
      {
        error:
          "Xendit belum dikonfigurasi. Set environment variable XENDIT_SECRET_KEY.",
      },
      { status: 500 }
    );
  }

  const baseUrl = getBaseUrl(req);

  try {
    const invoice = await createInvoice({
      externalId: orderId,
      amount,
      description: `Pesanan Satset #${orderId}`,
      customerName,
      payerEmail,
      items: items.map((i) => ({
        name: i.name,
        quantity: i.quantity,
        price: i.price,
      })),
      // Return the user to their order page; we verify status there.
      successRedirectUrl: `${baseUrl}/orders/${orderId}?payment=success`,
      failureRedirectUrl: `${baseUrl}/orders/${orderId}?payment=failed`,
    });

    return NextResponse.json({
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoice_url,
      status: invoice.status,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    // Avoid leaking secrets; message from Xendit is safe (no key echoed).
    return NextResponse.json(
      { error: "Gagal membuat invoice Xendit", detail: message },
      { status: 502 }
    );
  }
}
