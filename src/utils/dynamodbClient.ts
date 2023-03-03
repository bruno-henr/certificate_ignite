import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

const options = {
  region: "locahost",
  endpoint: "http://localhost:8000",
  // accessKeyId: "x",
  // secretAccessKey: "x"
  credentials: {
    accessKeyId: "x",
    secretAccessKey: "x",
  }
};

const isOffline = () => {
  return process.env.IS_OFFLINE;
};

export const document = isOffline()
  ? DynamoDBDocument.from(new DynamoDB(options))
  : DynamoDBDocument.from(new DynamoDB({}));
