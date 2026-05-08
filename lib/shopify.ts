// lib/shopify.ts
// Shopify Storefront API client con GraphQL

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

const endpoint = `https://${domain}/api/2024-01/graphql.json`;

async function shopifyFetch<T>({
  query,
  variables,
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify GraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'Unknown GraphQL error');
  }

  return json.data;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

const PRODUCT_FIELDS = `
  fragment ProductFields on Product {
    id
    title
    handle
    description
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    images(first: 8) {
      edges {
        node {
          url
          altText
          width
          height
        }
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
    tags
    vendor
  }
`;

export async function getAllProducts() {
  const query = `
    ${PRODUCT_FIELDS}
    query GetAllProducts {
      products(first: 20) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  `;

  try {
    const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>({ query });
    return data.products.edges.map(({ node }) => node);
  } catch {
    return [];
  }
}

export async function getProductByHandle(handle: string) {
  const query = `
    ${PRODUCT_FIELDS}
    query GetProduct($handle: String!) {
      productByHandle(handle: $handle) {
        ...ProductFields
      }
    }
  `;

  try {
    const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>({
      query,
      variables: { handle },
    });
    return data.productByHandle;
  } catch {
    return null;
  }
}

export async function createCart(variantId: string, quantity: number = 1) {
  const query = `
    mutation CreateCart($variantId: ID!, $quantity: Int!) {
      cartCreate(
        input: {
          lines: [{ merchandiseId: $variantId, quantity: $quantity }]
        }
      ) {
        cart {
          id
          checkoutUrl
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    cartCreate: { cart: { id: string; checkoutUrl: string; cost: { totalAmount: { amount: string; currencyCode: string } } } };
  }>({ query, variables: { variantId, quantity } });

  return data.cartCreate.cart;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: Array<{
      node: { url: string; altText: string | null; width: number; height: number };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        selectedOptions: Array<{ name: string; value: string }>;
      };
    }>;
  };
  tags: string[];
  vendor: string;
}

export function formatPrice(amount: string, currencyCode: string = 'COP') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
  }).format(parseFloat(amount));
}
