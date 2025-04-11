import type { PulumiCheckpoint } from "@/types";

export namespace State {
	export const getProviders = (state: PulumiCheckpoint) => {
		const resources = state.checkpoint.latest.resources;
		const providers = resources.filter((item) =>
			item.type.includes("pulumi:providers"),
		);
		const userFriendlyProviders = providers.map((item) => {
			const name = item.type.replace("pulumi:providers:", "");
			if (!item.inputs) return { name };

			const version = item.inputs.version;

			return { name, version };
		});
		return userFriendlyProviders;
	};
}
