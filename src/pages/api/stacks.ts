import type { APIRoute } from "astro";
import { S3Controller } from "../../server/utils";

export const GET: APIRoute = async ({ params, request }) => {
  return new Response(
    JSON.stringify({
      stacks: await S3Controller.getStacks(),
    })
  );
};
