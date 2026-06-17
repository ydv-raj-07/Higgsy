import { S3Client } from "bun";

const ACCOUNT_ID = process.env.ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region: "auto",
  endpoint:"https://<ACCOUNT_ID>.r2.cloudflarestorage.com",
  accessKeyId: "<ACCESS_KEY_ID>",
  secretAccessKey: "<SECRET_ACCESS_KEY>",
})

export default s3;