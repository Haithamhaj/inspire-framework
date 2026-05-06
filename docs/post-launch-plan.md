# INSPIRE Post-Launch Plan

هذا الملف مرجع واحد لنقاط ما بعد الإطلاق. الهدف منه توثيق كل بند، علاقته بالنظام الحالي، وما الذي سيتغير عند التنفيذ حتى يكون التطبيق لاحقاً أسهل في البحث والفهم.

## 1. Full Launch Test On Production Domain

**الهدف**
التأكد أن المسار الكامل يعمل على الدومين الحي قبل الإعلان.

**العلاقة بالنظام الحالي**
- الواجهة الحية تعمل على `https://inspire.next-stepai.com`.
- الحسابات تعتمد على auth في `artifacts/api-server/src/routes/auth.ts`.
- التقييم الكامل يبدأ من `artifacts/inspire-web/src/pages/assess.tsx`.
- التقارير تظهر من `artifacts/inspire-web/src/pages/results.tsx`.
- صفحة تقارير العميل تظهر من `artifacts/inspire-web/src/pages/my-assessments.tsx`.
- لوحة الأدمن تظهر من `artifacts/inspire-web/src/pages/admin.tsx`.

**المطلوب اختباره**
- فتح الدومين.
- إنشاء حساب جديد.
- تسجيل الدخول.
- تنفيذ Assessment كامل.
- التأكد من إنشاء التقرير.
- التأكد من ظهور Operating Pattern Report.
- التأكد أن Copy-Ready AI Instructions تظهر بالإنجليزية فقط.
- التأكد من صفحة My Assessments.
- التأكد من Admin Dashboard.

**التغييرات المحتملة**
- إصلاحات UI أو routing أو auth إذا ظهر خلل.
- إصلاحات language state إذا ظهر خلط عربي/إنجليزي.
- لا يتم تغيير منطق التقرير إلا إذا كشف الاختبار خللاً واضحاً.

## 2. Report Feedback And Rating

**الهدف**
بعد مشاهدة التقرير، يستطيع العميل تقييم تجربة التقرير نفسه.

**العلاقة بالنظام الحالي**
- كل تقرير مرتبط بـ `assessmentId`.
- كل تقرير مرتبط بالمستخدم عبر `userId`.
- التقييم يجب أن يكون خاصاً داخل الحساب، وليس في public share.
- الأدمن يحتاج رؤية التقييمات لمراقبة الجودة.

**السلوك المطلوب**
- تقييم سريع من 1 إلى 5.
- سؤال: هل التقرير مفيد؟
- سؤال اختياري: ما أكثر شيء كان مفيداً؟
- سؤال اختياري: ما الذي كان ناقصاً؟
- زر إرسال feedback.
- يظهر فقط داخل صفحة التقرير الخاصة.
- لا يظهر داخل public share.
- يخزن في قاعدة البيانات.
- يظهر في Admin Dashboard.

**الجداول/الملفات المرتبطة**
- `lib/db/src/schema/assessments.ts`
- `lib/db/src/schema/assessment-feedback.ts`
- `artifacts/api-server/src/routes/results.ts`
- `artifacts/api-server/src/routes/admin.ts`
- `artifacts/inspire-web/src/pages/results.tsx`
- `artifacts/inspire-web/src/pages/admin.tsx`

**التغييرات المتوقعة**
- جدول feedback مستقل.
- API لحفظ feedback لكل assessment.
- عرض feedback داخل التقرير الخاص.
- عرض rating و low rating filter داخل الأدمن.

## 3. Admin Monitoring Improvements

**الهدف**
الأدمن يستطيع رؤية حالة كل تحليل ومراقبة المشاكل بسرعة.

**العلاقة بالنظام الحالي**
- حالات التحليل موجودة داخل `assessments.status`.
- retry موجود عبر `pending_retry`, `retryCount`, `nextRetryAt`.
- الدفع موجود في `payments`.
- email status موجود في `assessments.emailSent`.
- report content موجود في `assessments.reportContent`.

**المطلوب عرضه**
- completed
- failed
- pending_retry
- paid_no_report
- low rating
- هل يوجد `reportContent`
- هل أُرسل الإيميل
- هل الدفع مكتمل
- وقت التوليد
- عدد retries
- زر Retry للتقارير الفاشلة أو العالقة.

**الجداول/الملفات المرتبطة**
- `lib/db/src/schema/assessments.ts`
- `lib/db/src/schema/payments.ts`
- `lib/db/src/schema/assessment-feedback.ts`
- `artifacts/api-server/src/routes/admin.ts`
- `artifacts/inspire-web/src/pages/admin.tsx`
- `artifacts/api-server/src/lib/ai-engine.ts`

**التغييرات المتوقعة**
- توسيع response الخاص بـ `/api/admin/assessments`.
- إضافة filters في الواجهة.
- إضافة counters في stats.
- تحسين recovery view للأدمن.

## 4. Customer Comments Display

**الهدف**
بعد جمع تقييمات وتعليقات العملاء، يكون هناك مكان منظم لعرض التعليقات المفيدة في الواجهة، لاستخدامها كدليل اجتماعي وتحسين الثقة.

**العلاقة بالنظام الحالي**
- feedback الخاص بكل تقرير محفوظ أو مخطط له عبر `assessment_feedback`.
- التعليقات الأصلية مرتبطة بـ `assessmentId` و `userId`.
- التعليقات قد تحتوي معلومات خاصة عن مشروع العميل، لذلك لا يجوز عرضها للعامة تلقائياً.
- الأدمن يحتاج اختيار التعليقات المناسبة قبل ظهورها في الواجهة العامة.

**السلوك المطلوب**
- داخل الأدمن: عرض تعليقات العملاء القادمة من feedback.
- الأدمن يستطيع تمييز تعليق بأنه صالح للعرض العام.
- لا يظهر أي تعليق في الواجهة العامة بدون مراجعة/اعتماد.
- إمكانية إخفاء اسم العميل أو عرضه كاسم مختصر.
- إمكانية عرض التعليق حسب اللغة أو ترجمته لاحقاً.
- التعليقات العامة تظهر في مكان مناسب في الواجهة مثل:
  - landing page
  - صفحة النتائج بعد التقرير
  - صفحة تسويقية مستقبلية لتجارب العملاء

**الجداول/الملفات المرتبطة**
- `lib/db/src/schema/assessment-feedback.ts`
- `artifacts/api-server/src/routes/admin.ts`
- `artifacts/inspire-web/src/pages/admin.tsx`
- `artifacts/inspire-web/src/pages/landing.tsx`
- `artifacts/inspire-web/src/components/landing`
- جدول مستقبلي محتمل: `customer_testimonials`

**التغييرات المتوقعة**
- إضافة حقول اعتماد إلى feedback أو إنشاء جدول منفصل:
  - `is_public`
  - `public_name`
  - `public_comment`
  - `language`
  - `approved_at`
  - `approved_by`
- واجهة أدمن لاختيار التعليقات ونشرها.
- API عام آمن لجلب التعليقات المعتمدة فقط.
- مكون واجهة يعرض التعليقات المعتمدة.

**ملاحظة خصوصية**
التعليقات الخام داخل feedback تبقى خاصة. النسخة العامة يجب أن تكون مراجعة ومنقحة حتى لا تكشف هدف المشروع أو بيانات العميل أو تفاصيل خاصة.

## 5. Official Email And Resend Setup

**الهدف**
إكمال البريد الرسمي للنتائج والتنبيهات.

**العلاقة بالنظام الحالي**
- إرسال البريد موجود في `artifacts/api-server/src/lib/email.ts`.
- نتائج التقرير ترسل من `sendResultsEmail`.
- حالات الفشل ترسل من `sendFailureEmail`.
- تنبيهات الأدمن ترسل من `sendAdminAlertEmail`.

**المطلوب في Resend/DNS**
- إكمال Resend domain verification لـ `mail.next-stepai.com`.
- عدم حذف Google MX.
- عدم تفعيل Cloudflare Email Routing حالياً.
- في Resend:
  - Enable Sending: ON
  - Enable Receiving: OFF
- بعد التحقق:
  - `FROM_NAME=INSPIRE`
  - `FROM_EMAIL=reports@mail.next-stepai.com`

**التغييرات المتوقعة**
- تحديث production env.
- تجربة إرسال نتيجة.
- تجربة admin alert.
- لا يتم تغيير MX الخاص بجوجل.

## 6. Payment Failure And Recovery Flow

**الهدف**
إذا دفع العميل ولم يظهر التقرير، يكون النظام واضحاً للعميل وقابلاً للاسترداد من الأدمن.

**العلاقة بالنظام الحالي**
- الدفع في `payments`.
- assessment مرتبط بـ `paymentId`.
- حالات retry موجودة في `assessments`.
- توليد التقرير في `ai-engine`.
- صفحة العميل في `my-assessments`.

**السيناريو المطلوب**
- العميل دفع.
- التقرير لم يكتمل.
- الحالة تصبح `pending_retry` أو `paid_no_report`.
- الأدمن يرى alert/filter.
- الأدمن يستطيع retry generation.
- العميل يرى رسالة واضحة في My Assessments أن التقرير محفوظ ويتم العمل عليه بدون دفع جديد.

**قرار تجربة الدفع**
- الدفع يكون بعد إكمال الأسئلة وليس قبل الدخول للتجربة.
- المستخدم يختار الدومين واللغة ويجيب على الأسئلة أولاً.
- عند الضغط على توليد التقرير تظهر شاشة الدفع إذا كان الدفع مطلوباً.
- بعد نجاح الدفع يتم إرسال الإجابات وتوليد التقرير تلقائياً.
- أول تقييم مجاني يمر مباشرة إلى التوليد بدون شاشة دفع.
- التقييمات اللاحقة تستخدم كود الخصم الشخصي إن وجد قبل الدفع.

**الأثر على النظام**
- `assessments/start` ينشئ assessment draft بدون اشتراط payment.
- `assessments/:id/submit` يتحقق من الدفع قبل تحويل assessment إلى `processing`.
- `payments.assessmentId` يربط عند لحظة توليد التقرير، وليس قبل بدء الأسئلة.
- واجهة `assess.tsx` تعرض payment gate بعد السؤال المفتوح وقبل شاشة processing.

**الجداول/الملفات المرتبطة**
- `lib/db/src/schema/payments.ts`
- `lib/db/src/schema/assessments.ts`
- `artifacts/api-server/src/routes/billing.ts`
- `artifacts/api-server/src/lib/ai-engine.ts`
- `artifacts/api-server/src/routes/admin.ts`
- `artifacts/inspire-web/src/pages/my-assessments.tsx`
- `artifacts/inspire-web/src/pages/admin.tsx`

**التغييرات المتوقعة**
- تحسين رسائل العميل.
- تحسين filters في الأدمن.
- اختبار retry generation end-to-end.
- تنبيه أدمن عند paid/no report.

## 7. Final Report Experience

**الهدف**
التقرير النهائي يكون واضحاً واحترافياً على desktop/mobile والطباعة.

**العلاقة بالنظام الحالي**
- التقرير يظهر في `artifacts/inspire-web/src/pages/results.tsx`.
- Operating Pattern Report يعتمد على `reportContent`.
- Copy-Ready AI Instructions تعتمد على `systemInstruction`.
- public share موجود في `artifacts/inspire-web/src/pages/share.tsx`.

**المطلوب**
- مراجعة desktop/mobile.
- مراجعة الطباعة PDF من المتصفح.
- التأكد أن النصوص بلغة واحدة حسب اختيار العميل.
- Copy-Ready AI Instructions تبقى بالإنجليزية فقط.
- لا تظهر الأقسام القديمة في التقرير الجديد:
  - Strengths
  - Risks
  - Role Analysis
  - Behavioral Signal Map
  - Starter Prompts
  - INSPIRE Scores

**التغييرات المتوقعة**
- إصلاحات CSS/print.
- ربط النصوص باللغة الصحيحة.
- التأكد من إخفاء legacy sections عند وجود Operating Pattern Report.

## 8. Arabic/English Consistency After Replit Deployment

**الهدف**
منع الخلط بين العربية والإنجليزية بعد النشر.

**العلاقة بالنظام الحالي**
- i18n موجود في `artifacts/inspire-web/src/i18n`.
- اللغة تحفظ في `localStorage` تحت `inspire.locale`.
- بعض الصفحات لا تزال hardcoded بالعربية، خصوصاً My Assessments وأجزاء من Admin.
- التقرير يعتمد على `reportLanguage` بينما واجهة التطبيق تعتمد على `locale`.

**المشكلة المتوقعة**
- المستخدم يبدأ بالإنجليزية ثم تظهر صفحات داخل الحساب بالعربية.
- التقرير قد يستخدم لغة التقرير، بينما أزرار الصفحة تستخدم لغة الواجهة.
- Replit/browser storage قد يجعل المشكلة أوضح بسبب `navigator.language` أو localStorage.

**الملفات المرتبطة**
- `artifacts/inspire-web/src/i18n/index.ts`
- `artifacts/inspire-web/src/i18n/locales/ar.ts`
- `artifacts/inspire-web/src/i18n/locales/en.ts`
- `artifacts/inspire-web/src/pages/my-assessments.tsx`
- `artifacts/inspire-web/src/pages/admin.tsx`
- `artifacts/inspire-web/src/pages/results.tsx`
- `artifacts/inspire-web/src/components/layout/Navbar.tsx`

**التغييرات المتوقعة**
- تحويل النصوص hardcoded إلى i18n keys.
- توضيح الفرق بين app locale و report language.
- تثبيت اللغة المختارة عبر كامل flow.
- اختبار عربي/إنجليزي بعد deploy.

## 9. Reuse Previous Answers For New Assessment

**الهدف**
عند عمل تحليل جديد، يستطيع المستخدم استخدام نفس الإجابات السلوكية السابقة أو الإجابة من جديد.

**العلاقة بالنظام الحالي**
- الإجابات محفوظة حالياً داخل `assessments.behavioralAnswers`.
- كل assessment له `previousAssessmentId`.
- زر إعادة تقييم موجود في My Assessments عبر `?prev=<assessmentId>`.

**القرار**
- استخدام نفس الإجابات يعني الإجابات السلوكية العامة فقط.
- لا يتم نسخ الدومين والسياق القديم كقرار نهائي.
- المستخدم يجب أن يختار الدومين من جديد.
- المستخدم يجب أن يكتب سياق/هدف جديد عند reuse حتى يتأثر التحليل الجديد.
- إذا أضيفت لاحقاً أسئلة خاصة بالدومين، يجب الإجابة عليها من جديد دائماً.

**الملفات المرتبطة**
- `artifacts/api-server/src/routes/assessments.ts`
- `artifacts/inspire-web/src/pages/assess.tsx`
- `artifacts/inspire-web/src/pages/my-assessments.tsx`
- `lib/db/src/schema/assessments.ts`

**التغييرات المتوقعة**
- Endpoint لجلب إجابات assessment سابق للمستخدم نفسه.
- واجهة خيارين:
  - answer again
  - reuse previous behavioral answers
- عند reuse يتم تخطي الأسئلة السلوكية فقط.
- إنشاء assessment جديد مستقل دائماً.

## 10. Returning Customer 50 Percent Discount

**الهدف**
كل مستخدم لديه تقييم سابق يحصل على خصم 50% على كل تقييم جديد بعد الأول.

**العلاقة بالنظام الحالي**
- الدفع في `payments`.
- أكواد الخصم في `discount_codes`.
- عدد التقييمات المكتملة يعرف من `assessments.status = completed`.
- صفحة الدفع موجودة في `assess.tsx`.

**السلوك المطلوب**
- بعد أول تقييم مكتمل، السعر للتقييمات التالية يصبح 5 دولار بدلاً من 10.
- يتم ذلك عبر كود خصم مخصص للمستخدم.
- الكود مملوك لمستخدم واحد فقط.
- الكود يستخدم مرة واحدة.
- عند استخدامه، ينشئ النظام كود جديد للتقييم التالي.
- لا يستطيع مستخدم آخر استخدام كود العميل.

**الملفات/الجداول المرتبطة**
- `lib/db/src/schema/discount-codes.ts`
- `lib/db/src/schema/payments.ts`
- `lib/db/src/schema/assessments.ts`
- `artifacts/api-server/src/routes/billing.ts`
- `artifacts/inspire-web/src/pages/assess.tsx`

**التغييرات المتوقعة**
- إضافة `user_id` اختياري إلى `discount_codes`.
- توليد كود 50% خاص للمستخدم عند وجود تقييم مكتمل سابق.
- تطبيق الكود تلقائياً في صفحة الدفع.
- التحقق من ownership عند validate/create-order/free-order.

## 11. Assessment History And Instruction Analytics

**الهدف**
تجهيز النظام لاحقاً لتحليل فائدة التعليمات الناتجة ومدى تأثرها بتغير الإجابات والدومين.

**العلاقة بالنظام الحالي**
- كل مستخدم لديه `userId`.
- كل تحليل لديه `assessmentId`.
- كل تحليل مرتبط بالمستخدم.
- الإجابات محفوظة حالياً كـ JSON داخل `assessments`.
- التقرير والتعليمات محفوظة داخل `assessments`.
- feedback مرتبط بكل assessment.
- `previousAssessmentId` موجود للمقارنة.

**القرار الحالي**
- لا نعمل refactor كبير قبل الإطلاق.
- التخزين الحالي داخل `assessments` مقبول للإطلاق.
- بعد الإطلاق نضيف طبقة analytics منظمة.

**الهيكل المستقبلي المقترح**
- `assessment_answers`
  - `assessment_id`
  - `question_id`
  - `option_id`
- `assessment_outputs`
  - `assessment_id`
  - `report_content`
  - `system_instruction`
  - `instruction_version`
  - `ai_provider`
  - `ai_model`
  - `generated_at`
- `assessment_feedback`
  - `assessment_id`
  - `rating`
  - useful/missing fields

**الأسئلة التحليلية لاحقاً**
- هل التعليمات مفيدة؟
- هل التقييم يتحسن؟
- ماذا يتغير عندما تتغير الإجابات؟
- ماذا يتغير عندما يتغير الدومين؟
- أي أنماط تعطي تقارير/تعليمات أعلى تقييماً؟
- هل تغير التعليمات بسبب تغيير إجابات العميل أم بسبب تغيير prompt/system version؟

**التغييرات المتوقعة لاحقاً**
- migration تفصل الإجابات والمخرجات.
- backfill من JSON الحالي.
- إضافة `instruction_version`.
- تقارير أدمن/analytics جديدة.

## 12. Production Launch Readiness Checklist

**الهدف**
قائمة ما قبل الإعلان.

**المطلوب**
- إعداد env production النهائي.
- تشغيل migrations المطلوبة.
- اختبار Replit deployment بعد أي تغيير.
- اختبار domain.
- اختبار email.
- اختبار admin.
- اختبار payment.
- اختبار retry/failure recovery.
- اختبار feedback/rating.
- اختبار عربي/إنجليزي.
- اختبار desktop/mobile.
- اختبار print/PDF.

**ملفات/مناطق مرتبطة**
- `.env.example`
- `replit.md`
- `artifacts/api-server`
- `artifacts/inspire-web`
- `lib/db/migrations`
- Resend dashboard
- PayPal dashboard
- Cloudflare/DNS

**ملاحظة تنفيذ**
أي تغيير بعد هذه القائمة يحتاج:
- typecheck
- lint
- build للحزم المتأثرة
- deploy
- اختبار الدومين الحي
