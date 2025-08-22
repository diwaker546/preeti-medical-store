import { APIGatewayProxyEventV2 } from 'aws-lambda';
import jwt from 'jsonwebtoken';

export const json = (status:number, body:any)=> ({
  statusCode: status,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

export const getUserSub = (e: APIGatewayProxyEventV2 | any) => {
  // Expect Authorization header with JWT from Cognito (ID token)
  const auth = e.headers?.authorization || e.headers?.Authorization;
  if (!auth) throw new Error('No token provided');
  const token = typeof auth === 'string' ? auth.replace(/^Bearer\s+/i,'') : auth;
  const payload:any = jwt.decode(token);
  if (!payload) throw new Error('Invalid token');
  return { sub: payload.sub, phone: payload.phone_number || payload.phone, groups: payload['cognito:groups'] || [] };
};
