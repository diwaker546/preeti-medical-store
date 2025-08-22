import { useState } from 'react';
import { Auth } from 'aws-amplify';
import { useTranslation } from 'react-i18next';

const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
const toE164 = (p:string)=> p.startsWith('+91') ? p : `+91${p}`;

export default function Login() {
  const { t } = useTranslation();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [challenge, setChallenge] = useState<any>(null);
  const [step, setStep] = useState<'enter'|'otp'>('enter');
  const [error, setError] = useState('');

  const sendOtp = async () => {
    setError('');
    if (!phoneRegex.test(phone)) { setError('Invalid Indian mobile'); return; }
    const username = toE164(phone);
    try {
      const user = await Auth.signIn(username);
      setChallenge(user); setStep('otp');
    } catch (e:any) {
      if (e.code === 'UserNotFoundException') {
        try {
          await Auth.signUp({
            username,
            password: Math.random().toString(36) + 'Aa1!',
            attributes: { phone_number: username }
          });
          const user = await Auth.signIn(username);
          setChallenge(user); setStep('otp');
        } catch (err:any) { setError(err.message); }
      } else { setError(e.message); }
    }
  };

  const verifyOtp = async () => {
    try {
      if (challenge?.challengeName === 'SMS_MFA') {
        await Auth.confirmSignIn(challenge, otp, 'SMS_MFA');
      } else {
        // custom auth
        // @ts-ignore
        await Auth.sendCustomChallengeAnswer(challenge, otp);
      }
      window.location.href = '/profile';
    } catch (e:any) { setError(e.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow rounded p-6">
        <h1 className="text-2xl font-bold mb-4">{t('appName')}</h1>

        {step === 'enter' && (
          <>
            <label className="block mb-2">{t('phone')}</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+91XXXXXXXXXX or 9xxxxxxxxx"
              className="w-full border p-2 rounded mb-4" />
            <button onClick={sendOtp} className="w-full bg-green-600 text-white rounded py-2">{t('login')}</button>
          </>
        )}

        {step === 'otp' && (
          <>
            <label className="block mb-2">{t('verifyOtp')}</label>
            <input value={otp} onChange={e=>setOtp(e.target.value)} className="w-full border p-2 rounded mb-4" />
            <button onClick={verifyOtp} className="w-full bg-green-600 text-white rounded py-2">{t('verifyOtp')}</button>
          </>
        )}

        {error && <p className="text-red-600 mt-3">{error}</p>}
        <p className="text-xs text-gray-500 mt-4">Owner: Chitrasen Yadav · 7525837320</p>
      </div>
    </div>
  );
}
