import axios from "axios";
import { config } from "../config/env";

export async function fetchMedia(supplierCode: string, productId: string) {
  const url = `https://api.psrestful.com/v1.1.0/suppliers/${supplierCode}/medias/${productId}/?environment=PROD`;

  const headers = {
    "X-API-KEY": config.psApiKey,
  };

  const response = await axios.get(url, { headers });
  return response.data;
}
