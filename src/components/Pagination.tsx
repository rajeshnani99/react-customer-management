import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
}) => {
  if (totalCount === 0) return null;

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalCount);

  // Generate visible page numbers with ellipsis if needed
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="pagination-bar" aria-label="Table pagination navigation">
      <div className="pagination-info">
        Showing <span className="font-semibold">{startRecord}</span> to{' '}
        <span className="font-semibold">{endRecord}</span> of{' '}
        <span className="font-semibold">{totalCount}</span> results
      </div>

      <div className="pagination-controls">
        <div className="page-size-selector">
          <label htmlFor="page-size-select" className="page-size-label">
            Rows:
          </label>
          <select
            id="page-size-select"
            className="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            aria-label="Select number of customers per page"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>

        <nav className="pagination-nav" aria-label="Pagination">
          <button
            type="button"
            className="pagination-btn prev-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>

          <div className="page-numbers-group">
            {getPageNumbers().map((p, idx) => {
              if (p === '...') {
                return (
                  <span key={`ellipsis-${idx}`} className="pagination-ellipsis">
                    …
                  </span>
                );
              }

              const pageNum = p as number;
              const isCurrent = pageNum === currentPage;

              return (
                <button
                  key={pageNum}
                  type="button"
                  className={`page-number-btn ${isCurrent ? 'active' : ''}`}
                  onClick={() => onPageChange(pageNum)}
                  aria-current={isCurrent ? 'page' : undefined}
                  aria-label={`Page ${pageNum}`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="pagination-btn next-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            Next ›
          </button>
        </nav>
      </div>
    </div>
  );
};
