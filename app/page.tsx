"use client";

import {
  PayPalSubscribeButtons,
  PayPalSubscription,
} from "@/components/paypal";

const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID!;

export default function Home() {
  return (
    <PayPalSubscription>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="min-w-2xl">
          <PayPalSubscribeButtons
            planId={planId}
            onApprove={async (data) => {
              alert(
                `You have successfully subscribed to ${data.subscriptionID}`
              );
            }}
          />
        </div>
      </div>
    </PayPalSubscription>
  );
}
