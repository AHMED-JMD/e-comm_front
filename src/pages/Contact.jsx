import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiTag,
  FiMessageSquare,
  FiSend,
  FiCheckCircle,
  FiMapPin,
  FiClock,
  FiArrowLeft,
} from "react-icons/fi";
import Spinner from "../components/Spinner";
import apiClient, { extractApiError } from "../utils/api";
import { isValidEmail } from "../utils/validators";

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
  // Honeypot — hidden from humans, checked by the API.
  website: "",
};

const SUBJECT_PRESETS = [
  "الانضمام كمتجر",
  "استفسار عن طلب",
  "مشكلة تقنية",
  "شراكة تجارية",
  "اقتراح أو ملاحظة",
];

const CONTACT_CHANNELS = [
  {
    icon: FiMail,
    label: "البريد الإلكتروني",
    value: "support@luma-store.com",
    href: "mailto:support@luma-store.com",
  },
  {
    icon: FiPhone,
    label: "الهاتف / واتساب",
    value: "+249 900 000 000",
    href: "tel:+249900000000",
  },
  {
    icon: FiMapPin,
    label: "العنوان",
    value: "الخرطوم، السودان",
  },
  {
    icon: FiClock,
    label: "أوقات العمل",
    value: "السبت – الخميس، 9 ص – 6 م",
  },
];

/** Shown in place of the form once the message reaches the inbox. */
function SuccessCard({ message, onSendAnother }) {
  return (
    <div className="text-center py-10 animate-fade-up">
      <span className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
        <FiCheckCircle size={40} />
      </span>
      <h2 className="text-2xl font-display font-black text-ink mb-3">
        وصلتنا رسالتك!
      </h2>
      <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
        {message}
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={onSendAnother}
          className="btn-primary inline-flex items-center gap-2"
        >
          إرسال رسالة أخرى
        </button>
        <Link to="/" className="btn-outline inline-flex items-center gap-2">
          <FiArrowLeft />
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

function Field({ id, label, icon: Icon, error, children, hint }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-bold text-gray-700 mb-2"
      >
        {label}
        {hint && (
          <span className="font-medium text-gray-400 mr-1.5">{hint}</span>
        )}
      </label>
      <div className="relative">
        <Icon
          className={`absolute right-3.5 top-4 pointer-events-none ${
            error ? "text-red-400" : "text-gray-400"
          }`}
          size={19}
        />
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name] || errors.submit) {
      setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
    }
  };

  const validate = () => {
    const next = {};

    if (form.name.trim().length < 3) {
      next.name = "الاسم مطلوب (3 أحرف على الأقل)";
    }
    if (!form.email.trim()) {
      next.email = "البريد الإلكتروني مطلوب";
    } else if (!isValidEmail(form.email.trim())) {
      next.email = "البريد الإلكتروني غير صالح";
    }
    if (form.phone.trim() && form.phone.replace(/[\s\-+]/g, "").length < 8) {
      next.phone = "رقم الهاتف غير صالح";
    }
    if (form.subject.trim().length < 3) {
      next.subject = "الموضوع مطلوب";
    }
    if (form.message.trim().length < 10) {
      next.message = "الرسالة قصيرة جداً (10 أحرف على الأقل)";
    }

    return next;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSending(true);
    setErrors({});

    try {
      // Sending mail is slower than a normal read, so this call gets a longer
      // budget than the client's 10s default.
      const { data } = await apiClient.post(
        "/contact",
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          subject: form.subject.trim(),
          message: form.message.trim(),
          website: form.website,
        },
        { timeout: 45000 },
      );

      setSuccessMessage(
        data.message || "تم إرسال رسالتك بنجاح. سنتواصل معك في أقرب وقت.",
      );
      setForm(EMPTY_FORM);
    } catch (error) {
      setErrors({
        submit: extractApiError(
          error,
          "تعذر إرسال رسالتك حالياً. حاول مرة أخرى بعد قليل.",
        ),
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-canvas">
      {/* Hero */}
      <section className="relative overflow-hidden bg-mesh-hero text-white py-20 px-4">
        <div className="blob w-96 h-96 bg-white/20 -top-24 right-1/4" />
        <div className="blob w-80 h-80 bg-pink-400/30 -bottom-32 left-10 [animation-delay:2s]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="badge bg-white/15 text-white mb-5">نسعد بخدمتك</span>
          <h1 className="text-4xl md:text-5xl font-display font-black mb-5">
            تواصل معنا
          </h1>
          <p className="text-lg text-white/85 leading-relaxed">
            سواء كنت متجراً يرغب في الانضمام، أو مشترياً لديه استفسار — اكتب لنا
            وسيصلك ردنا خلال يوم عمل واحد.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16 -mt-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact channels */}
          <aside className="lg:col-span-1 space-y-4">
            {CONTACT_CHANNELS.map(({ icon: Icon, label, value, href }) => {
              const body = (
                <>
                  <span className="w-12 h-12 shrink-0 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Icon size={22} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-bold text-gray-500 mb-0.5">
                      {label}
                    </span>
                    <span className="block font-bold text-ink truncate">
                      {value}
                    </span>
                  </span>
                </>
              );

              return href ? (
                <a
                  key={label}
                  href={href}
                  className="card !p-5 flex items-center gap-4 hover:shadow-card-hover hover:-translate-y-0.5 transition-all"
                >
                  {body}
                </a>
              ) : (
                <div key={label} className="card !p-5 flex items-center gap-4">
                  {body}
                </div>
              );
            })}

            <div className="card !p-5 bg-gradient-to-br from-blue-600 to-purple-600 !border-0 text-white">
              <h3 className="font-display font-black text-lg mb-2">
                هل أنت متجر؟
              </h3>
              <p className="text-sm text-white/85 leading-relaxed mb-4">
                أنشئ حسابك وابدأ البيع مجاناً، أو راسلنا لنساعدك في الإعداد.
              </p>
              <Link
                to="/register"
                disabled
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-purple-700 font-bold rounded-full text-sm hover:-translate-y-0.5 transition-all"
              >
                إنشاء حساب متجر
                <FiArrowLeft />
              </Link>
            </div>
          </aside>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card shadow-2xl !p-7 md:!p-10">
              {successMessage ? (
                <SuccessCard
                  message={successMessage}
                  onSendAnother={() => setSuccessMessage("")}
                />
              ) : (
                <>
                  <h2 className="text-2xl font-display font-black text-ink mb-2">
                    أرسل لنا رسالة
                  </h2>
                  <p className="text-gray-500 text-sm mb-8">
                    املأ النموذج وسنرد عليك على بريدك الإلكتروني.
                  </p>

                  {errors.submit && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl">
                      <p className="text-red-700 text-sm text-center">
                        {errors.submit}
                      </p>
                    </div>
                  )}

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                    noValidate
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field
                        id="name"
                        label="الاسم الكامل"
                        icon={FiUser}
                        error={errors.name}
                      >
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="محمد أحمد"
                          className={`input-field pr-11 ${errors.name ? "border-red-400 focus:ring-red-500" : ""}`}
                        />
                      </Field>

                      <Field
                        id="email"
                        label="البريد الإلكتروني"
                        icon={FiMail}
                        error={errors.email}
                      >
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="name@example.com"
                          className={`input-field pr-11 ${errors.email ? "border-red-400 focus:ring-red-500" : ""}`}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Field
                        id="phone"
                        label="رقم الهاتف"
                        hint="(اختياري)"
                        icon={FiPhone}
                        error={errors.phone}
                      >
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="09xxxxxxxx"
                          className={`input-field pr-11 ${errors.phone ? "border-red-400 focus:ring-red-500" : ""}`}
                        />
                      </Field>

                      <Field
                        id="subject"
                        label="الموضوع"
                        icon={FiTag}
                        error={errors.subject}
                      >
                        <input
                          id="subject"
                          name="subject"
                          type="text"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="بماذا يمكننا مساعدتك؟"
                          className={`input-field pr-11 ${errors.subject ? "border-red-400 focus:ring-red-500" : ""}`}
                        />
                      </Field>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {SUBJECT_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() =>
                            setForm((prev) => ({ ...prev, subject: preset }))
                          }
                          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                            form.subject === preset
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-700"
                          }`}
                        >
                          {preset}
                        </button>
                      ))}
                    </div>

                    <Field
                      id="message"
                      label="الرسالة"
                      icon={FiMessageSquare}
                      error={errors.message}
                    >
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        maxLength={3000}
                        value={form.message}
                        onChange={handleChange}
                        placeholder="اكتب تفاصيل رسالتك هنا..."
                        className={`input-field pr-11 resize-y ${errors.message ? "border-red-400 focus:ring-red-500" : ""}`}
                      />
                    </Field>
                    <p className="text-xs text-gray-400 -mt-3">
                      {form.message.length} / 3000
                    </p>

                    {/* Honeypot — hidden from users, bots fill it and get rejected. */}
                    <input
                      type="text"
                      name="website"
                      value={form.website}
                      onChange={handleChange}
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                      className="absolute opacity-0 w-0 h-0 -z-10"
                    />

                    <button
                      type="submit"
                      disabled={isSending}
                      className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSending ? (
                        <>
                          <Spinner className="w-5 h-5 border-2 border-white/40 border-t-white" />
                          <span>جاري الإرسال...</span>
                        </>
                      ) : (
                        <>
                          <FiSend />
                          <span>إرسال الرسالة</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
