import { tavily } from "@tavily/core";
import { env } from "../config/env";


const tvly = tavily({ apiKey: env.tvlyApiKey });

export async function getResultFromWeb({
  query,
}: {
  query: string;
}): Promise<string> {
  const result = await tvly.search(query, {
    maxResults: 5,
    includeAnswer: true,
  });

  return result.answer || "NO answer found for this query";
}
