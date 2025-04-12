export type PulumiCheckpoint = {
	version: number;
	checkpoint: {
		stack: string;
		latest: {
			manifest: {
				time: string;
				magic: string;
				version: string;
			};
			secrets_providers?: {
				type: string;
				state?: Record<string, string>;
			};
			resources: PulumiResource[];
		};
	};
};

type PulumiResource = {
	urn: string;
	type: string;
	custom: boolean;
	id?: string;
	parent?: string;
	provider?: string;
	protect?: boolean;
	created?: string;
	modified?: string;
	sourcePosition?: string;
	propertyDependencies?: Record<string, string[]>;
	additionalSecretOutputs?: string[];

	inputs?: Record<string, string>;
	outputs?: Record<string, string>;
};
