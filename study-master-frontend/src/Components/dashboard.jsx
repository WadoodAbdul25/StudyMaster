import { useCallback, useEffect, useState } from 'react';
import UploadModal from './uploadModal';
import { apiRequest, clearStoredAuth, getStoredAuth, setStoredAuth } from '../api';

const defaultCourse = {
  name: 'General Course',
  courseCode: 'GEN 101',
  semester: 'Current Semester',
  description: 'Default course for uploaded study materials',
};

export default function Dashboard() {
  const [auth, setAuth] = useState(getStoredAuth);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState('');

  const fetchAssignments = useCallback(async (courseId, token) => {
    if (!courseId || !token) {
      setAssignments([]);
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest(`/courses/${courseId}/tasks`, { token });
      setAssignments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const ensureCourse = useCallback(async (token) => {
    const data = await apiRequest('/courses', { token });

    if (data.length > 0) {
      setCourses(data);
      setSelectedCourseId((currentId) => currentId || data[0]._id);
      return data[0]._id;
    }

    const course = await apiRequest('/courses', {
      token,
      method: 'POST',
      body: defaultCourse,
    });

    setCourses([course]);
    setSelectedCourseId(course._id);
    return course._id;
  }, []);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const courseId = await ensureCourse(auth.token);
        await fetchAssignments(courseId, auth.token);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadDashboard();
  }, [auth?.token, ensureCourse, fetchAssignments]);

  useEffect(() => {
    if (auth?.token && selectedCourseId) {
      setLoading(true);
      fetchAssignments(selectedCourseId, auth.token);
    }
  }, [auth?.token, fetchAssignments, selectedCourseId]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body =
        authMode === 'register'
          ? authForm
          : { email: authForm.email, password: authForm.password };
      const data = await apiRequest(`/auth/${authMode}`, {
        method: 'POST',
        body,
      });

      setStoredAuth(data);
      setAuth(data);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/tasks/${id}`, {
        token: auth.token,
        method: 'PUT',
        body: { status },
      });
      fetchAssignments(selectedCourseId, auth.token);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAssignment = async (id) => {
    if (window.confirm('Delete this assignment?')) {
      try {
        await apiRequest(`/tasks/${id}`, {
          token: auth.token,
          method: 'DELETE',
        });
        fetchAssignments(selectedCourseId, auth.token);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleLogout = () => {
    clearStoredAuth();
    setAuth(null);
    setCourses([]);
    setSelectedCourseId('');
    setAssignments([]);
  };

  if (!auth?.token) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto bg-white rounded-lg border p-6 shadow-sm">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">StudyMaster</h1>
          <p className="text-gray-600 mb-8">Sign in to view your semester plan</p>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleAuth}>
            {authMode === 'register' && (
              <input
                type="text"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                className="w-full border rounded-lg p-2 mb-3"
                placeholder="Name"
                required
              />
            )}
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              className="w-full border rounded-lg p-2 mb-3"
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Password"
              required
            />
            <button type="submit" disabled={loading} className="bg-indigo-500 text-white px-4 py-2 rounded-lg w-full disabled:opacity-50">
              {loading ? 'Loading...' : authMode === 'login' ? 'Log in' : 'Sign up'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setError('');
              setAuthMode(authMode === 'login' ? 'register' : 'login');
            }}
            className="text-indigo-500 hover:text-indigo-700 text-sm mt-4"
          >
            {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Log in'}
          </button>
        </div>
      </div>
    );
  }

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
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Semester Plan</h1>
            <p className="text-gray-600">All your assignments organized in one place</p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="text-sm border rounded-lg px-2 py-1 bg-white"
            >
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
            <button onClick={() => setShowUpload(true)} className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg">
              Upload syllabus
            </button>
            <button onClick={handleLogout} className="border rounded-lg px-4 py-2 text-sm">
              Log out
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center border">
            <p className="text-gray-500">No assignments yet. Upload a syllabus to get started.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {assignments.map((assignment) => (
              <div key={assignment._id} className="bg-white rounded-lg border p-5 shadow-sm hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                  <button
                    onClick={() => deleteAssignment(assignment._id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    &times;
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
                    value={assignment.status || 'pending'}
                    onChange={(e) => updateStatus(assignment._id, e.target.value)}
                    className="text-sm border rounded-lg px-2 py-1 bg-white"
                  >
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
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

      {showUpload && (
        <UploadModal
          courseId={selectedCourseId}
          token={auth.token}
          onClose={() => setShowUpload(false)}
          onUploadSuccess={() => fetchAssignments(selectedCourseId, auth.token)}
        />
      )}

      {editingAssignment && (
        <EditModal
          assignment={editingAssignment}
          token={auth.token}
          onClose={() => setEditingAssignment(null)}
          onSave={() => fetchAssignments(selectedCourseId, auth.token)}
        />
      )}
    </div>
  );
}

function EditModal({ assignment, token, onClose, onSave }) {
  const [name, setName] = useState(assignment.title);
  const [dueDate, setDueDate] = useState(assignment.dueDate?.split('T')[0] || '');
  const [description, setDescription] = useState(assignment.description || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await apiRequest(`/tasks/${assignment._id}`, {
        token,
        method: 'PUT',
        body: {
          title: name,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          description,
        },
      });
      onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Assignment</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
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
