const API_BASE = 'http://localhost:5000/api/datapath';

export async function getAllData() {
  const response = await fetch(`${API_BASE}/all`);
  if (!response.ok) {
    throw new Error('Unable to fetch records');
  }
  return response.json();
}

export async function createData(payload) {
  const response = await fetch(`${API_BASE}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || 'Unable to save record');
  }

  return response.json();
}

export async function deleteData(id) {
  const response = await fetch(`${API_BASE}/delete/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || 'Unable to delete record');
  }
  return response.json();
}

export async function updateData(id, payload) {
  const response = await fetch(`${API_BASE}/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    throw new Error(errorBody?.message || 'Unable to update record');
  }

  return response.json();
}
