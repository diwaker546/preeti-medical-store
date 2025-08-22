import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';
import { json, getUserSub } from './_common';
import twilio from 'twilio';

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const TWILIO_SID = process.env.TWILIO_SID!;
const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const client = twilio(TWILIO_SID, TWILIO_TOKEN);

const WHATSAPP_OWNER = 'whatsapp:+917525837320';
const WHATSAPP_FROM = process.env.TWILIO_WHATSAPP_FROM || 'whatsapp:+14155238886';

export const handler = async (e:any) => {
  try {
    const user = getUserSub(e);
    const body = JSON.parse(e.body || '{}');
    const id = uuid();

    // profile snapshot
    let phoneSnapshot = user.phone || '';
    let addressSnapshot = '';
    try {
      const r = await ddb.send(new GetCommand({ TableName: process.env.TABLE_USERS, Key: { pk: `user#${user.sub}`, sk: 'profile' } }));
      if (r.Item) {
        phoneSnapshot = r.Item.phone || phoneSnapshot;
        addressSnapshot = r.Item.address || addressSnapshot;
      }
    } catch (err) { /* ignore */ }

    const order:any = {
      pk: `order#${id}`,
      sk: 'order',
      id,
      userId: user.sub,
      userPhone: phoneSnapshot,
      addressSnapshot,
      status: 'NEW',
      createdAt: new Date().toISOString()
    };

    if (body.photoKey) order.photoUrl = `https://${process.env.BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${body.photoKey}`;
    if (body.items) order.items = body.items;

    await ddb.send(new PutCommand({ TableName: process.env.TABLE_ORDERS, Item: order }));

    // Owner message
    const ownerMsgParts = [
      `🛒 New Order #${id}`,
      `📱 User: ${phoneSnapshot || '—'}`,
      `📍 Address: ${addressSnapshot || '—'}`
    ];
    if (order.photoUrl) ownerMsgParts.push(`📷 Prescription: ${order.photoUrl}`);
    if (order.items) ownerMsgParts.push(`💊 Items:\n${order.items.map((x:any)=>`- ${x.name} x${x.qty||1}`).join('\n')}`);
    const ownerMsg = ownerMsgParts.join('\n');

    try {
      await client.messages.create({ body: ownerMsg, from: WHATSAPP_FROM, to: WHATSAPP_OWNER });
    } catch (err) {
      console.error('Error notifying owner via WhatsApp:', err);
    }

    // Customer message (if phone present)
    if (phoneSnapshot) {
      const raw = phoneSnapshot.toString();
      const numeric = raw.replace(/\D/g, '');
      const toNumber = numeric.length >= 10 && numeric.startsWith('91') ? `whatsapp:+${numeric}` :
                       numeric.length === 10 ? `whatsapp:+91${numeric}` :
                       raw.startsWith('+') ? `whatsapp:${raw}` :
                       `whatsapp:+91${numeric}`;

      const customerMsgParts = [
        `🙏 Thank you! Your order #${id} has been received by Preeti Medical Store.`,
        order.items ? `Order summary:\n${order.items.map((x:any)=>`- ${x.name} x${x.qty||1}`).join('\n')}` : (order.photoUrl ? `We received your prescription photo.` : '')
      ];
      const customerMsg = customerMsgParts.filter(Boolean).join('\n\n');

      try {
        await client.messages.create({ body: customerMsg, from: WHATSAPP_FROM, to: toNumber });
      } catch (err) {
        console.error('Error notifying customer via WhatsApp:', err);
      }
    }

    return json(200, { id, status: 'NEW' });
  } catch (err:any) {
    console.error('createOrder handler error', err);
    return json(500, { error: err?.message || 'Server error' });
  }
};
