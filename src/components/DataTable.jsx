import { useState } from "react";
import { FiChevronDown, FiInbox } from "react-icons/fi";
import Spinner from "./Spinner";

/**
 * Modern admin table: a rounded card on desktop and a stack of readable cards
 * on mobile, driven by one column definition.
 *
 * columns: [{ key, header, render(row), align, hideOnMobile, className }]
 */
export default function DataTable({
  columns,
  rows,
  rowKey = (row) => row.id,
  expandedContent,
  isLoading = false,
  emptyTitle = "لا توجد بيانات",
  emptyDescription = "لم يتم العثور على نتائج مطابقة.",
  emptyIcon,
  footer,
}) {
  const [expandedKey, setExpandedKey] = useState(null);
  const isExpandable = typeof expandedContent === "function";

  const toggleRow = (key) =>
    setExpandedKey((previous) => (previous === key ? null : key));

  if (isLoading) {
    return (
      <div className="flex justify-center py-16 rounded-3xl border border-gray-100 bg-white">
        <Spinner className="w-9 h-9 border-4 border-pink-200 border-t-pink-600" />
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="text-center py-16 rounded-3xl border-2 border-dashed border-gray-200 bg-white/60">
        <span className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-pink-50 text-pink-500 flex items-center justify-center">
          {emptyIcon || <FiInbox size={28} />}
        </span>
        <p className="font-bold text-gray-800 mb-1">{emptyTitle}</p>
        <p className="text-sm text-gray-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop */}
      <div className="hidden md:block rounded-3xl border border-gray-100 bg-white shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gradient-to-l from-gray-50 to-blue-50/50 border-b border-gray-100">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`text-right px-4 py-3.5 font-black text-xs uppercase tracking-wider text-gray-500 whitespace-nowrap ${column.className || ""}`}
                  >
                    {column.header}
                  </th>
                ))}
                {isExpandable && <th className="w-12 px-4 py-3.5" />}
              </tr>
            </thead>

            <tbody>
              {rows.map((row, index) => {
                const key = rowKey(row);
                const isExpanded = expandedKey === key;

                return (
                  <tr
                    key={key}
                    className={`group border-b border-gray-50 last:border-0 transition-colors hover:bg-pink-50/40 ${
                      index % 2 === 1 ? "bg-gray-50/40" : ""
                    } ${isExpanded ? "bg-pink-50/60" : ""}`}
                  >
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        className={`px-4 py-3.5 align-middle text-gray-700 ${column.cellClassName || ""}`}
                      >
                        {column.render(row)}
                      </td>
                    ))}

                    {isExpandable && (
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          onClick={() => toggleRow(key)}
                          className="w-9 h-9 rounded-xl border border-gray-200 text-gray-500 flex items-center justify-center hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 transition-colors"
                          aria-label="تفاصيل"
                        >
                          <FiChevronDown
                            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Expanded panel lives outside the table so its layout is free-form */}
        {isExpandable &&
          rows
            .filter((row) => rowKey(row) === expandedKey)
            .map((row) => (
              <div
                key={`${rowKey(row)}-details`}
                className="border-t border-gray-100 bg-pink-50/30 p-5 animate-fade-up"
              >
                {expandedContent(row)}
              </div>
            ))}
      </div>

      {/* Mobile */}
      <div className="md:hidden space-y-3">
        {rows.map((row) => {
          const key = rowKey(row);
          const isExpanded = expandedKey === key;
          const [primaryColumn, ...restColumns] = columns;

          return (
            <article
              key={key}
              className="rounded-3xl border border-gray-100 bg-white shadow-card p-4 space-y-3"
            >
              <div className="font-bold text-gray-900">
                {primaryColumn.render(row)}
              </div>

              <dl className="space-y-2">
                {restColumns
                  .filter((column) => !column.hideOnMobile)
                  .map((column) => (
                    <div
                      key={column.key}
                      className="flex items-start justify-between gap-3 text-sm"
                    >
                      <dt className="text-gray-500 shrink-0">
                        {column.header}
                      </dt>
                      <dd className="text-gray-800 text-left min-w-0">
                        {column.render(row)}
                      </dd>
                    </div>
                  ))}
              </dl>

              {isExpandable && (
                <>
                  <button
                    type="button"
                    onClick={() => toggleRow(key)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600"
                  >
                    التفاصيل
                    <FiChevronDown
                      className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="pt-2 animate-fade-up">
                      {expandedContent(row)}
                    </div>
                  )}
                </>
              )}
            </article>
          );
        })}
      </div>

      {footer}
    </div>
  );
}

/** Consistent pager used under the admin tables. */
export function TablePagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <p className="text-xs text-gray-500">
        صفحة <span className="font-bold text-gray-700">{page}</span> من{" "}
        {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 text-gray-700 hover:bg-pink-50 hover:border-pink-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="px-4 py-2 text-sm font-bold rounded-xl border border-gray-200 text-gray-700 hover:bg-pink-50 hover:border-pink-200 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
        >
          التالي
        </button>
      </div>
    </div>
  );
}

/** Small round icon action button for table rows. */
export function TableAction({
  onClick,
  disabled,
  title,
  tone = "blue",
  loading = false,
  children,
}) {
  const tones = {
    blue: "border-pink-200 text-pink-700 bg-pink-50 hover:bg-pink-100",
    red: "border-red-200 text-red-700 bg-red-50 hover:bg-red-100",
    green: "border-green-200 text-green-700 bg-green-50 hover:bg-green-100",
    gray: "border-gray-200 text-gray-600 bg-gray-50 hover:bg-gray-100",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${tones[tone]}`}
    >
      {loading ? (
        <Spinner className="w-3.5 h-3.5 border-2 border-current/30 border-t-current" />
      ) : (
        children
      )}
    </button>
  );
}
