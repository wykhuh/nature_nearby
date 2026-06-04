import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
export function createMockServer() {
  const handlers = [
    http.get("*", async (_args) => {
      console.error("!! request.url !!", _args.request.url);
      return HttpResponse.json({});
    }),
  ];

  const server = setupServer(...handlers);

  return server;
}
