import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import LanguageSwitcher from '../components/LanguageSwitcher';
import AddressForm from '../components/AddressForm';
import { useTranslation } from 'react-i18next';

export default function Profile() {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);
  const [me, setMe] = useState<any>(null);

  useEffect(() => { (async () => {
    try {
      const data = await api('/me', 'GET');
      setMe(data);
      if (data?.language) i18n.changeLanguage(data.language);
    } catch {
      window.location.href = '/login';
    }
  })(); }, []);

  useEffect(() => { if (me) api('/me','PUT',{ ...me, language: lang }).catch(()=>{}); }, [lang]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <LanguageSwitcher value={lang} onChange={setLang} />
      <h2 className="text-xl font-semibold mt-4">{t('deliverWhere')}</h2>
      <AddressForm initial={me}/>
    </div>
  );
}
