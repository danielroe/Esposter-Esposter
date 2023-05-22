import { createContext } from "@/server/trpc/context";
import { appRouter } from "@/server/trpc/routers";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import chalk from "chalk";
import WebSocket, { WebSocketServer as WSWebSocketServer } from "ws";

export default defineNitroPlugin((nitro) => {
  const WebSocketServer = WebSocket.Server || WSWebSocketServer;
  const port = 3001;
  const wss = new WebSocketServer({ port });
  const handler = applyWSSHandler({ wss, router: appRouter, createContext });

  wss.on("connection", (ws) => {
    console.log(`Connection opened, client size: ${wss.clients.size}`);
    ws.once("close", () => console.log(`Connection closed, client size: ${wss.clients.size}`));
  });

  console.log(chalk.yellow(`WebSocket Server is listening on port:${port}`));

  nitro.hooks.hookOnce("close", () => {
    handler.broadcastReconnectNotification();
    wss.close();
  });
});
