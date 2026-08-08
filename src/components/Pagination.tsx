interface PaginationProps{
    totalPages:number,
    currentPage:number,
    onClick:(page:number)=>void,
}

function Pagination ({totalPages,currentPage,onClick}:PaginationProps){

      
      const pages = getVisiblePages(currentPage, totalPages);

      function getVisiblePages(
        currentPage: number,
        totalPages: number,
      ): (number | "...")[] {
        if (totalPages <= 7) {
          return Array.from({ length: totalPages }, (_, i) => i + 1);
        }
    
        // Beginning
        if (currentPage <= 4) {
          return [1, 2, 3, 4, 5, "...", totalPages];
        }
    
        // End
        if (currentPage >= totalPages - 3) {
          return [
            1,
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
          ];
        }
    
        // Middle
        return [
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        ];
      }


    return (
         <footer className="footer">
          {pages.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`${page}-${index}`} className="ellipsis">
                  ...
                </span>
              );
            }
            return (
              <button
                key={`${page}-${index}`}
                onClick={()=>onClick(page)}
                className={currentPage === page ? "active-page" : ""}
              >
                {page}
              </button>
            );
          })}
        </footer>
    )
}

export default Pagination;