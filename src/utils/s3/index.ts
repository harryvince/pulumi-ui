import { S3Client, ListObjectsV2Command, ListObjectsV2Request, _Object, GetObjectRequest, GetObjectCommand } from "@aws-sdk/client-s3";
import type { EnvironmentObjectType } from "./types";
import { HelperController } from "../../server/utils";

export class S3Helper {
  private client = new S3Client({});
  private bucket: string;
  private pulumiStore: string;

  constructor(bucket: string) {
    this.bucket = bucket;
    this.pulumiStore = '.pulumi';
  }

  private async getObject(Key: string) {
    const input: GetObjectRequest = {
      Bucket: this.bucket,
      Key 
    };

    const command = new GetObjectCommand(input);
    const response = await this.client.send(command);

    return await response.Body?.transformToString();
  };

  private async listKeys(location: string) {
    const Prefix = `${this.pulumiStore}/${location}/`;
    const input: ListObjectsV2Request = {
      Bucket: this.bucket,
      Prefix,
    };

    let results = new Array<_Object>;

    while (true) {
      const command = new ListObjectsV2Command(input);
      const response = await this.client.send(command);

      response.Contents?.forEach(item => {
        if (!item.Key?.includes(".bak")) {
          results.push(item);
        }
      });

      if (response.IsTruncated) {
        input.ContinuationToken = response.NextContinuationToken;
      } else {
        break;
      }
    }

    if (results.length < 1) {
      return HelperController.handler(false, 'No Keys found');
    }
    return HelperController.handler(true, results);
  }

  private async listFolders(location: string) {
    const Prefix = `${this.pulumiStore}/${location}/`;
    const input: ListObjectsV2Request = {
      Bucket: this.bucket,
      Delimiter: `/`,
      Prefix,
    };

    let results = new Array<string>;

    while (true) {
      const command = new ListObjectsV2Command(input);
      const response = await this.client.send(command);

      response.CommonPrefixes?.forEach(item => {
        const splitOutput = item.Prefix!.split('/');
        // Weird whitespace issue for final character
        splitOutput.pop();

        const cleansedOutput = splitOutput[splitOutput?.length - 1];
        results.push(cleansedOutput);
      });

      if (response.IsTruncated) {
        input.ContinuationToken = response.NextContinuationToken;
      } else {
        break;
      }
    }

    if (results.length < 1) {
      return HelperController.handler(false, 'Unable to find any Folders');
    }

    return HelperController.handler(true, results);
  }

  public async getStacks() {
    const folders = await this.listFolders('stacks');
    if (folders.success) return folders.value;
    else HelperController.log('Unable to find any Stacks');
  }

  public async getEnvironments(stack: string) {
    const results = await this.listKeys(`stacks/${stack}`);

    const items = new Array<EnvironmentObjectType>;
    if (results.success) {
      results.value.forEach((item: EnvironmentObjectType) => {
        const splitBySlash = item.Key!.split("/");
        const splitBySlashLength = splitBySlash.length;
        const environmentName = splitBySlash[splitBySlashLength - 1];
        const splitByFullstop = environmentName.split(".");
        const name = splitByFullstop[0];
        item.Name = name;
        items.push(item);
      });
    } else {
      HelperController.log('Unable to find any Environments');
    }
    return items;
  }

  public async getState(Key: string) {
    const item = await this.getObject(Key);
    return item;
  }

}
