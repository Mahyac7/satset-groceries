import "server-only";

/**
 * Minimal server-side Xendit Invoice API client.
 * Uses the REST API directly (no SDK) with HTTP Basic auth:
 * the secret key is the username and the password is empty.
 *
 * Docs: https://developers.xendit.co/api-reference/#create-invoice
 */

const XENDIT_BASE_URL = "https://api.xendit.co";

function getAuthHeader(): string {
  const key = process.env.XENDIT_SECRET_KEY;
  if (!key) {
    throw new Error(
      "XENDIT_SECRET_KEY is not set. Add it to your environment variables."
    );
  }
  // Basic auth: base64("<secret_key>:")
  const token = Buffer.from(`${key}:`).toString("base64");
  return `Basic ${token}`;
}

export interface CreateInvoiceItem {
  name: string;
  quantity: number;
  price: number; // per-unit price in IDR
}

export interface CreateInvoiceParams {
  externalId: string;
  amount: number; // total in IDR
  payerEmail?: string;
  description: string;
  successRedirectUrl: string;
  failureRedirectUrl: string;
  items?: CreateInvoiceItem[];
  customerName?: string;
}

export interface XenditInvoice {
  id: string;
  external_id: string;
  status: "PENDING" | "PAID" | "SETTLED" | "EXPIRED";
  amount: number;
  invoice_url: string;
  expiry_date: string;
  [key: string]: unknown;
}

/** Create a hosted Xendit invoice and return the invoice (incl. invoice_url). */
export async function createInvoice(
  params: CreateInvoiceParams
): Promise<XenditInvoice> {
  const body: Record<string, unknown> = {
    external_id: params.externalId,
    amount: params.amount,
    description: params.description,
    success_redirect_url: params.successRedirectUrl,
    failure_redirect_url: params.failureRedirectUrl,
    currency: "IDR",
    // Keep the demo short-lived; 1 hour is plenty.
    invoice_duration: 3600,
  };

  if (params.payerEmail) body.payer_email = params.payerEmail;
  if (params.customerName) {
    body.customer = { given_names: params.customerName };
  }
  if (params.items?.length) {
    body.items = params.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price,
    }));
  }

  const res = await fetch(`${XENDIT_BASE_URL}/v2/invoices`, {
    method: "POST",
    headers: {
      Authorization: getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Xendit create invoice failed (${res.status}): ${errText}`);
  }

  return (await res.json()) as XenditInvoice;
}

/** Retrieve an invoice by its Xendit id to check payment status. */
export async function getInvoice(invoiceId: string): Promise<XenditInvoice> {
  const res = await fetch(`${XENDIT_BASE_URL}/v2/invoices/${invoiceId}`, {
    method: "GET",
    headers: {
      Authorization: getAuthHeader(),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Xendit get invoice failed (${res.status}): ${errText}`);
  }

  return (await res.json()) as XenditInvoice;
}
