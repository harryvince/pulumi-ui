import type { PulumiCheckpoint } from "@/types";
import {
	GetObjectCommand,
	type GetObjectRequest,
	ListObjectsV2Command,
	type ListObjectsV2Request,
	S3Client,
	type _Object,
} from "@aws-sdk/client-s3";
import { logger } from "./clients";
import { wrapResult } from "./utils";

export type EnvironmentType = {
	[key: string]: EnvironmentObjectType;
};

export interface EnvironmentObjectType extends _Object {
	Name?: string;
}

export class S3Helper {
	private client = new S3Client({});
	private bucket: string;
	private pulumiStore: string;
	private directory: string | null;

	constructor(bucket: string, directory: string | null = null) {
		this.bucket = bucket;
		this.directory = directory;
		this.pulumiStore = ".pulumi";
	}

	private async getObject(Key: string) {
		const input: GetObjectRequest = {
			Bucket: this.bucket,
			Key,
		};

		const command = new GetObjectCommand(input);
		const response = await this.client.send(command);

		return await response.Body?.transformToString();
	}

	private async listKeys(location: string) {
		const Prefix = this.directory
			? `${this.directory}/${this.pulumiStore}/${location}/`
			: `${this.pulumiStore}/${location}/`;
		const input: ListObjectsV2Request = {
			Bucket: this.bucket,
			Prefix,
		};

		const results = new Array<_Object>();

		while (true) {
			const command = new ListObjectsV2Command(input);
			const response = await this.client.send(command);

			for (const item of response.Contents || []) {
				if (!item.Key?.includes(".bak")) {
					results.push(item);
				}
			}

			if (response.IsTruncated) {
				input.ContinuationToken = response.NextContinuationToken;
			} else {
				break;
			}
		}

		if (results.length < 1) {
			return wrapResult(false, "No Keys found");
		}
		return wrapResult(true, results);
	}

	private async listFolders(location: string) {
		const Prefix = this.directory
			? `${this.directory}/${this.pulumiStore}/${location}/`
			: `${this.pulumiStore}/${location}/`;
		const input: ListObjectsV2Request = {
			Bucket: this.bucket,
			Delimiter: "/",
			Prefix,
		};

		const results = new Array<string>();

		while (true) {
			const command = new ListObjectsV2Command(input);
			const response = await this.client.send(command);

			for (const item of response.CommonPrefixes || []) {
				const splitOutput = item.Prefix?.split("/");
				// Weird whitespace issue for final character
				splitOutput?.pop();

				if (splitOutput && splitOutput.length > 0) {
					const cleansedOutput = splitOutput[splitOutput?.length - 1];
					results.push(cleansedOutput as string);
				}
			}

			if (response.IsTruncated) {
				input.ContinuationToken = response.NextContinuationToken;
			} else {
				break;
			}
		}

		if (results.length < 1) {
			return wrapResult(false, "Unable to find any Folders");
		}

		return wrapResult(true, results);
	}

	public async getStacks(): Promise<string[]> {
		const folders = await this.listFolders("stacks");
		logger.info(folders);
		if (folders.success) return folders.value;
		logger.warn("Unable to find any Stacks");
		return [];
	}

	public async getEnvironments(stack: string) {
		const results = await this.listKeys(`stacks/${stack}`);

		const items = new Array<EnvironmentObjectType>();
		if (results.success) {
			for (const item of results.value) {
				const splitBySlash = item.Key?.split("/");
				const splitBySlashLength = splitBySlash.length;
				const environmentName = splitBySlash[splitBySlashLength - 1];
				const splitByFullstop = environmentName?.split(".");
				if (splitByFullstop && splitByFullstop.length > 0) {
					item.Name = splitByFullstop[0];
					items.push(item);
				}
			}
		} else {
			logger.warn("Unable to find any Environments");
		}
		logger.info(items);
		return items;
	}

	public async getState(Key: string) {
		const item = await this.getObject(Key);
		return JSON.parse(item as string) as unknown as PulumiCheckpoint;
	}
}
