import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import ProductCard from '../components/ProductCard';
import PhotoOrder from '../components/PhotoOrder';
import ManualOrder from '../components/ManualOrder';

export default function Home(){
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(()=>{ (async()=> {
    try { setProducts(await api('/products','GET')); } catch {}
  })(); }, []);

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="flex items-center justify-between mb-4">
        <div className="font-bold text-xl">{t('appName')}</div>
        <div className="flex gap-4">
          <a className="text-green-700" href="/profile">Profile</a>
          <a className="text-green-700" href="/admin">Admin</a>
        </div>
      </header>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold mb-2">{t('uploadPhoto')}</h3>
          <PhotoOrder/>
        </div>
        <div>
          <h3 className="font-semibold mb-2">{t('manualEntryShort')}</h3>
          <ManualOrder/>
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-2">{t('products')}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p=> <ProductCard key={p.pk || p.id} p={p}/>)}
      </div>

      <footer className="mt-8 text-sm text-gray-500">
        Owner: <b>Chitrasen Yadav</b> · Mobile: <a href="tel:+917525837320">+91 75258 37320</a>
      </footer>
    </div>
  );
}
