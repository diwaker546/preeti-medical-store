import { useState } from 'react';
import { api } from '../lib/api';

export default function ManualOrder(){
  const [items, setItems] = useState<string[]>(['']);
  const add = ()=> setItems([...items, '']);
  const change = (i:number, v:string)=> setItems(items.map((x,idx)=> idx===i?v:x));
  const place = async () => {
    const filtered = items.map(s => s.trim()).filter(Boolean);
    if (!filtered.length) return alert('Add at least one medicine');
    await api('/orders', 'POST', { items: filtered.map(n=>({ name:n, qty:1 })) });
    alert('Order placed!');
  };
  return (
    <div className="p-4 border rounded space-y-2">
      {items.map((v,i)=>(
        <input key={i} className="w-full border rounded p-2" value={v} onChange={e=>change(i,e.target.value)} placeholder="e.g., Paracetamol 500mg"/>
      ))}
      <div className="flex gap-2">
        <button onClick={add} className="border px-3 py-1 rounded">+ Add</button>
        <button onClick={place} className="ml-2 bg-green-600 text-white px-3 py-1 rounded">Place Order</button>
      </div>
    </div>
  );
}
