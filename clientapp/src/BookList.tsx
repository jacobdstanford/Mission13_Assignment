import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

const BookList: React.FC = () => {

  const [showToast, setShowToast] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();


  const handleAddToCart = (book: Book) => {
    addToCart({
      bookId: book.bookId,
      title: book.title,
      price: book.price,
      quantity: 1,
    });
    setShowToast(true);


    setTimeout(() => setShowToast(false), 3000);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 5,
    totalCount: 0,
    totalPages: 0,
  });


  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');


  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5260/api/books/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const data = await response.json();
      setCategories(data); // should be an array of strings
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };


  const fetchBooks = async (page: number, size: number, order: string, category: string) => {
    setLoading(true);

    try {
      const url = new URL('http://localhost:5260/api/books');
      url.searchParams.append('pageNumber', page.toString());
      url.searchParams.append('pageSize', size.toString());
      url.searchParams.append('sortOrder', order);
      if (category) {
        url.searchParams.append('category', category);
      }

      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
      }

      const data = await response.json();
      setBooks(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching books:', error);
    }

    setLoading(false);
  };


  useEffect(() => {
    fetchBooks(currentPage, pageSize, sortOrder, selectedCategory);

  }, [currentPage, pageSize, sortOrder, selectedCategory]);


  useEffect(() => {
    fetchCategories();
  }, []);


  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };


  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(parseInt(e.target.value));
    setCurrentPage(1);
  };


  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };


  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  if (loading) {
    return <div>Loading books...</div>;
  }

  return (
    <div className="container mt-4">

      {showToast && (
        <div className="toast show position-absolute top-0 end-0 m-2" role="alert">
          <div className="toast-header">
            <strong className="me-auto">Cart Update</strong>
          </div>
          <div className="toast-body">
            Book added to cart!
          </div>
        </div>
      )}


      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="categorySelect" className="form-label">
            Filter by Category:
          </label>
          <select
            id="categorySelect"
            className="form-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-secondary" onClick={toggleSortOrder}>
            Sort by Title ({sortOrder === 'asc' ? 'Ascending' : 'Descending'})
          </button>
        </div>

        <div className="col-md-4 d-flex flex-column align-items-start">
          <label htmlFor="pageSizeSelect" className="form-label">
            Results per page:
          </label>
          <select
            id="pageSizeSelect"
            className="form-select"
            value={pageSize}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>


      <table className="table table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.bookId}>
              <td>{b.title}</td>
              <td>{b.author}</td>
              <td>{b.publisher}</td>
              <td>{b.isbn}</td>
              <td>{b.classification}</td>
              <td>{b.category}</td>
              <td>{b.pageCount}</td>
              <td>${b.price.toFixed(2)}</td>
              <td>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleAddToCart(b)}
                >
                  Add to Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="d-flex justify-content-center align-items-center my-3">
        <button
          className="btn btn-outline-primary me-2"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
        >
          Previous
        </button>

        <span>
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>

        <button
          className="btn btn-outline-primary ms-2"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= pagination.totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookList;
