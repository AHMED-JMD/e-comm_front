import { FiXCircle } from "react-icons/fi";
import { ORDER_FLOW, getStatusMeta } from "../utils/orderStatus";

/**
 * Horizontal progress track for a single order: تم الطلب → التجهيز → الشحن → الاستلام.
 */
export default function OrderStatusTimeline({ status, compact = false }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-100">
        <span className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 text-white flex items-center justify-center">
          <FiXCircle size={20} />
        </span>
        <div>
          <p className="font-bold text-red-700">تم إلغاء الطلب</p>
          <p className="text-xs text-red-600/80">
            تمت إعادة الكميات إلى المخزون
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = Math.max(ORDER_FLOW.indexOf(status), 0);

  return (
    <div className="relative">
      {/* Track */}
      <div className="absolute top-5 right-5 left-5 h-1 rounded-full bg-gray-100" />
      <div
        className="absolute top-5 right-5 h-1 rounded-full bg-gradient-to-l from-blue-600 to-green-500 transition-all duration-700"
        style={{
          width: `calc((100% - 2.5rem) * ${
            currentIndex / (ORDER_FLOW.length - 1)
          })`,
        }}
      />

      <ol className="relative flex items-start justify-between">
        {ORDER_FLOW.map((flowStatus, index) => {
          const meta = getStatusMeta(flowStatus);
          const isDone = index <= currentIndex;
          const isCurrent = index === currentIndex;
          const StepIcon = meta.Icon;

          return (
            <li
              key={flowStatus}
              className="flex flex-col items-center text-center flex-1 min-w-0"
            >
              <span
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white transition-all ${
                  isDone
                    ? `bg-gradient-to-br ${meta.gradient} text-white shadow-md`
                    : "bg-gray-100 text-gray-400"
                } ${isCurrent ? "ring-4 ring-blue-100 scale-110" : ""}`}
              >
                <StepIcon size={18} />
              </span>

              <span
                className={`mt-2 text-xs font-bold px-1 ${
                  isDone ? "text-gray-900" : "text-gray-400"
                }`}
              >
                {meta.step}
              </span>

              {!compact && isCurrent && (
                <span className="text-[11px] text-gray-500 mt-0.5 px-1">
                  {meta.description}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
