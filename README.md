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

تم آخر تحديث: July 19, 2026
