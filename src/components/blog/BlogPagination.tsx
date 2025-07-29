import React from "react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const BlogPagination: React.FC<BlogPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  return (
    <nav aria-label="Page navigation" className="d-flex justify-content-center mt-4">
      <ul className="pagination rounded shadow-sm p-2 bg-white gap-1">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <a
            className="page-link page-link-prev rounded"
            href="#"
            aria-label="Previous"
            tabIndex={currentPage === 1 ? -1 : undefined}
            aria-disabled={currentPage === 1}
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            style={{ minWidth: 40, textAlign: 'center' }}
          >
            <span aria-hidden="true">
              <i className="icon-long-arrow-left"></i>
            </span>
          </a>
        </li>

        {[...Array(totalPages)].map((_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
            aria-current={currentPage === index + 1 ? "page" : undefined}
          >
            <a
              className={`page-link rounded ${currentPage === index + 1 ? 'bg-primary text-white fw-bold' : ''}`}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onPageChange(index + 1);
              }}
              style={{ minWidth: 40, textAlign: 'center' }}
            >
              {index + 1}
            </a>
          </li>
        ))}

        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
          <a
            className="page-link page-link-next rounded"
            href="#"
            aria-label="Next"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            style={{ minWidth: 40, textAlign: 'center' }}
          >
            <span aria-hidden="true">
              <i className="icon-long-arrow-right"></i>
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default BlogPagination;
