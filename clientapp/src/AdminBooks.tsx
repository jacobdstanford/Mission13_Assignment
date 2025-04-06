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

const emptyBook: Book = {
  bookId: 0, title:'', author:'', publisher:'', isbn:'',
  classification:'', category:'', pageCount:0, price:0
};

const AdminBooks: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [editing, setEditing] = useState<Book | null>(null);
  const [form, setForm]   = useState<Book>(emptyBook);

  // fetch list
  const load = async () => {
    const res = await fetch('/api/books?pageSize=999');
    const json = await res.json();
    setBooks(json.data);
  };
  useEffect(() => { load(); }, []);

  // handle form change
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const save = async () => {
    const method = editing ? 'PUT' : 'POST';
    const url    = editing ? `/api/books/${form.bookId}` : '/api/books';
    await fetch(url, {
      method,
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(form)
    });
    setEditing(null); setForm(emptyBook); load();
  };

  const edit = (b: Book) => { setEditing(b); setForm(b); };

  const del  = async (id: number) => {
    if (!window.confirm('Delete this book?')) return;
    await fetch(`/api/books/${id}`, { method:'DELETE' });
    load();
  };

  return (
    <div className="row">
      {/* form */}
      <div className="col-md-4">
        <h4>{editing ? 'Edit Book' : 'Add Book'}</h4>
        {['title','author','publisher','isbn','classification','category','pageCount','price']
          .map(field => (
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
          <button className="btn btn-secondary" onClick={() => {
            setEditing(null); setForm(emptyBook);
          }}>
            Cancel
          </button>
        )}
      </div>

      {/* table */}
      <div className="col-md-8">
        <h4>Books</h4>
        <table className="table table-sm">
          <thead>
            <tr><th>ID</th><th>Title</th><th>Author</th><th /></tr>
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
