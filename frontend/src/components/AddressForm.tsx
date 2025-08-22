import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export default function AddressForm({ initial }:{ initial?: any }) {
  const { t } = useTranslation();
  const [form, setForm] = useState({ name:'', address:'', phone:'', ...initial });

  const save = async () => {
    await api('/me', 'PUT', form);
    alert('Saved!');
    window.location.href = '/';
  };

  return (
    <div className="space-y-3">
      <div>
        <label>{t('name')}</label>
        <input className="w-full border rounded p-2" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
      </div>
      <div>
        <label>{t('address')}</label>
        <textarea className="w-full border rounded p-2" value={form.address} onChange={e=>setForm({...form, address:e.target.value})}/>
      </div>
      <div>
        <label>{t('mobile')}</label>
        <input className="w-full border rounded p-2" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
      </div>
      <button onClick={save} className="bg-green-600 text-white px-4 py-2 rounded">{t('save')}</button>
    </div>
  );
}
