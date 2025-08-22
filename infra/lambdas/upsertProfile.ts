import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { json, getUserSub } from './_common';
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (e:any) => {
  const user = getUserSub(e);
  const body = JSON.parse(e.body || '{}');
  const item = { pk: `user#${user.sub}`, sk: 'profile', ...body, phone: body.phone || user.phone };
  await ddb.send(new PutCommand({ TableName: process.env.TABLE_USERS, Item: item }));
  return json(200, { ok: true });
};
