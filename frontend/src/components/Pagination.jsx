export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2.5 py-1 text-xs sm:text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Previous</span>
        <span className="sm:hidden">Prev</span>
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-2.5 py-1 text-xs sm:text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-primary-50"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-2.5 py-1 text-xs sm:text-sm rounded-md ${
            page === currentPage
              ? 'bg-primary-500 text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-primary-50'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-2.5 py-1 text-xs sm:text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-primary-50"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2.5 py-1 text-xs sm:text-sm rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <span className="sm:hidden">Next</span>
      </button>
    </div>
  );
};
