import React, { useEffect, useState } from 'react';

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

// Define a default empty book.
const emptyBook: Book = {
  bookId: 0,
  title: '',
  author: '',
  publisher: '',
  isbn: '',
  classification: '',
  category: '',
  pageCount: 0,
  price: 0,
};

const AdminBooks: React.FC = () => {
  // State for the list of books.
  const [books, setBooks] = useState<Book[]>([]);
  // If editing is null, we're adding a new book.
  const [editing, setEditing] = useState<Book | null>(null);
  // The form state, initially empty.
  const [form, setForm] = useState<Book>(emptyBook);

  // Fetch the list of books.
  const load = async () => {
    const res = await fetch('/api/books?pageSize=999');
    const json = await res.json();
    setBooks(json.data);
  };

  useEffect(() => {
    load();
  }, []);

  // Handle input changes.
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // For numeric fields, convert the value to a number.
    if (name === 'pageCount' || name === 'price') {
      setForm({ ...form, [name]: value ? Number(value) : 0 });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Save the book (either add or update).
  const save = async () => {
    const method = editing ? 'PUT' : 'POST';
    const baseUrl = '/api/books';
    // For new books, force BookId to 0 so the database auto-generates an ID.
    const newForm = editing ? form : { ...form, bookId: 0 };
    const url = editing ? `${baseUrl}/${newForm.bookId}` : baseUrl;
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newForm),
    });
    setEditing(null);
    setForm(emptyBook);
    load();
  };

  // Load the selected book into the form for editing.
  const edit = (b: Book) => {
    setEditing(b);
    setForm(b);
  };

  // Delete a book.
  const del = async (id: number) => {
    if (!window.confirm('Delete this book?')) return;
    await fetch(`/api/books/${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div className="row">
      {/* Form Column */}
      <div className="col-md-4">
        <h4>{editing ? 'Edit Book' : 'Add Book'}</h4>
        {['title', 'author', 'publisher', 'isbn', 'classification', 'category', 'pageCount', 'price'].map((field) => (
          <div className="mb-2" key={field}>
            <input
              className="form-control"
              name={field}
              placeholder={field}
              value={(form as any)[field]}
              onChange={onChange}
            />
          </div>
        ))}
        <button className="btn btn-primary me-2" onClick={save}>
          {editing ? 'Update' : 'Add'}
        </button>
        {editing && (
          <button className="btn btn-secondary" onClick={() => { setEditing(null); setForm(emptyBook); }}>
            Cancel
          </button>
        )}
      </div>

      {/* Books Table Column */}
      <div className="col-md-8">
        <h4>Books</h4>
        <table className="table table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Author</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.bookId}>
                <td>{b.bookId}</td>
                <td>{b.title}</td>
                <td>{b.author}</td>
                <td>
                  <button className="btn btn-sm btn-warning me-1" onClick={() => edit(b)}>
                    Edit
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => del(b.bookId)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBooks;
