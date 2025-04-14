import {
	Badge,
	Card,
	DataList,
	List,
	Stack,
	Tabs,
	Text,
} from "@chakra-ui/react";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Layers, Package, ReceiptText } from "lucide-react";
import React from "react";
import { z } from "zod";

import { s3 } from "@/server/clients";
import { State } from "@/server/pulumi";

const getResources = createServerFn({
	method: "GET",
})
	.validator((data: string) => data)
	.handler(async ({ data }) => {
		const state = await s3.getState(data);
		return {
			version: state.version,
			providers: State.getProviders(state),
			resources: State.getResources(state),
			stacks: State.getStacks(state),
		};
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

// biome-ignore lint/suspicious/noExplicitAny: Allowed for this use case
function jsonToComponentList(data: any): React.ReactNode {
	if (data === null || typeof data !== "object") {
		return <List.Item>{String(data)}</List.Item>;
	}

	if (Array.isArray(data)) {
		return (
			<List.Root ps="5">
				{data.map((item) => (
					<React.Fragment key={item}>
						{jsonToComponentList(item)}
					</React.Fragment>
				))}
			</List.Root>
		);
	}

	return (
		<List.Root ps="5">
			{Object.entries(data).map(([key, value]) => (
				<List.Item key={key}>
					<strong>{key}:</strong>{" "}
					{typeof value === "object" && value !== null
						? jsonToComponentList(value)
						: String(value)}
				</List.Item>
			))}
		</List.Root>
	);
}

function RouteComponent() {
	const data = Route.useLoaderData();

	return (
		<div>
			<Tabs.Root defaultValue="providers" pb={8}>
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
				<Tabs.Content value="resources">
					<Stack pt={8} gap={8} align="center">
						{data.resources.map((item) => (
							<Card.Root key={item.urn} minW="6xl">
								<Card.Body>
									<DataList.Root pb={4}>
										{(["id", "type"] as const).map((label) => (
											<DataList.Item key={label}>
												<DataList.ItemLabel>{label}</DataList.ItemLabel>
												<DataList.ItemValue>{item[label]}</DataList.ItemValue>
											</DataList.Item>
										))}
									</DataList.Root>
									{item.protect && (
										<Badge maxW="min-content" colorPalette="purple">
											Protected
										</Badge>
									)}
								</Card.Body>
							</Card.Root>
						))}
					</Stack>
				</Tabs.Content>
				<Tabs.Content value="outputs">
					<Stack pt={8} gap={8} align="center">
						{data.stacks.map((item) =>
							// biome-ignore lint/complexity/noBannedTypes: Allowed for this use case
							Object.keys(item.outputs as Record<string, Object>).map(
								(output) => (
									<Card.Root key={output} minW="6xl">
										<Card.Body>
											{jsonToComponentList(item.outputs?.[output])}
										</Card.Body>
									</Card.Root>
								),
							),
						)}
					</Stack>
				</Tabs.Content>
			</Tabs.Root>
		</div>
	);
}
