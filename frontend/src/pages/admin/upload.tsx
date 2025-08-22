import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import withAdmin from '../../lib/withAdmin';

function AdminUpload(){
  const [form, setForm] = useState<any>({ name:'', brand:'', price:'', rxRequired:false, imageFile:null });
  const [list, setList] = useState<any[]>([]);

  const load = async()=> setList(await api('/products','GET').catch(()=>[]));
  useEffect(()=>{ load(); }, []);

  const upload = async ()=>{
    if (!form.imageFile) return alert('Select image');
    const { url, key } = await api('/presign','POST',{ type:'product-image', contentType: form.imageFile.type || 'image/jpeg' });
    await fetch(url, { method:'PUT', headers:{'Content-Type': form.imageFile.type || 'image/jpeg'}, body: form.imageFile });
    const imageUrl = `https://${process.env.NEXT_PUBLIC_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    await api('/products','POST',{ name: form.name, brand: form.brand, price: Number(form.price), rxRequired: !!form.rxRequired, imageUrl });
    alert('Product uploaded');
    setForm({ name:'', brand:'', price:'', rxRequired:false, imageFile:null });
    await load();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-3">Upload Product</h1>
      <div className="grid gap-2">
        <input placeholder="Name" className="border p-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
        <input placeholder="Brand" className="border p-2" value={form.brand} onChange={e=>setForm({...form, brand:e.target.value})}/>
        <input placeholder="Price" className="border p-2" value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.rxRequired} onChange={e=>setForm({...form, rxRequired:e.target.checked})}/> Rx Required?
        </label>
        <input type="file" accept="image/*" onChange={e=>setForm({...form, imageFile: e.target.files?.[0]})}/>
        <button onClick={upload} className="bg-green-700 text-white px-3 py-2 rounded">Save Product</button>
      </div>

      <h2 className="mt-6 font-semibold">Existing Products</h2>
      <ul className="list-disc pl-5">
        {list.map((p,i)=> <li key={p.pk || i}>{p.name} — ₹{p.price}</li>)}
      </ul>
    </div>
  );
}

export default withAdmin(AdminUpload);
