import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

export default function withAdmin(Comp:any) {
  return function Wrapped(props:any) {
    const [ok, setOk] = useState<boolean|null>(null);

    useEffect(()=>{ (async ()=>{
      try {
        const session = await Auth.currentSession();
        const idToken = session.getIdToken().getJwtToken();
        const payload = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
        const groups = payload['cognito:groups'] || [];
        if (groups.includes('admin')) setOk(true);
        else { alert('Admin access required'); window.location.href = '/'; }
      } catch {
        window.location.href = '/login';
      }
    })(); }, []);

    if (ok === null) return <div className="p-4">Checking admin...</div>;
    return <Comp {...props} />;
  };
}
