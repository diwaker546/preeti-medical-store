import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { json, getUserSub } from './_common';
import twilio from 'twilio';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TWILIO_SID = process.env.TWILIO_SID!;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(TWILIO_SID, TWILIO_TOKEN);

const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';
const OWNER_WHATSAPP = 'whatsapp:+917525837320';

export const handler = async (e:any) => {
  const user = getUserSub(e);
  if (!user.groups.includes('admin')) return json(403, { error: 'Forbidden' });

  const { id, status, note } = JSON.parse(e.body || '{}');
  if (!id || !status) return json(400, { error: 'id and status required' });

  const key = { pk: `order#${id}`, sk: 'order' };
  const existing = await ddb.send(new GetCommand({ TableName: process.env.TABLE_ORDERS, Key: key }));
  if (!existing.Item) return json(404, { error: 'Order not found' });

  await ddb.send(new UpdateCommand({
    TableName: process.env.TABLE_ORDERS,
    Key: key,
    UpdateExpression: 'SET #s = :s, updatedAt = :u, adminNote = :n',
    ExpressionAttributeNames: { '#s': 'status' },
    ExpressionAttributeValues: { ':s': status, ':u': new Date().toISOString(), ':n': note || '' }
  }));

  // notify customer if phone exists
  const phone = existing.Item.userPhone || existing.Item.userPhone;
  if (phone) {
    const raw = phone.toString();
    const numeric = raw.replace(/\D/g, '');
    const to = numeric.length >= 10 && numeric.startsWith('91') ? `whatsapp:+${numeric}` :
               numeric.length === 10 ? `whatsapp:+91${numeric}` :
               raw.startsWith('+') ? `whatsapp:${raw}` :
               `whatsapp:+91${numeric}`;
    const body = `📦 Your order #${id} status updated: *${status}*\n${note ? `Note: ${note}\n` : ''}— Preeti Medical Store`;
    try {
      await client.messages.create({ from: WHATSAPP_FROM, to, body });
    } catch (err) {
      console.error('WhatsApp customer notify error:', err);
    }
  }

  // notify owner about status change
  try {
    const ownerMsg = `✅ Order #${id} updated to ${status}${note ? `\nNote: ${note}` : ''}`;
    await client.messages.create({ from: WHATSAPP_FROM, to: OWNER_WHATSAPP, body: ownerMsg });
  } catch (err) {
    console.warn('Owner notify error on update', err);
  }

  return json(200, { ok: true });
};
