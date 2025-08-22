import { useState } from 'react';
import { api } from '../lib/api';

export default function PhotoOrder(){
  const [file, setFile] = useState<File|null>(null);
  const upload = async () => {
    if (!file) return alert('Select image');
    const { url, key } = await api('/presign', 'POST', { type: 'order-photo', contentType: file.type || 'image/jpeg' });
    await fetch(url, { method:'PUT', headers:{ 'Content-Type': file.type || 'image/jpeg' }, body:file });
    await api('/orders', 'POST', { photoKey: key });
    alert('Order placed with photo!');
  };
  return (
    <div className="p-4 border rounded">
      <input type="file" accept="image/*" onChange={e=>setFile(e.target.files?.[0]||null)} />
      <button onClick={upload} className="ml-2 bg-green-600 text-white px-3 py-1 rounded">Upload</button>
    </div>
  );
}
