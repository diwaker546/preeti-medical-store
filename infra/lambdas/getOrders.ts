import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { json, getUserSub } from './_common';
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (e:any) => {
  const user = getUserSub(e);
  if (!user.groups.includes('admin')) return json(403, { error: 'Forbidden' });
  const res = await ddb.send(new ScanCommand({ TableName: process.env.TABLE_ORDERS }));
  const items = (res.Items || []).map((x:any)=> ({ id: (x.pk||'').split('#')[1], ...x }));
  return json(200, items);
};
