export interface WebhookVerificationResponse {
  verification_status: "SUCCESS" | "FAILURE";
}

export interface AccessTokenResponse {
  access_token: string;
}

const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY;
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

export async function verifyWebhookSignature({
  headers,
  webhookEvent,
}: {
  headers: Headers;
  webhookEvent: unknown;
}): Promise<boolean> {
  const authAlgo = headers.get("PAYPAL-AUTH-ALGO");
  const certUrl = headers.get("PAYPAL-CERT-URL");
  const transmissionId = headers.get("PAYPAL-TRANSMISSION-ID");
  const transmissionSig = headers.get("PAYPAL-TRANSMISSION-SIG");
  const transmissionTime = headers.get("PAYPAL-TRANSMISSION-TIME");

  const accessToken = await getAccessToken();

  const body = {
    auth_algo: authAlgo,
    cert_url: certUrl,
    transmission_id: transmissionId,
    transmission_sig: transmissionSig,
    transmission_time: transmissionTime,
    webhook_id: PAYPAL_WEBHOOK_ID,
    webhook_event: webhookEvent,
  };

  const response = await fetcher<WebhookVerificationResponse>(
    `${PAYPAL_API_URL}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    }
  );

  return response.verification_status === "SUCCESS";
}

export async function fetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${url} ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export function toBase64(str: string): string {
  return Buffer.from(str).toString("base64");
}

export async function getAccessToken(): Promise<string> {
  const base64Credentials = toBase64(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`
  );

  const response = await fetcher<AccessTokenResponse>(
    `${PAYPAL_API_URL}/v1/oauth2/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64Credentials}`,
      },
      body: new URLSearchParams({ grant_type: "client_credentials" }),
    }
  );

  return response.access_token;
}
