import { Card, Heading, Stack, Text } from "@chakra-ui/react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { s3 } from "@/server/clients";

const getStacks = createServerFn({
	method: "GET",
}).handler(async () => {
	return await s3.getStacks();
});

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [{ title: "stacks | pulumi-ui" }],
	}),
	component: Home,
	loader: async () => await getStacks(),
});

function Home() {
	const data = Route.useLoaderData();

	return (
		<Stack pt={8} gap={8} align="center">
			<Heading>Stacks</Heading>
			{data.map((item) => (
				<Card.Root key={item} minW="lg">
					<Card.Body>
						<Text>
							<Link to={"/stacks/$name"} params={{ name: item }}>
								{item}
							</Link>
						</Text>
					</Card.Body>
				</Card.Root>
			))}
		</Stack>
	);
}
