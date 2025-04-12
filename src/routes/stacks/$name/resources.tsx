import { createServerFn } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { Tabs, Stack, Card, Text } from "@chakra-ui/react";
import { z } from "zod";
import { Package, ReceiptText, Layers } from "lucide-react";

import { s3 } from "@/server/clients";
import { State } from "@/server/pulumi";

const getResources = createServerFn({
	method: "GET",
})
	.validator((data: string) => data)
	.handler(async ({ data }) => {
		const state = await s3.getState(data);
		return { version: state.version, providers: State.getProviders(state) };
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

	return (
		<div>
			<Tabs.Root defaultValue="providers">
				<Tabs.List>
					<Tabs.Trigger value="providers">
						<Package />
						Providers
					</Tabs.Trigger>
					<Tabs.Trigger value="resources">
						<Layers />
						Resources
					</Tabs.Trigger>
					<Tabs.Trigger value="outputs">
						<ReceiptText />
						Outputs
					</Tabs.Trigger>
				</Tabs.List>
				<Tabs.Content value="providers">
					<Stack pt={8} gap={8} align="center">
						{data.providers.map((item) => (
							<Card.Root key={item.name} minW="lg">
								<Card.Body>
									<Text>
										{item.name} - {item.version}
									</Text>
								</Card.Body>
							</Card.Root>
						))}
					</Stack>
				</Tabs.Content>
				<Tabs.Content value="resources">Txt</Tabs.Content>
				<Tabs.Content value="outputs">Txt</Tabs.Content>
			</Tabs.Root>
		</div>
	);
}
