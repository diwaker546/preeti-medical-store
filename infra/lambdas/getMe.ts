import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { json, getUserSub } from './_common';
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (e:any) => {
  const user = getUserSub(e);
  const r = await ddb.send(new GetCommand({ TableName: process.env.TABLE_USERS, Key: { pk: `user#${user.sub}`, sk: 'profile' } }));
  return json(200, r.Item || { phone: user.phone });
};
