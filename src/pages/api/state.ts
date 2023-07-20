import type { APIRoute } from "astro"
import { S3Controller } from "../../server/utils";

export const post: APIRoute = async({ params, request }) => {
  const { filename } = await request.json();
  return {
    body: JSON.stringify({
      data: await S3Controller.getState(filename),
    }),
  }
}
