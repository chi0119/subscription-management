import Link from "next/link";

/**
 * 一覧ページ：データが0件の時の表示
 */

export const EmptyState = () => {
  return (
    /* データが0件の場合 */
    <div className="sm:w-2/3 w-full mx-auto mt-10 p-10 flex flex-col items-center justify-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200">
      <div className="text-gray-300 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" />
          <path d="M3 10h18" />
          <path d="m15 19 2 2 4-4" />
        </svg>
      </div>
      <p className="text-gray-500 font-medium">
        登録されたサブスクはありません
      </p>
      <p className="text-gray-400 text-sm mt-1">
        <Link href="/new" className="text-emerald-600 hover:underline">
          新規登録ページ
        </Link>
        から追加できます
      </p>
    </div>
  );
};
