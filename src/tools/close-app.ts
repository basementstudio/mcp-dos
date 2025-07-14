import { InferSchema } from "xmcp";
import { z } from "zod";

export const schema = {
  port: z.number().describe("The port of the app to close."),
};

export const metadata = {
  name: "close-app",
  description: "Close an existing running mcp-dos server. You can use this tool if you are getting erros when starting a new server.",
  annotations: {
    title: "Close app",
    readOnlyHint: true,
    destructiveHint: true,
    idempotentHint: true,
  },
};

export default async function closeApp({ port }: InferSchema<typeof schema>) {
  try {
    const response = await fetch(`http://localhost:${port}/close`, {
      method: "GET",
    });
    const data = await response.text();

    return {
      content: [
        {
          type: "text",
          text: `Closed server on port ${port}`,
        },
        {
          type: "text",
          text: data,
        }
      ],
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error closing server on port ${port}: ${error}`,
        },
      ],
    }
  }
}