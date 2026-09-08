/**
 * CONTROLLER - cards 1 and 23: reading the HTTP request and writing the
 * response. Everything in this file is about the transport, never about
 * workshops.
 */
import type { IncomingMessage, ServerResponse } from "node:http";

export type Handler = (req: IncomingMessage, res: ServerResponse) => Promise<void>;

export const readJsonBody = async (req: IncomingMessage): Promise<Record<string, unknown>> => {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk);
  return chunks.length > 0 ? JSON.parse(Buffer.concat(chunks).toString()) : {};
};

export const sendJson = (res: ServerResponse, status: number, body: unknown): void => {
  res.writeHead(status);
  res.end(JSON.stringify(body));
};

export const sendError = (res: ServerResponse, status: number, message: string): void => {
  sendJson(res, status, { error: message });
};
