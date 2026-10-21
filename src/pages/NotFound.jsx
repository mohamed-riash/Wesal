import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6 py-12">
      <div className="w-20 h-20 rounded-full bg-gold-400/10 border border-gold-400/30 text-gold-400 flex items-center justify-center mx-auto text-3xl font-black">
        404
      </div>
      <h1 className="text-3xl font-bold text-slate-100 font-heading">
        الصفحة غير موجودة
      </h1>
      <p className="text-slate-300 max-w-md mx-auto text-sm sm:text-base">
        يبدو أن الصفحة التي تحاول الوصول إليها قد تم نقلها أو غير موجودة.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gold-400 to-amber-500 text-serenity-bg font-bold shadow-lg hover:scale-105 transition-transform inline-flex items-center gap-2"
      >
        <Home className="w-4 h-4" />
        <span>العودة للصفحة الرئيسية</span>
      </Link>
    </div>
  );
}
