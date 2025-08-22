import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import withAdmin from '../../lib/withAdmin';

type Order = any;

function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const statusMap = ['NEW','PROCESSING','DISPATCHED','DELIVERED','CANCELLED'];

  const load = async () => {
    setLoading(true);
    try {
      const res = await api('/orders','GET');
      setOrders(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error('Failed loading orders', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 10000); // poll every 10s
    return () => clearInterval(t);
  }, []);

  const updateStatus = async (id: string, status: string) => {
    const note = prompt(`Enter note for Order #${id} (optional):`);
    try {
      await api('/orders','PUT',{ id, status, note });
      await load();
      alert('Status updated');
    } catch (err) {
      console.error('Failed update', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Orders</h1>
      {loading && <p>Loading…</p>}
      <div className="space-y-4">
        {orders.length === 0 && !loading && <p>No orders yet.</p>}
        {orders.map(o => (
          <div key={o.id || o.pk} className="border rounded p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">Order #{o.id}</div>
                <div className="text-sm">User: {o.userPhone || '—'}</div>
                <div className="text-sm">Address: {o.addressSnapshot || '—'}</div>
                <div className="text-sm">Created: {o.createdAt ? new Date(o.createdAt).toLocaleString() : '—'}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">Status: {o.status}</div>
                <div className="text-sm">Items: {Array.isArray(o.items) ? o.items.length : 0}</div>
              </div>
            </div>

            {o.photoUrl && (
              <div className="mt-3">
                <a target="_blank" rel="noreferrer" href={o.photoUrl}>
                  <img src={o.photoUrl} alt="prescription" className="h-40 object-contain border rounded" />
                </a>
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <select defaultValue={o.status} onChange={e=>updateStatus(o.id, e.target.value)} className="border p-1 rounded">
                {statusMap.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              <button onClick={()=>updateStatus(o.id,'PROCESSING')} className="bg-blue-600 text-white px-3 py-1 rounded">Set Processing</button>
              <button onClick={()=>updateStatus(o.id,'DISPATCHED')} className="bg-yellow-600 text-white px-3 py-1 rounded">Set Dispatched</button>
              <button onClick={()=>updateStatus(o.id,'DELIVERED')} className="bg-green-700 text-white px-3 py-1 rounded">Set Delivered</button>
              <button onClick={()=>updateStatus(o.id,'CANCELLED')} className="bg-red-600 text-white px-3 py-1 rounded">Cancel</button>
            </div>

            {o.adminNote && <div className="mt-2 text-sm text-gray-700">Admin note: {o.adminNote}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAdmin(AdminOrders);
