import type { APIRoute } from "astro"
import { S3Controller } from "../../server/utils";

export const POST: APIRoute = async({ params, request }) => {
  const { filename } = await request.json();
  return new Response(
    JSON.stringify({
      data: await S3Controller.getState(filename),
    }),
  )
}
