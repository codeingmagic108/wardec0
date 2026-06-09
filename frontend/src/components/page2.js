import React, { useEffect, useState } from 'react';
import { getAllData, createData, deleteData, updateData } from '../api/dataApi';

const Page2 = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    rollno: '',
    name: '',
    mobile: '',
    city: '',
    marks: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllData();
      setItems(data);
    } catch (err) {
      setError(err.message || 'Unable to load data.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const payload = {
        rollno: form.rollno,
        name: form.name,
        mobile: form.mobile,
        city: form.city,
        marks: Number(form.marks),
      };

      if (editingId) {
        await updateData(editingId, payload);
        setEditingId(null);
      } else {
        await createData(payload);
      }

      setForm({ rollno: '', name: '', mobile: '', city: '', marks: '' });
      await loadItems();
    } catch (err) {
      setError(err.message || 'Save failed.');
    }
  };

  const handleEdit = (item) => {
    setForm({
      rollno: item.rollno || '',
      name: item.name || '',
      mobile: item.mobile || '',
      city: item.city || '',
      marks: item.marks != null ? String(item.marks) : '',
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setForm({ rollno: '', name: '', mobile: '', city: '', marks: '' });
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    setError('');
    try {
      await deleteData(id);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Delete failed.');
    }
  };

  return (
    <section className="data-page">
      <div className="data-card">
        <h2>Add a Student</h2>
        <form className="data-form" onSubmit={handleSubmit}>
          <label>
            Roll No
            <input
              name="rollno"
              value={form.rollno}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Mobile
            <input
              name="mobile"
              type="tel"
              value={form.mobile}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            City
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              required
            />
          </label>
          <label className="full-width">
            Marks
            <input
              name="marks"
              type="number"
              value={form.marks}
              onChange={handleChange}
              required
            />
          </label>
          <div className="full-width" style={{ display: 'flex', alignItems: 'center' }}>
            <button type="submit">{editingId ? 'Update Record' : 'Save Record'}</button>
            {editingId && (
              <button type="button" onClick={handleCancelEdit} className="cancel-button">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="data-card">
        <div className="data-card-header">
          <h2>Saved Records</h2>
          <button type="button" onClick={loadItems} className="refresh-button">
            Refresh
          </button>
        </div>
        {loading && <p>Loading records…</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !items.length && <p>No records found.</p>}
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>City</th>
              <th>Mobile</th>
              <th>Marks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.rollno}</td>
                <td>{item.city}</td>
                <td>{item.mobile}</td>
                <td>{item.marks}</td>
                <td>
                  <button type="button" className="edit-button" onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button type="button" className="delete-button" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Page2;
