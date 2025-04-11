import { createServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { s3 } from "@/server/clients";
import { z } from "zod";

const getResources = createServerFn({
	method: "GET",
})
	.validator((data: string) => data)
	.handler(async ({ data }) => {
		return s3.getState(data);
	});

const schema = z.object({
	fileKey: z.string(),
});

export const Route = createFileRoute("/stacks/$name/resources")({
	component: RouteComponent,
	validateSearch: (search) => schema.parse(search),
	loaderDeps: ({ search: { fileKey } }) => ({ fileKey }),
	loader: async ({ deps: { fileKey } }) =>
		await getResources({ data: fileKey }),
});

function RouteComponent() {
	const data = Route.useLoaderData();

	return <div>{data}</div>;
}
