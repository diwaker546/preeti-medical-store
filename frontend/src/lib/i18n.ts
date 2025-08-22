import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: {
    appName: "Preeti Medical Store",
    login: "Login",
    phone: "Phone Number",
    verifyOtp: "Verify OTP",
    language: "Language",
    hindi: "Hindi",
    english: "English",
    save: "Save",
    name: "Full Name",
    address: "Delivery Address",
    mobile: "Mobile Number",
    deliverWhere: "Where should we deliver medicines?",
    placeOrder: "Place Order",
    uploadPhoto: "Upload Prescription Photo",
    manualEntry: "Enter Medicines Manually",
    products: "Products",
    adminPanel: "Admin Panel",
    uploadPhoto: "Upload Photo Order",
    manualEntryShort: "Manual Order"
  }},
  hi: { translation: {
    appName: "प्रीति मेडिकल स्टोर",
    login: "लॉगिन",
    phone: "मोबाइल नंबर",
    verifyOtp: "ओटीपी सत्यापित करें",
    language: "भाषा",
    hindi: "हिंदी",
    english: "अंग्रेज़ी",
    save: "सहेजें",
    name: "पूरा नाम",
    address: "डिलीवरी पता",
    mobile: "मोबाइल नंबर",
    deliverWhere: "दवाइयाँ कहाँ डिलीवर करनी हैं?",
    placeOrder: "ऑर्डर करें",
    uploadPhoto: "प्रिस्क्रिप्शन फोटो अपलोड करें",
    manualEntry: "दवा का नाम दर्ज करें",
    products: "उत्पाद",
    adminPanel: "एडमिन पैनल",
    uploadPhoto: "फोटो ऑर्डर अपलोड करें",
    manualEntryShort: "मैनुअल ऑर्डर"
  }},
};

i18n.use(initReactI18next).init({
  resources, lng: 'en', fallbackLng: 'en', interpolation: { escapeValue: false }
});
export default i18n;
