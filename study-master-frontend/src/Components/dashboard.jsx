import { useEffect, useState } from 'react';
import UploadModal from './uploadModal';
import { apiRequest, clearStoredAuth, getStoredAuth, setStoredAuth } from '../api';

const emptyCourse = {
  name: '',
  courseCode: '',
  semester: '',
  description: '',
};

export default function Dashboard() {
  const [auth, setAuth] = useState(getStoredAuth);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [tasks, setTasks] = useState([]);
  const [courseForm, setCourseForm] = useState(emptyCourse);
  const [editingTask, setEditingTask] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (auth?.token) {
      fetchCourses(auth.token);
    }
  }, [auth?.token]);

  useEffect(() => {
    if (auth?.token && selectedCourseId) {
      fetchTasks(selectedCourseId, auth.token);
    } else {
      setTasks([]);
    }
  }, [auth?.token, selectedCourseId]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload =
        authMode === 'register'
          ? authForm
          : { email: authForm.email, password: authForm.password };
      const data = await apiRequest(`/auth/${authMode}`, {
        method: 'POST',
        body: payload,
      });

      setStoredAuth(data);
      setAuth(data);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async (token = auth?.token) => {
    setError('');
    setLoading(true);

    try {
      const data = await apiRequest('/courses', { token });
      setCourses(data);
      setSelectedCourseId((currentId) => currentId || data[0]?._id || '');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (courseId = selectedCourseId, token = auth?.token) => {
    setError('');

    try {
      const data = await apiRequest(`/courses/${courseId}/tasks`, { token });
      setTasks(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createCourse = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const course = await apiRequest('/courses', {
        token: auth.token,
        method: 'POST',
        body: courseForm,
      });
      setCourses((currentCourses) => [...currentCourses, course]);
      setSelectedCourseId(course._id);
      setCourseForm(emptyCourse);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/tasks/${id}`, {
        token: auth.token,
        method: 'PUT',
        body: { status },
      });
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Delete this task?')) {
      return;
    }

    try {
      await apiRequest(`/tasks/${id}`, {
        token: auth.token,
        method: 'DELETE',
      });
      fetchTasks();
    } catch (err) {
      setError(err.message);
    }
  };

  const logout = () => {
    clearStoredAuth();
    setAuth(null);
    setCourses([]);
    setSelectedCourseId('');
    setTasks([]);
  };

  if (!auth?.token) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-md rounded-lg border bg-white p-6 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-gray-800">StudyMaster</h1>
          <p className="mb-6 text-sm text-gray-600">Sign in before managing courses and uploads.</p>

          {error && <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <form onSubmit={handleAuth} className="space-y-3">
            {authMode === 'register' && (
              <input
                type="text"
                value={authForm.name}
                onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                className="w-full rounded-lg border p-2"
                placeholder="Name"
                required
              />
            )}
            <input
              type="email"
              value={authForm.email}
              onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
              className="w-full rounded-lg border p-2"
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={authForm.password}
              onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
              className="w-full rounded-lg border p-2"
              placeholder="Password"
              required
            />
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-white disabled:opacity-50">
              {loading ? 'Please wait...' : authMode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => {
              setError('');
              setAuthMode(authMode === 'login' ? 'register' : 'login');
            }}
            className="mt-4 text-sm text-indigo-600"
          >
            {authMode === 'login' ? 'Create an account' : 'Use existing account'}
          </button>
        </div>
      </main>
    );
  }

  const selectedCourse = courses.find((course) => course._id === selectedCourseId);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Your Semester Plan</h1>
            <p className="text-gray-600">Tasks are loaded from the selected course.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{auth.user?.email}</span>
            <button onClick={logout} className="rounded-lg border px-4 py-2 text-sm">
              Log out
            </button>
          </div>
        </div>

        {error && <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}

        <section className="mb-6 grid gap-4 lg:grid-cols-[1fr_2fr]">
          <form onSubmit={createCourse} className="rounded-lg border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Add Course</h2>
            <div className="grid gap-3">
              <input
                type="text"
                value={courseForm.name}
                onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
                className="rounded-lg border p-2"
                placeholder="Course name"
                required
              />
              <input
                type="text"
                value={courseForm.courseCode}
                onChange={(e) => setCourseForm({ ...courseForm, courseCode: e.target.value })}
                className="rounded-lg border p-2"
                placeholder="Course code"
                required
              />
              <input
                type="text"
                value={courseForm.semester}
                onChange={(e) => setCourseForm({ ...courseForm, semester: e.target.value })}
                className="rounded-lg border p-2"
                placeholder="Semester"
                required
              />
              <textarea
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                className="rounded-lg border p-2"
                placeholder="Description"
                rows="3"
              />
              <button type="submit" className="rounded-lg bg-indigo-500 px-4 py-2 text-white">
                Create Course
              </button>
            </div>
          </form>

          <div className="rounded-lg border bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Course Tasks</h2>
                <p className="text-sm text-gray-500">{selectedCourse ? `${selectedCourse.courseCode} - ${selectedCourse.semester}` : 'Create a course to begin.'}</p>
              </div>
              <div className="flex gap-3">
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="">Select course</option>
                  {courses.map((course) => (
                    <option key={course._id} value={course._id}>
                      {course.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setShowUpload(true)}
                  disabled={!selectedCourseId}
                  className="rounded-lg bg-indigo-500 px-4 py-2 text-sm text-white disabled:opacity-50"
                >
                  Upload Syllabus
                </button>
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : tasks.length === 0 ? (
              <div className="rounded-lg border p-8 text-center">
                <p className="text-gray-500">No tasks yet. Upload and process a syllabus to get started.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {tasks.map((task) => (
                  <article key={task._id} className="rounded-lg border p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{task.title}</h3>
                        <p className="text-xs uppercase tracking-wide text-gray-500">{task.type} - {task.priority}</p>
                      </div>
                      <button onClick={() => deleteTask(task._id)} className="text-sm text-red-500">
                        Delete
                      </button>
                    </div>

                    <p className="mb-3 text-sm text-gray-500">
                      Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                    </p>

                    {task.description && <p className="mb-4 text-sm text-gray-600">{task.description}</p>}

                    <div className="flex items-center justify-between">
                      <select
                        value={task.status || 'pending'}
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                        className="rounded-lg border bg-white px-2 py-1 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="complete">Complete</option>
                      </select>
                      <button onClick={() => setEditingTask(task)} className="text-sm text-indigo-600">
                        Edit
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {showUpload && (
        <UploadModal
          courseId={selectedCourseId}
          token={auth.token}
          onClose={() => setShowUpload(false)}
          onUploadSuccess={() => fetchTasks()}
        />
      )}

      {editingTask && (
        <EditTaskModal
          task={editingTask}
          token={auth.token}
          onClose={() => setEditingTask(null)}
          onSave={() => fetchTasks()}
        />
      )}
    </main>
  );
}

function EditTaskModal({ task, token, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task.title || '',
    type: task.type || 'assignment',
    dueDate: task.dueDate?.split('T')[0] || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    status: task.status || 'pending',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      await apiRequest(`/tasks/${task._id}`, {
        token,
        method: 'PUT',
        body: {
          ...form,
          dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">Edit Task</h2>
        {error && <p className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded-lg border p-2"
            placeholder="Task title"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-lg border p-2">
              <option value="assignment">Assignment</option>
              <option value="exam">Exam</option>
              <option value="quiz">Quiz</option>
              <option value="reading">Reading</option>
            </select>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="rounded-lg border p-2">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="rounded-lg border p-2"
          />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-lg border p-2">
            <option value="pending">Pending</option>
            <option value="complete">Complete</option>
          </select>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="rounded-lg border p-2"
            placeholder="Description"
            rows="3"
          />
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-indigo-500 px-4 py-2 text-white disabled:opacity-50">
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
