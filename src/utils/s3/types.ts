import type { _Object } from "@aws-sdk/client-s3";

export type EnvironmentType = {
  [key: string] : EnvironmentObjectType;
};

export interface EnvironmentObjectType extends _Object {
  Name?: string;
}
