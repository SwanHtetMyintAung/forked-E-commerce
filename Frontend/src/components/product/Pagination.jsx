import React,{useState} from "react";
import './Pagination.css'


export default function Pagination({ totalPages, currentPage, onPageChange }) {
    //const [displayedPages, setDisplayedPages] = useState([]);
  
    // Logic to generate page numbers for display
    const getDisplayedPages = () => {
      const maxPagesToShow = 3; // You can adjust this to show more or fewer pages
  
      if (totalPages <= maxPagesToShow) {
        // If there are fewer pages than the maximum, display all pages
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
  
      let pages = [];
      const range = Math.min(maxPagesToShow, totalPages);
  
      if (currentPage <= 3) {
        // If we're near the start, show the first few pages and the last page
        for (let i = 1; i <= 3; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // If we're near the end, show the first page and the last few pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Otherwise, show the current page with a range of pages around it
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
  
      return pages;
    };
  
    // Get the list of pages to display
    const displayedPages = getDisplayedPages();
  
    return (
      <div className="pagination-container">
        {/* Previous Button */}
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Prev
        </button>
  
        {/* Render page numbers with ellipses */}
        {displayedPages.map((page, index) => (
          page === '...' ? (
            <span key={index} className="pagination-ellipsis">...</span>
          ) : (
            <button 
              key={index} 
              onClick={() => onPageChange(page)} 
              className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </button>
          )
        ))}
  
        {/* Next Button */}
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    );
  }