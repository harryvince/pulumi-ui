import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { s3 } from "@/server/clients";

const getEnvironments = createServerFn({
	method: "GET",
})
	.validator((data: string) => data)
	.handler(async ({ data }) => {
		return await s3.getEnvironments(data);
	});

export const Route = createFileRoute("/stacks/$name/")({
	component: RouteComponent,
	loader: async ({ params }) => await getEnvironments({ data: params.name }),
});

function RouteComponent() {
	const { name } = Route.useParams();
	const data = Route.useLoaderData();

	return (
		<Stack pt={8} gap={8} align="center">
			<Heading>{name} environments</Heading>
			{data.map(
				(item) =>
					item.Key && (
						<Card.Root key={item.Name} minW="lg">
							<Card.Body>
								<Text>
									<Link
										to="/stacks/$name/resources"
										search={{ fileKey: item.Key }}
										params={{ name }}
									>
										{item.Name}
									</Link>
								</Text>
							</Card.Body>
						</Card.Root>
					),
			)}
		</Stack>
	);
}
