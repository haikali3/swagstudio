import * as soap from 'soap';
import dotenv from 'dotenv';
dotenv.config();

const wsdlUrl = 'https://promote.3m.com/promostandards/product_info?wsdl';

const auth = {
  userName: process.env.PROMO_USERNAME,
  password: process.env.PROMO_PASSWORD,
};

const productIds = ['3M123', '3M456', '3M789']; // 👈 Replace with real product IDs

export async function getProductsFromPromo() {
  const client = await soap.createClientAsync(wsdlUrl);
  const results: any[] = [];

  for (const productID of productIds) {
    const params = {
      wsVersion: "2.0.0",
      id: { productID },
      localizationCountry: "US",
      localizationLanguage: "en",
      authentication: auth,
    };

    try {
      const [response] = await client.getProductAsync(params);
      results.push(response);
    } catch (err) {
      if (err instanceof Error) {
        console.error(`❌ Error fetching product ${productID}:`, err.message);
      } else {
        console.error(`❌ Error fetching product ${productID}:`, err);
      }
    }
  }

  return results;
}
