import { FC } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

const PaginationCustom: FC<{
  currentPage: number;
  setCurrentPage: (value: number) => void;
  pageSize: number;
  totalItems: number;
}> = ({ currentPage, setCurrentPage, pageSize, totalItems }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <Pagination className="justify-end">
      <PaginationContent>
        <PaginationItem
          className="cursor-pointer"
          onClick={() => {
            const newPage = Math.max(currentPage - 1, 1);
            setCurrentPage(newPage);
          }}
        >
          <PaginationPrevious />
        </PaginationItem>
        {pages.map((page, index, arr) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 2 && page <= currentPage + 2)
          ) {
            return (
              <PaginationItem key={page} onClick={() => setCurrentPage(page)}>
                <PaginationLink
                  className="cursor-pointer"
                  isActive={page === currentPage}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          } else if (
            page === currentPage - 3 ||
            page === currentPage + 3 ||
            index === arr.length - 1
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }
        })}

        <PaginationItem
          className="cursor-pointer"
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
        >
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationCustom;
