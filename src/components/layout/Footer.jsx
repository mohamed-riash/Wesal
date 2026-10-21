import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const [hijriDateStr, setHijriDateStr] = useState('');

  useEffect(() => {
    const updateDate = () => {
      try {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formatted = now.toLocaleDateString('ar-SA-u-ca-islamic', options);
        setHijriDateStr(formatted);
      } catch {
        setHijriDateStr('تاريخ اليوم');
      }
    };
    updateDate();
  }, []);

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 dark:border-emerald-950 text-slate-400 pt-16 pb-24 lg:pb-12 mt-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/logo 2.png" alt="وصال" className="w-10 h-10 rounded-xl" />
              <span className="text-2xl font-bold text-gold-400 font-heading">وصال — WESAL</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-300">
              منصة إسلامية حديثة تهتم بتوفير تلاوات القرآن الكريم، الأذكار اليومية التفاعلية، وموسوعة الأحاديث النبوية الموثقة في بيئة رقمية هادئة تسودها السكينة.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gold-400 font-heading">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-gold-400 transition-colors">الصفحة الرئيسية</Link>
              </li>
              <li>
                <Link to="/quran" className="hover:text-gold-400 transition-colors">قراءة وتفسير القرآن</Link>
              </li>
              <li>
                <Link to="/hadith" className="hover:text-gold-400 transition-colors">الأحاديث النبوية الشريفة</Link>
              </li>
              <li>
                <Link to="/azkar" className="hover:text-gold-400 transition-colors">الأذكار اليومية التفاعلية</Link>
              </li>
              <li>
                <Link to="/audio" className="hover:text-gold-400 transition-colors">الاستماع والاستجماع</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gold-400 font-heading">التواصل والدعم</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>info@wisal.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span dir="ltr">+20 1069469047</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>مصر — شمال سيناء</span>
              </div>
            </div>
          </div>

          {/* Verse & Date */}
          <div className="space-y-4 bg-slate-800/60 dark:bg-emerald-950/40 border border-slate-700/50 dark:border-emerald-500/20 p-5 rounded-2xl">
            <h4 className="text-lg font-bold text-gold-400 font-heading">آية وميعاد</h4>
            <blockquote className="font-quran text-lg text-emerald-300 dark:text-emerald-200 border-r-2 border-gold-400 pr-3">
              "وَقُلْ رَبِّ زِدْنِي عِلْمًا"
            </blockquote>
            <div className="text-xs text-gold-400 font-mono bg-black/40 px-3 py-2 rounded-xl inline-block">
              {hijriDateStr || 'تحميل التاريخ...'}
            </div>
          </div>

        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} وصال WESAL — جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1">
            <span>تم التطوير بحب والالتزام بأعلى معايير للجودة.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
