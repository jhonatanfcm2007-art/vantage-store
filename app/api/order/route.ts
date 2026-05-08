import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, phone, address, city, department, variantId, price } = body;

    const domain = process.env.SHOPIFY_STORE_DOMAIN;
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

    if (!domain || !adminToken) {
      console.error('Missing Shopify Admin credentials');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Crear un Draft Order (Pedido Preliminar) en Shopify
    // Esto permite capturar los datos sin requerir pago inmediato
    const query = `
      mutation draftOrderCreate($input: DraftOrderInput!) {
        draftOrderCreate(input: $input) {
          draftOrder {
            id
            name
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      input: {
        firstName,
        lastName,
        email: `${phone}@vantage.com`, // Email ficticio si no lo pedimos
        shippingAddress: {
          address1: address,
          city: city,
          province: department,
          phone: phone,
          firstName,
          lastName,
          country: 'Colombia',
          countryCode: 'CO',
        },
        lineItems: [
          {
            variantId: variantId, // Debe ser el ID de GraphQL (ej: gid://shopify/ProductVariant/...)
            quantity: 1,
          }
        ],
        tags: ['CONTRA_ENTREGA', 'LANDING_PAGE'],
        note: `Pedido realizado desde la landing page. Ciudad: ${city}, Dept: ${department}. Pago contra entrega.`,
      }
    };

    const response = await fetch(`https://${domain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': adminToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    const result = await response.json();

    if (result.data?.draftOrderCreate?.userErrors?.length > 0) {
      console.error('Shopify User Errors:', result.data.draftOrderCreate.userErrors);
      return NextResponse.json({ error: result.data.draftOrderCreate.userErrors[0].message }, { status: 400 });
    }

    return NextResponse.json({ success: true, orderId: result.data?.draftOrderCreate?.draftOrder?.id });

  } catch (error) {
    console.error('Order API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
