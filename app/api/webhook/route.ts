import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/errors";
import { verifyWebhookSignature } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const headers = request.headers;
    const webhookEvent = await request.json();

    const isSignatureValid = await verifyWebhookSignature({
      headers,
      webhookEvent,
    });

    if (!isSignatureValid) {
      throw new Error("Webhook verification failed");
    }

    console.log("Webhook verified successfully:", webhookEvent);

    return new NextResponse("ok", {
      status: 200,
    });
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    console.error(errorMessage);
    return new NextResponse(errorMessage, {
      status: 400,
    });
  }
}
