import { tool } from "langchain";
import * as z from "zod";
import { contextDao } from "../../dao/context.dao";
import { query } from "express-validator";
import { getResultFromWeb } from "../web.service";

export const readMemoryTool = tool(
  async ({}, config) => {
    const userId = config.configurable.userId;
    const context = await contextDao.readContextByUser({ userId });
    return context;
  },
  {
    name: "getMemory",
    description: "Retrieves the context for a  given user",
    schema: z.object({}),
  },
);

export const updateMemoryTool = tool(
  async ({ description }: { description: string }, config) => {
    const userId = config.configurable.userId;
    const result = await contextDao.updateContextByUser({
      userId,
      description,
    });
    return result;
  },
  {
    name: "updateMemory",
    description: "Overrides or create new context or a given user",
    schema: z.object({
      description: z
        .string()
        .describe(`The new context description for the user.`),
    }),
  },
);

export const getWebResultTool = tool(
  async ({ query }: { query: string }) => {
    const result = await getResultFromWeb({ query });
    return result;
  },
  {
    name: "getWebResult",
    description: "Searches the web for a given query and returns the result",
    schema: z.object({
      query: z.string().describe(`The search query to look up on web`),
    }),
  },
);
