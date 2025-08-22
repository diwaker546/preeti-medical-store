import { Auth } from 'aws-amplify';

export const api = async (path: string, method: 'GET'|'POST'|'PUT'|'DELETE' = 'GET', body?: any) => {
  const session = await Auth.currentSession().catch(()=>null);
  const token = session?.getIdToken().getJwtToken();
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: token } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return res.headers.get('content-type')?.includes('application/json') ? res.json() : {};
};
