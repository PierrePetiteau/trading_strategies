// Server-Sent Events (SSE) helpers

import { NextApiResponse } from "next";

interface ISSEWriteParams {
  event: string;
  data: object;
}

export class SSE {
  private res: NextApiResponse;
  constructor(res: NextApiResponse) {
    this.res = res;
  }

  init() {
    return this.res.writeHead(200, {
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
    });
  }

  write({ event, data }: ISSEWriteParams) {
    return this.res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  }
  end() {
    return this.res.end();
  }
}
