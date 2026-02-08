const CACHE_NAME = 'fawal-mrv-v3';

// قائمة الملفات والروابط التي سيتم حفظها للعمل أوفلاين
const assets = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
];

// التثبيت: حفظ الملفات في الكاش فوراً
self.addEventListener('install', e => {
  self.skipWaiting(); // تفعيل الإصدار الجديد فوراً دون انتظار
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('جاري حفظ الملفات في الكاش...');
      return cache.addAll(assets);
    })
  );
});

// التفعيل: تنظيف الكاش القديم (مثل v2) لضمان عدم حدوث تعارض
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// جلب البيانات: البحث في الكاش أولاً (Cache First) لضمان الفتح بدون إنترنت
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => {
      // إذا وجد الملف في الكاش أرجعه، وإذا لم يوجد اطلبه من الإنترنت
      return response || fetch(e.request).catch(() => {
        // في حال فشل الإنترنت وعدم وجود الملف في الكاش (للملفات الأساسية فقط)
        if (e.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
