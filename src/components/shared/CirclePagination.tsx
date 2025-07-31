import React from "react";

interface CirclePaginationProps {
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const CirclePagination: React.FC<CirclePaginationProps> = ({
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const getPageNumbers = () => {
    if (totalPages === 0) {
      return [];
    }

    const pages = [];
    const maxVisible = 5;

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages + 1, start + maxVisible);

    if (end - start < maxVisible) {
      start = Math.max(1, end - maxVisible);
    }

    for (let i = start; i < end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      {/* Sol ok - sayfa yoksa veya ilk sayfadaysa devre dışı */}
      <button
        className="circle-page-arrow"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={totalPages === 0 || currentPage === 1}
        aria-label="Önceki sayfa"
      >
        ‹
      </button>

      {/* Sayfa yoksa tek gri "0" göster */}
      {totalPages === 0 ? (
        <div className="circle-page-item disabled">
          <span>0</span>
        </div>
      ) : (
        getPageNumbers().map((pageNumber) => (
          <div
            key={pageNumber}
            className={`circle-page-item ${
              currentPage === pageNumber ? "active" : ""
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            <span style={{ fontSize: "16px" }}>{pageNumber}</span>
          </div>
        ))
      )}

      {/* Sağ ok - sayfa yoksa veya son sayfadaysa devre dışı */}
      <button
        className="circle-page-arrow"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={totalPages === 0 || currentPage >= totalPages}
        aria-label="Sonraki sayfa"
      >
        ›
      </button>

      <style jsx>{`
        .circle-page-item {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 4px;
          cursor: pointer;
          background-color: #f5f5f5;
          transition: all 0.2s ease;
          color: #040404;
        }

        .circle-page-item:hover {
          background-color: #e0e0e0;
          color: black;
        }

        .circle-page-item.active {
          background-color: #040404;
          color: white;
        }

        .circle-page-item.disabled {
          cursor: default;
          color: #040404;
        }

        .circle-page-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid #e0e0e0;
          background-color: #f5f5f5;
          color: #000;
          cursor: pointer;
          margin: 0 4px;
          font-size: 24px;
          font-weight: bold;
          transition: all 0.2s ease;
        }

        .circle-page-arrow:disabled {
          color: #666;
          background-color: #f9f9f9;
          border-color: #e8e8e8;
          cursor: default;
          opacity: 0.6;
        }

        .circle-page-arrow:not(:disabled):hover {
          background-color: #e0e0e0;
          border-color: #d0d0d0;
          color: #000;
        }
      `}</style>
    </div>
  );
};

export default CirclePagination;
