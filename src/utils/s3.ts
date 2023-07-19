import { S3Client, ListObjectsV2Command, ListObjectsV2Request } from "@aws-sdk/client-s3";

export class S3Helper {
  private client = new S3Client({});
  private bucket: string;
  private pulumiStore: string;

  constructor(bucket: string) {
    this.bucket = bucket;
    this.pulumiStore = '.pulumi';
  }

  private async listKeys(location: string) {
    const Prefix = `${this.pulumiStore}/${location}/`;
    const input: ListObjectsV2Request = {
      Bucket: this.bucket,
      Delimiter: `/`,
      Prefix,
    };

    let results = new Array<string | undefined>;

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

    return results;
  }

  public async getStacks() {
    return await this.listKeys('stacks');
  }

}
