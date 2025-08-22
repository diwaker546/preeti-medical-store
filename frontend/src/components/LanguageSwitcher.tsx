import { useTranslation } from 'react-i18next';
export default function LanguageSwitcher({ value, onChange }:{ value: string; onChange: (v:string)=>void; }) {
  const { t, i18n } = useTranslation();
  const set = (lng:string)=>{ i18n.changeLanguage(lng); onChange(lng); };
  return (
    <div className="flex items-center gap-2">
      <span>{t('language')}:</span>
      <button className={`px-3 py-1 border rounded ${value==='hi'?'bg-green-100':''}`} onClick={()=>set('hi')}>{t('hindi')}</button>
      <button className={`px-3 py-1 border rounded ${value==='en'?'bg-green-100':''}`} onClick={()=>set('en')}>{t('english')}</button>
    </div>
  );
}
