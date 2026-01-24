/**
 * 一覧ページ：データ取得中のローディング表示
 */

export const LoadingSpinner = () => {
  return (
    <div className="sm:w-2/3 w-full mx-auto flex flex-col items-center justify-center py-20">
      <div className="animate-spin text-emerald-500 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
      </div>
      <p className="text-gray-500 text-sm">データを読み込み中...</p>
    </div>
  );
};
