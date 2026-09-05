import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

function getClient() {
  const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error(
      "MERCADOPAGO_ACCESS_TOKEN não configurada. Defina a variável de ambiente antes de gerar um checkout.",
    );
  }
  return new MercadoPagoConfig({ accessToken });
}

export async function createCheckoutPreference(input: {
  applicationId: string;
  amountCents: number;
  successUrl: string;
  notificationUrl: string;
}) {
  const preference = new Preference(getClient());

  const response = await preference.create({
    body: {
      items: [
        {
          id: "checklist-completo",
          title: "Checklist completo — Rota Consular",
          description:
            "Status detalhado de cada item avaliado, explicação específica citando seus dados, e alertas do seu caso pra preparação do visto americano de turismo.",
          quantity: 1,
          unit_price: input.amountCents / 100,
          currency_id: "BRL",
        },
      ],
      external_reference: input.applicationId,
      back_urls: {
        success: input.successUrl,
        pending: input.successUrl,
        failure: input.successUrl,
      },
      auto_return: "approved",
      notification_url: input.notificationUrl,
    },
  });

  if (!response.id || !response.init_point) {
    throw new Error("Mercado Pago não retornou uma preferência válida.");
  }

  return { id: response.id, initPoint: response.init_point };
}

// O webhook nunca deve confiar no corpo da notificação — sempre busca o
// pagamento de verdade na API do Mercado Pago pelo id recebido.
export async function fetchPayment(paymentId: string) {
  const payment = new Payment(getClient());
  return payment.get({ id: paymentId });
}

export function mpConfigurado() {
  return Boolean(process.env.MERCADOPAGO_ACCESS_TOKEN);
}

// Preferência da LOJA (produto + order bumps), separada do checkout do
// freemium. external_reference = "pedido:<compraId>" pro webhook identificar.
export async function createLojaPreference(input: {
  compraId: string;
  items: { id: string; title: string; unitPriceCents: number }[];
  payerEmail: string;
  successUrl: string;
  notificationUrl: string;
}) {
  const preference = new Preference(getClient());

  const response = await preference.create({
    body: {
      items: input.items.map((it) => ({
        id: it.id,
        title: it.title,
        quantity: 1,
        unit_price: Math.round(it.unitPriceCents) / 100,
        currency_id: "BRL",
      })),
      payer: { email: input.payerEmail },
      external_reference: `pedido:${input.compraId}`,
      back_urls: {
        success: input.successUrl,
        pending: input.successUrl,
        failure: input.successUrl,
      },
      auto_return: "approved",
      notification_url: input.notificationUrl,
    },
  });

  if (!response.id || !response.init_point) {
    throw new Error("Mercado Pago não retornou uma preferência válida.");
  }

  return { id: response.id, initPoint: response.init_point };
}
