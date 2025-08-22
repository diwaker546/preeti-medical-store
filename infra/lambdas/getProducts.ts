import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { json } from './_common';
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async () => {
  const res = await ddb.send(new ScanCommand({ TableName: process.env.TABLE_PRODUCTS }));
  const items = (res.Items || []).map((x:any)=> ({ id: (x.pk||'').split('#')[1], ...x }));
  return json(200, items);
};
