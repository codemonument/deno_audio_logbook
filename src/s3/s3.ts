import { S3Client } from "s3";
import { secretsPromise } from "@/src/utils/secrets.ts";
import { z } from "zod";

// console.debug(
//   `Memory usage before s3 init: ${Deno.memoryUsage().rss / 1024}kb`,
// );
export const s3Promise = initS3();

async function initS3() {
  const secrets = await secretsPromise;
  return new S3Client({
    endPoint: z.string().parse(secrets.get("S3_ENDPOINT")),
    accessKey: secrets.get("S3_ACCESS_KEY"),
    secretKey: secrets.get("S3_SECRET_KEY"),
    region: z.string().parse(secrets.get("S3_REGION")),
    bucket: secrets.get("S3_BUCKET"),
  });
}
