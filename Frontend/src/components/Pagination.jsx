import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  const maxVisiblePages = 3;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    if (currentPage <= Math.ceil(maxVisiblePages / 2)) {
      for (let i = 1; i <= maxVisiblePages; i++) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (
        let i = currentPage - Math.floor(maxVisiblePages / 2) + (maxVisiblePages%2 === 0 ? 1 : 0);
        i <= currentPage + Math.floor(maxVisiblePages / 2);
        i++
      ) {
        pageNumbers.push(i);
      }
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }
  }

  return (
    <nav className='mt-4' aria-label="Page navigation">
      <ul className="pagination justify-content-center">
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage - 1)}>
            Previous
          </button>
        </li>
        {pageNumbers.map((page, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === page ? 'active' : ''} ${
              page === '...' ? 'disabled' : ''
            }`}
          >
            <button
              className="page-link"
              onClick={() => typeof page === 'number' && onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onPageChange(currentPage + 1)}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;