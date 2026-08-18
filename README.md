# EComm Platform - Frontend

منصة تجارة إلكترونية حديثة وسريعة وآمنة مبنية بـ React و Vite

## المتطلبات

- Node.js 16+
- npm أو yarn

## التثبيت

```bash
# انتقل إلى مجلد المشروع
cd e-comm_front

# ثبت الحزم المطلوبة
npm install

# أو استخدم yarn
yarn install
```

## تشغيل المشروع

### في بيئة التطوير:

```bash
npm run dev
```

سيتم فتح التطبيق على `http://localhost:3000`

### بناء المشروع للإنتاج:

```bash
npm run build
```

### معاينة بناء الإنتاج:

```bash
npm run preview
```

<!-- ## هيكل المشروع

```
e-comm_front/
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # الصفحة الرئيسية
│   │   ├── Login.jsx         # صفحة تسجيل الدخول
│   │   └── Register.jsx      # صفحة التسجيل
│   ├── components/
│   │   ├── Header.jsx        # رأس الصفحة والتنقل
│   │   └── Footer.jsx        # تذييل الصفحة
│   ├── context/              # حالة التطبيق
│   ├── hooks/                # Hooks مخصصة
│   ├── utils/                # دوال مساعدة
│   ├── assets/               # الصور والموارد
│   ├── App.jsx               # المكون الرئيسي
│   └── index.css             # الأنماط العامة
├── public/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
``` -->

## الميزات الأمنية

- التحقق من صحة نماذج الإدخال
- تشفير كلمات المرور
- حماية بيانات المستخدم
- معالجة آمنة للأخطاء

## تحسينات الأداء

- Lazy loading للصور
- Code splitting مع React Router
- تقليل حجم الحزمة
- Minification والضغط

## خارطة الطريق

- [ ] إضافة صفحة المنتجات المفصلة
- [ ] إنشاء سلة التسوق
- [ ] نظام الدفع
- [ ] لوحة التحكم
- [ ] نظام التقييمات
- [ ] البحث المتقدم
- [ ] نظام الإشعارات
- [ ] دعم متعدد اللغات

## لوحة التحكم (نطاق فرعي مستقل)

لوحة الإدارة تعمل كتطبيق مستقل عن المتجر، لكل منهما نقطة دخول خاصة:

| التطبيق | نقطة الدخول | النطاق |
| --- | --- | --- |
| المتجر | `index.html` → `src/main.jsx` | `example.com` |
| لوحة التحكم | `admin.html` → `src/admin-main.jsx` | `admin.example.com` |

### أثناء التطوير

```bash
npm run dev
```

- المتجر: `http://localhost:3000`
- لوحة التحكم: `http://admin.localhost:3000`
  (أو `http://localhost:3000/admin.html` إذا كان النظام لا يدعم نطاقات `*.localhost`)

### النشر

`npm run build` ينتج `dist/index.html` و `dist/admin.html`. ملف `vercel.json`
يوجّه الطلبات حسب النطاق: أي مضيف يبدأ بـ `admin.` يُخدم من `admin.html`
وما عداه من `index.html`. يكفي إضافة النطاق الفرعي `admin.example.com`
إلى نفس مشروع Vercel.

> **ملاحظة:** جلسة الدخول تُحفظ في `localStorage` وهي مرتبطة بالنطاق، لذلك يسجل
> المدير الدخول مرة في المتجر ومرة في لوحة التحكم عبر شاشة `admin.example.com/login`.

### المتغيرات الاختيارية

| المتغير | الوصف |
| --- | --- |
| `VITE_ADMIN_SUBDOMAIN` | اسم النطاق الفرعي للوحة (الافتراضي `admin`) |
| `VITE_ADMIN_URL` | عنوان اللوحة كاملاً عند وجودها على نطاق مختلف تماماً |
| `VITE_STORE_URL` | عنوان المتجر كاملاً عند وجوده على نطاق مختلف تماماً |
