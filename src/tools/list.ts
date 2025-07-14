import { DOS_GAMES } from "../utils/game-utils";

export const schema = {}

export const metadata = {
  name: "List DOS Games",
  description: "List all available DOS games",
  annotations: {
    title: "List DOS games availables",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
  },
}

export default async function list() {
  const games = Object.keys(DOS_GAMES);
  return {
    content: [
      { type: "text", text: JSON.stringify(games, null, 2) },
      { type: "text", text: "To play a game, use the `open-dos` tool and pass the game key as argument." }
    ]
  };
}