
# R2M — صمِّم نظامك بنفسك (نسخة مبسطة)

واجهة خطوة-بخطوة بالصور، مخصصة لغير التقنيين.

## التشغيل
1) فك الضغط وافتح `index.html` مباشرة في المتصفح.

## تخصيص العلامة
- الشعار: استبدل `assets/r2m_logo.png` بشعارك.
- الألوان: عدّل المتغيرات في `styles.css` (brand colors).

## الإرسال إلى Google Sheets
1) أنشئ Google Sheet جديدًا.
2) من **Extensions > Apps Script**، أنشئ مشروعًا والصق محتوى `apps_script/Code.gs`.
3) استبدل `REPLACE_WITH_YOUR_SHEET_ID` بمعرّف الشيت (من رابط الملف).
4) **Deploy > New deployment > Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone with link**
   - انسخ Web App URL.
5) في `config.js`، استبدل `SHEETS_WEB_APP_URL` بالرابط.
6) احفظ ثم افتح `index.html` وجرب زر **إرسال إلى Google Sheets**.

## إرسال بريد/واتساب
- البريد: يفتح mailto باستخدام `EMAIL_TO` من `config.js` مع نص مختصر.
- واتساب: يفتح wa.me بالرسالة المختصرة إلى `WHATSAPP_PHONE`.

## لهجة يمنية (صنعاني)
- استخدم زر **لهجة يمنية (صنعاني)** أعلى الواجهة لتبديل بعض العناوين القابلة للتبديل.

## ملفات المشروع
- `index.html` — الواجهة.
- `styles.css` — الأنماط.
- `config.js` — الإعدادات (بريد/واتساب/Google Sheets).
- `app.js` — منطق الخطوات والإرسال.
- `assets/` — صور توضحية وشعار.
- `apps_script/Code.gs` — كود Google Apps Script.
