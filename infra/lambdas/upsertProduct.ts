import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { json, getUserSub } from './_common';
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (e:any) => {
  const user = getUserSub(e);
  if (!user.groups.includes('admin')) return json(403, { error: 'Forbidden' });
  const body = JSON.parse(e.body || '{}');
  const id = body.id || uuid();
  const item = { pk:`product#${id}`, sk:'product', id, ...body };
  await ddb.send(new PutCommand({ TableName: process.env.TABLE_PRODUCTS, Item: item }));
  return json(200, { id, ok: true });
};
