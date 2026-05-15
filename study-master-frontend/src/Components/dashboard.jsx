import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAssignment, setEditingAssignment] = useState(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/assignments');
      const data = await response.json();
      setAssignments(data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchAssignments();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteAssignment = async (id) => {
    if (window.confirm('Delete this assignment?')) {
      try {
        await fetch(`http://localhost:5000/api/assignments/${id}`, {
          method: 'DELETE'
        });
        fetchAssignments();
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading assignments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Semester Plan</h1>
        <p className="text-gray-600 mb-8">All your assignments organized in one place</p>

        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border">
            <p className="text-gray-500">No assignments yet. Upload a syllabus to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="bg-white rounded-lg border p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">{assignment.name}</h3>
                  <button
                    onClick={() => deleteAssignment(assignment._id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No date'}
                </p>

                {assignment.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{assignment.description}</p>
                )}

                <div className="flex justify-between items-center">
                  <select
                    value={assignment.status || 'Not Started'}
                    onChange={(e) => updateStatus(assignment._id, e.target.value)}
                    className="text-sm border rounded-lg px-2 py-1 bg-white"
                  >
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>

                  <button
                    onClick={() => setEditingAssignment(assignment)}
                    className="text-indigo-500 hover:text-indigo-700 text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingAssignment && (
        <EditModal
          assignment={editingAssignment}
          onClose={() => setEditingAssignment(null)}
          onSave={fetchAssignments}
        />
      )}
    </div>
  );
}

// Edit Modal Component
function EditModal({ assignment, onClose, onSave }) {
  const [name, setName] = useState(assignment.name);
  const [dueDate, setDueDate] = useState(assignment.dueDate?.split('T')[0] || '');
  const [description, setDescription] = useState(assignment.description || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`http://localhost:5000/api/assignments/${assignment._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, dueDate, description })
      });
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Assignment</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3"
            placeholder="Assignment name"
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4"
            placeholder="Description"
            rows="3"
          />
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex-1">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="border rounded-lg px-4 py-2 flex-1">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}