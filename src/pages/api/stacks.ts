import type { APIRoute } from "astro"
import { S3Controller } from "../../server/utils"

export const get: APIRoute = async ({ params, request }) => {
  return {
    body: JSON.stringify({
      stacks: await S3Controller.getStacks(),
    }),
  }
}
