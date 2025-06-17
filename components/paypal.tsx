"use client";

import {
  PayPalButtons,
  PayPalScriptProvider,
  type PayPalButtonsComponentProps,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;

export function PayPalSubscription({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialOptions: ReactPayPalScriptOptions = {
    clientId: clientId,
    vault: true,
    intent: "subscription",
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
}

export function PayPalSubscribeButtons({
  planId,
  onApprove,
}: {
  planId: string;
  onApprove?: PayPalButtonsComponentProps["onApprove"];
}) {
  const style: PayPalButtonsComponentProps["style"] = {
    label: "subscribe",
  };

  const createSubscription: PayPalButtonsComponentProps["createSubscription"] =
    async (data, actions) => {
      return actions.subscription.create({
        plan_id: planId,
      });
    };

  return (
    <PayPalButtons
      style={style}
      createSubscription={createSubscription}
      onApprove={onApprove}
    />
  );
}
