import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import UploadModal from './uploadModal';
import Sideboard from './sideboard';
import { apiRequest, clearStoredAuth, getStoredAuth, setStoredAuth } from '../api';

const iconStroke = {
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const SearchIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m21 21-4.3-4.3M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" {...iconStroke} />
  </svg>
);

const BellIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15 18a3 3 0 0 1-6 0m9-3H6l1.5-2.3V9a4.5 4.5 0 0 1 9 0v3.7L18 15Z" {...iconStroke} />
  </svg>
);

const UserIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M15.5 8.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM5 20a7 7 0 0 1 14 0" {...iconStroke} />
  </svg>
);

const PlusIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ClockIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" {...iconStroke} />
  </svg>
);

const CheckIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="m7 12 3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const AlertIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 8v5m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" {...iconStroke} />
  </svg>
);

const FileIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Zm0 0v5h5M9 13h6M9 17h4" {...iconStroke} />
  </svg>
);

const TrashIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M4 7h16m-2 0-1 14H7L6 7m3 0V4h6v3m-4 4v6m4-6v6" {...iconStroke} />
  </svg>
);

const SparkIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3l1.7 5.2L19 10l-5.3 1.8L12 17l-1.7-5.2L5 10l5.3-1.8L12 3Zm-6 12 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" {...iconStroke} />
  </svg>
);

const ListIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" {...iconStroke} />
  </svg>
);

const metricCards = [
  { label: 'Tasks Due Today', icon: ClockIcon, accent: 'bg-violet-100 text-violet-600' },
  { label: 'Classes', icon: FileIcon, accent: 'bg-blue-100 text-blue-600' },
  { label: 'Completed Tasks', icon: CheckIcon, accent: 'bg-emerald-100 text-emerald-600' },
  { label: 'Overdue Tasks', icon: AlertIcon, accent: 'bg-red-100 text-red-500' },
];

const classTabs = [
  { label: 'Overview', icon: SparkIcon },
  { label: 'Tasks', icon: ListIcon },
  { label: 'Study Plan', icon: ClockIcon },
  { label: 'Files', icon: FileIcon },
];

export default function Dashboard() {
  const [auth, setAuth] = useState(getStoredAuth);
  const [authMode, setAuthMode] = useState(() => {
    const authParam = new URLSearchParams(window.location.search).get('auth');
    return authParam === 'signup' || authParam === 'register' ? 'register' : 'login';
  });
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [activeView, setActiveView] = useState('dashboard');
  const [activeClassTab, setActiveClassTab] = useState('Overview');
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [error, setError] = useState('');

  const userName = auth?.user?.name || 'there';
  const selectedCourse = useMemo(
    () => courses.find((course) => course._id === selectedCourseId),
    [courses, selectedCourseId]
  );

  const sortedAssignments = useMemo(
    () =>
      [...assignments].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return a.title.localeCompare(b.title);
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }),
    [assignments]
  );

  const completedCount = assignments.filter((assignment) => assignment.status === 'complete').length;
  const pendingCount = assignments.filter((assignment) => assignment.status !== 'complete').length;
  const metrics = [pendingCount, courses.length, completedCount, 0];

  const loadCourses = useCallback(async (token) => {
    const data = await apiRequest('/courses', { token });
    setCourses(data);
    setSelectedCourseId((currentId) => {
      if (data.some((course) => course._id === currentId)) return currentId;
      return data[0]?._id || '';
    });
    return data;
  }, []);

  const fetchAssignments = useCallback(async (courseId, token) => {
    if (!courseId || !token) {
      setAssignments([]);
      return;
    }
    const data = await apiRequest(`/courses/${courseId}/tasks`, { token });
    setAssignments(data);
  }, []);

  const fetchDocuments = useCallback(async (courseId, token) => {
    if (!courseId || !token) {
      setDocuments([]);
      return;
    }
    const data = await apiRequest(`/courses/${courseId}/documents`, { token });
    setDocuments(data);
  }, []);

  const fetchStudyPlan = useCallback(async (courseId, token) => {
    if (!courseId || !token) {
      setStudyPlan(null);
      return;
    }
    try {
      const data = await apiRequest(`/courses/${courseId}/study-plan`, { token });
      setStudyPlan(data);
    } catch (err) {
      if (!err.message.includes('No study plan')) setError(err.message);
      setStudyPlan(null);
    }
  }, []);

  const loadClassDetail = useCallback(
    async (courseId, token) => {
      if (!courseId || !token) return;
      setDetailLoading(true);
      try {
        await Promise.all([
          fetchAssignments(courseId, token),
          fetchDocuments(courseId, token),
          fetchStudyPlan(courseId, token),
        ]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setDetailLoading(false);
      }
    },
    [fetchAssignments, fetchDocuments, fetchStudyPlan]
  );

  useEffect(() => {
    const loadDashboard = async () => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const loadedCourses = await loadCourses(auth.token);
        if (loadedCourses[0]?._id) {
          await loadClassDetail(loadedCourses[0]._id, auth.token);
        } else {
          setAssignments([]);
          setDocuments([]);
          setStudyPlan(null);
          setLoading(false);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadDashboard();
  }, [auth?.token, loadClassDetail, loadCourses]);

  useEffect(() => {
    if (auth?.token && selectedCourseId) {
      loadClassDetail(selectedCourseId, auth.token);
    }
  }, [auth?.token, loadClassDetail, selectedCourseId]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body =
        authMode === 'register'
          ? authForm
          : { email: authForm.email, password: authForm.password };
      const data = await apiRequest(`/auth/${authMode}`, { method: 'POST', body });

      setStoredAuth(data);
      setAuth(data);
      setAuthForm({ name: '', email: '', password: '' });
      window.history.replaceState({}, '', '/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleNavigate = (view) => {
    setActiveView(view);
    if (view === 'classes') {
      setActiveClassTab('Overview');
    }
  };

  const openClassDetail = (courseId) => {
    setSelectedCourseId(courseId);
    setActiveView('classDetail');
    setActiveClassTab('Overview');
  };

  const backToClasses = () => {
    setActiveView('classes');
    setActiveClassTab('Overview');
  };

  const handleDeleteClass = async (courseId) => {
    if (!window.confirm('Delete this class and all related tasks, files, and study plans?')) return;
    try {
      await apiRequest(`/courses/${courseId}`, { token: auth.token, method: 'DELETE' });
      const nextCourses = await loadCourses(auth.token);
      if (nextCourses.length === 0) {
        setSelectedCourseId('');
        setAssignments([]);
        setDocuments([]);
        setStudyPlan(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const generatePlan = async () => {
    if (!selectedCourseId) return;
    setPlanLoading(true);
    setError('');
    try {
      const plan = await apiRequest(`/courses/${selectedCourseId}/study-plan/generate`, {
        token: auth.token,
        method: 'POST',
      });
      setStudyPlan(plan);
      setActiveClassTab('Study Plan');
    } catch (err) {
      setError(err.message);
    } finally {
      setPlanLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/tasks/${id}`, { token: auth.token, method: 'PUT', body: { status } });
      await fetchAssignments(selectedCourseId, auth.token);
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteAssignment = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await apiRequest(`/tasks/${id}`, { token: auth.token, method: 'DELETE' });
      await fetchAssignments(selectedCourseId, auth.token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    clearStoredAuth();
    setAuth(null);
    setCourses([]);
    setSelectedCourseId('');
    setAssignments([]);
    setDocuments([]);
    setStudyPlan(null);
    setAuthMode('login');
    window.history.replaceState({}, '', '/dashboard');
  };

  if (!auth?.token) {
    return (
      <AuthScreen
        authMode={authMode}
        authForm={authForm}
        error={error}
        loading={loading}
        onAuth={handleAuth}
        onFormChange={setAuthForm}
        onModeChange={setAuthMode}
        onClearError={() => setError('')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Sideboard activeView={activeView === 'classDetail' ? 'classes' : activeView} onNavigate={handleNavigate} onLogout={handleLogout} />

      <div className="lg:pl-64">
        <Header />

        <main className="px-4 pb-28 pt-6 sm:px-6 lg:px-9 lg:pb-8 lg:pt-8">
          {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}

          {activeView === 'classes' ? (
            <ClassesView
              courses={courses}
              loading={loading}
              onAddClass={() => setShowAddClass(true)}
              onDeleteClass={handleDeleteClass}
              onOpenClass={openClassDetail}
            />
          ) : activeView === 'classDetail' && selectedCourse ? (
            <ClassDetailView
              course={selectedCourse}
              assignments={sortedAssignments}
              documents={documents}
              studyPlan={studyPlan}
              activeTab={activeClassTab}
              detailLoading={detailLoading}
              planLoading={planLoading}
              onBack={backToClasses}
              onTabChange={setActiveClassTab}
              onGeneratePlan={generatePlan}
              onUpload={() => setShowUpload(true)}
              onStatusChange={updateStatus}
              onEditAssignment={setEditingAssignment}
              onDeleteAssignment={deleteAssignment}
            />
          ) : activeView === 'studyPlans' ? (
            <StudyPlansView courses={courses} selectedCourse={selectedCourse} studyPlan={studyPlan} onOpenClass={openClassDetail} onGeneratePlan={generatePlan} planLoading={planLoading} />
          ) : (
            <DashboardHome
              userName={userName}
              loading={loading}
              courses={courses}
              metrics={metrics}
              assignments={sortedAssignments}
              selectedCourse={selectedCourse}
              onAddClass={() => setShowAddClass(true)}
              onOpenClasses={() => setActiveView('classes')}
              onOpenClass={openClassDetail}
            />
          )}
        </main>
      </div>

      {showAddClass && (
        <AddClassModal
          token={auth.token}
          onClose={() => setShowAddClass(false)}
          onCreated={async (course) => {
            await loadCourses(auth.token);
            setSelectedCourseId(course?._id || '');
            setActiveView('classDetail');
            setShowAddClass(false);
          }}
        />
      )}

      {showUpload && (
        <UploadModal
          courseId={selectedCourseId}
          token={auth.token}
          onClose={() => setShowUpload(false)}
          onUploadSuccess={() => loadClassDetail(selectedCourseId, auth.token)}
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

function Header() {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:h-24 lg:px-9">
      <div className="flex items-center justify-between gap-4 md:hidden">
        <a href="/" className="flex min-w-0 items-center gap-3">
          <img src="/studymaster-logo.svg" alt="" className="h-10 w-10 shrink-0" />
          <span className="truncate text-xl font-extrabold text-slate-800">StudyMaster</span>
        </a>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
          <UserIcon className="h-5 w-5" />
        </div>
      </div>

      <div className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-400 shadow-sm md:max-w-2xl">
        <SearchIcon className="h-5 w-5" />
        <input
          type="search"
          placeholder="Search classes, tasks, or study plans..."
          className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="hidden items-center gap-5 md:ml-5 md:flex">
        <button type="button" className="relative text-slate-500">
          <BellIcon className="h-6 w-6" />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-violet-600" />
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-white">
          <UserIcon className="h-5 w-5" />
        </div>
      </div>
    </header>
  );
}

function DashboardHome({ userName, loading, courses, metrics, assignments, selectedCourse, onAddClass, onOpenClasses, onOpenClass }) {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4 sm:mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Hello {userName}</h1>
          <p className="mt-3 text-sm font-semibold text-slate-500">
            Focus on your classes, study plans, and upcoming assignments from one place.
          </p>
        </div>
        {courses.length > 0 && (
          <button type="button" onClick={onOpenClasses} className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-bold text-white sm:w-auto">
            View classes
          </button>
        )}
      </div>

      {loading ? (
        <LoadingCard label="Loading dashboard..." />
      ) : courses.length === 0 ? (
        <EmptyClassesState onAddClass={onAddClass} />
      ) : (
        <>
          <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:mb-8 xl:grid-cols-4">
            {metricCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <article key={card.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${card.accent}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-3xl font-extrabold text-slate-900">{metrics[index]}</div>
                  <p className="mt-2 text-sm font-bold text-slate-500">{card.label}</p>
                </article>
              );
            })}
          </section>

          <section className="grid gap-5 xl:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-200 p-6">
                <h2 className="text-xl font-extrabold text-slate-900">Upcoming Tasks</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">{selectedCourse?.name || 'Select a class'}</p>
              </div>
              {assignments.length === 0 ? (
                <div className="p-12 text-center text-sm text-slate-500">Open a class and upload a syllabus to generate tasks.</div>
              ) : (
                <div className="space-y-4 p-6">
                  {assignments.slice(0, 5).map((assignment) => (
                    <CompactTask key={assignment._id} assignment={assignment} />
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-violet-600 to-blue-500 p-6 text-white shadow-lg shadow-violet-200">
              <SparkIcon className="h-6 w-6" />
              <h2 className="mt-4 text-xl font-extrabold">Next best move</h2>
              <p className="mt-3 text-sm leading-6 text-white/85">
                Start by opening a class card. From there you can review files, sort tasks by due date, and generate a focused study plan.
              </p>
              <button type="button" onClick={() => onOpenClass(selectedCourse?._id)} disabled={!selectedCourse} className="mt-6 w-full rounded-lg bg-white px-4 py-3 text-sm font-bold text-violet-600 disabled:opacity-50 sm:w-auto">
                Open current class
              </button>
            </div>
          </section>
        </>
      )}
    </>
  );
}

function ClassesView({ courses, loading, onAddClass, onDeleteClass, onOpenClass }) {
  if (loading) return <LoadingCard label="Loading classes..." />;

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Classes</h1>
          <p className="mt-2 text-sm font-semibold text-slate-500">Create classes, upload syllabi, and manage each course workspace.</p>
        </div>
        <button type="button" onClick={onAddClass} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 sm:w-auto">
          <PlusIcon className="h-4 w-4" />
          Add class
        </button>
      </div>

      {courses.length === 0 ? (
        <EmptyClassesState onAddClass={onAddClass} />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {courses.map((course, index) => (
            <ClassCard key={course._id} course={course} index={index} onOpen={() => onOpenClass(course._id)} onDelete={() => onDeleteClass(course._id)} />
          ))}
        </div>
      )}
    </section>
  );
}

function ClassCard({ course, index, onOpen, onDelete }) {
  const gradients = [
    'from-violet-600 to-blue-500',
    'from-cyan-500 to-emerald-500',
    'from-fuchsia-500 to-rose-500',
    'from-amber-500 to-orange-600',
  ];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <div className={`h-28 bg-gradient-to-br ${gradients[index % gradients.length]} p-5 text-white`}>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
            <FileIcon className="h-6 w-6" />
          </div>
        </div>
        <div className="p-5">
          <h2 className="text-xl font-extrabold text-slate-900">{course.name}</h2>
          <p className="mt-2 text-sm font-bold text-slate-500">{course.courseCode} • {course.semester}</p>
          {course.description && <p className="mt-4 line-clamp-2 text-sm text-slate-500">{course.description}</p>}
        </div>
      </button>
      <div className="border-t border-slate-100 p-4">
        <button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold text-red-500 hover:bg-red-50">
          <TrashIcon className="h-4 w-4" />
          Delete class
        </button>
      </div>
    </article>
  );
}

function ClassDetailView({
  course,
  assignments,
  documents,
  studyPlan,
  activeTab,
  detailLoading,
  planLoading,
  onBack,
  onTabChange,
  onGeneratePlan,
  onUpload,
  onStatusChange,
  onEditAssignment,
  onDeleteAssignment,
}) {
  const complete = assignments.filter((assignment) => assignment.status === 'complete').length;
  const progress = assignments.length ? Math.round((complete / assignments.length) * 100) : 0;
  const weekTasks = assignments.filter((assignment) => isWithinNextDays(assignment.dueDate, 7)).length;

  return (
    <section>
      <button type="button" onClick={onBack} className="mb-5 text-sm font-extrabold text-slate-500 hover:text-violet-600">
        ← Back to Classes
      </button>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-5 sm:mb-7">
        <div className="min-w-0">
          <h1 className="break-words text-2xl font-extrabold text-slate-900 sm:text-3xl">{course.name}</h1>
          <p className="mt-2 text-sm font-bold text-slate-500">{course.courseCode} • {course.semester}</p>
        </div>
        <div className="w-full sm:w-[220px]">
          <div className="flex justify-between text-xs font-bold text-slate-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-blue-500" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 sm:mb-8">
        <div className="-mb-px flex w-full gap-5 overflow-x-auto sm:w-auto sm:flex-wrap sm:gap-6">
          {classTabs.map((tab) => {
            const Icon = tab.icon;

            return (
            <button
              key={tab.label}
              type="button"
              onClick={() => onTabChange(tab.label)}
              className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-1 pb-4 text-sm font-extrabold transition ${
                activeTab === tab.label ? 'border-violet-600 text-violet-600' : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
            );
          })}
        </div>
        <div className="mb-3 grid w-full gap-3 sm:flex sm:w-auto sm:flex-wrap">
          <button type="button" onClick={onUpload} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 sm:py-2">
            Upload syllabus
          </button>
          <button type="button" onClick={onGeneratePlan} disabled={planLoading || assignments.length === 0} className="rounded-lg bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 disabled:opacity-50 sm:py-2">
            {planLoading ? 'Generating...' : 'Generate study plan'}
          </button>
        </div>
      </div>

      {detailLoading ? <LoadingCard label="Loading class details..." /> : null}
      {!detailLoading && activeTab === 'Overview' && (
        <OverviewTab course={course} assignments={assignments} complete={complete} weekTasks={weekTasks} progress={progress} studyPlan={studyPlan} />
      )}
      {!detailLoading && activeTab === 'Tasks' && (
        <TasksTab assignments={assignments} onStatusChange={onStatusChange} onEditAssignment={onEditAssignment} onDeleteAssignment={onDeleteAssignment} />
      )}
      {!detailLoading && activeTab === 'Study Plan' && (
        <StudyPlanTab studyPlan={studyPlan} assignments={assignments} planLoading={planLoading} onGeneratePlan={onGeneratePlan} />
      )}
      {!detailLoading && activeTab === 'Files' && <FilesTab documents={documents} onUpload={onUpload} />}
    </section>
  );
}

function OverviewTab({ course, assignments, complete, weekTasks, progress, studyPlan }) {
  return (
    <div className="mx-auto max-w-6xl">
      <section className="mb-5 grid gap-4 sm:grid-cols-3 sm:gap-5 md:mb-6">
        <SummaryCard icon={CheckIcon} label="Assignments Completed" value={`${complete}/${assignments.length}`} accent="bg-violet-100 text-violet-600" />
        <SummaryCard icon={ClockIcon} label="Tasks Due This Week" value={weekTasks} accent="bg-blue-100 text-blue-600" />
        <SummaryCard icon={SparkIcon} label="Current Progress" value={`${progress}%`} accent="bg-emerald-100 text-emerald-600" />
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_400px] lg:gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-xl font-extrabold text-slate-900">Upcoming Deadlines</h2>
          <div className="mt-5 space-y-4">
            {assignments.length === 0 ? (
              <p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No tasks yet. Upload a syllabus to extract deadlines.</p>
            ) : (
              assignments.slice(0, 5).map((assignment) => <CompactTask key={assignment._id} assignment={assignment} />)
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 p-5 text-white shadow-xl shadow-violet-200 sm:p-6">
          <SparkIcon className="h-6 w-6" />
          <h2 className="mt-3 text-xl font-extrabold">Study Plan</h2>
          <p className="mt-2 text-sm text-white/80">{course.name}</p>
          <div className="mt-5 max-h-[420px] overflow-auto rounded-xl bg-white/15 p-4 text-sm leading-6 text-white/95">
            {studyPlan?.aiRecommendations ? (
              <PlanMarkdown content={studyPlan.aiRecommendations} inverted />
            ) : (
              'Generate a study plan to get a practical sequence for finishing each task and reviewing the right material.'
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function TasksTab({ assignments, onStatusChange, onEditAssignment, onDeleteAssignment }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <h2 className="text-xl font-extrabold text-slate-900">Tasks sorted by due date</h2>
      </div>
      {assignments.length === 0 ? (
        <div className="p-12 text-center text-sm text-slate-500">No tasks found for this class.</div>
      ) : (
        <div className="space-y-4 p-6">
          {assignments.map((assignment) => (
            <AssignmentRow
              key={assignment._id}
              assignment={assignment}
              onDelete={() => onDeleteAssignment(assignment._id)}
              onEdit={() => onEditAssignment(assignment)}
              onStatusChange={(status) => onStatusChange(assignment._id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StudyPlanTab({ studyPlan, assignments, planLoading, onGeneratePlan }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px] lg:gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Week-by-week study plan</h2>
            <p className="mt-1 text-sm text-slate-500">Generated from this class's tasks, deadlines, and priorities.</p>
          </div>
          <button
            type="button"
            onClick={onGeneratePlan}
            disabled={planLoading || assignments.length === 0}
            className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-200 disabled:opacity-50 sm:w-auto sm:py-2"
          >
            {planLoading ? 'Generating...' : 'Generate study plan'}
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {studyPlan?.aiRecommendations ? (
            <WeekPlanAccordion content={studyPlan.aiRecommendations} />
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center sm:p-10">
              <SparkIcon className="mx-auto h-8 w-8 text-violet-600" />
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">No study plan yet</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Generate a plan after tasks exist. The AI will create at most eight weekly sections
                named Week 1 plan, Week 2 plan, and so on.
              </p>
            </div>
          )}
        </div>
      </div>

      <aside className="rounded-2xl bg-gradient-to-br from-violet-600 to-blue-500 p-5 text-white shadow-xl shadow-violet-200 sm:p-6">
        <SparkIcon className="h-7 w-7" />
        <h3 className="mt-4 text-xl font-extrabold">Plan rules</h3>
        <ul className="mt-5 space-y-3 text-sm leading-6 text-white/90">
          <li>At most 8 weeks.</li>
          <li>Each row expands into a weekly plan.</li>
          <li>Each week includes concrete study tasks, referenced assignments, and time blocks.</li>
          <li>Tasks are based on your uploaded syllabus deadlines.</li>
        </ul>
      </aside>
    </div>
  );
}

function WeekPlanAccordion({ content }) {
  const sections = useMemo(() => parseWeeklyPlan(content), [content]);
  const [openSection, setOpenSection] = useState(sections[0]?.id || '');

  useEffect(() => {
    setOpenSection(sections[0]?.id || '');
  }, [sections]);

  if (sections.length === 0) {
    return <PlanMarkdown content={content} />;
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        if (section.type === 'intro') {
          return (
            <div key={section.id} className="rounded-2xl bg-slate-50 p-5">
              <PlanMarkdown content={section.content} />
            </div>
          );
        }

        if (section.type === 'notes') {
          return (
            <div key={section.id} className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
              <PlanMarkdown content={`## ${section.title}\n${section.content}`} />
            </div>
          );
        }

        const isOpen = openSection === section.id;

        return (
          <article key={section.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenSection(isOpen ? '' : section.id)}
              className="flex w-full items-center justify-between gap-4 bg-slate-50 px-4 py-4 text-left transition hover:bg-violet-50 sm:px-5"
            >
              <div>
                <p className="text-xs font-extrabold uppercase tracking-wide text-violet-600">
                  {section.weekLabel}
                </p>
                <h3 className="mt-1 break-words text-base font-extrabold text-slate-900 sm:text-lg">{section.quickTitle}</h3>
              </div>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-violet-600 shadow-sm transition ${isOpen ? 'rotate-180' : ''}`}>
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-slate-200 p-4 sm:p-5">
                <PlanMarkdown content={section.content} />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function PlanMarkdown({ content, inverted = false }) {
  return (
    <div className={inverted ? 'study-plan-markdown study-plan-markdown-inverted' : 'study-plan-markdown'}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={inverted ? 'mb-4 text-2xl font-extrabold text-white' : 'mb-5 text-3xl font-extrabold text-slate-900'}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={inverted ? 'mt-5 rounded-lg bg-white/15 px-3 py-2 text-lg font-extrabold text-white' : 'mt-6 rounded-xl bg-violet-50 px-4 py-3 text-xl font-extrabold text-violet-700'}>
              {children}
            </h2>
          ),
          p: ({ children }) => (
            <p className={inverted ? 'mt-3 leading-6 text-white/90' : 'mt-3 leading-7 text-slate-600'}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className={inverted ? 'mt-3 space-y-2 pl-5 text-white/90' : 'mt-4 space-y-3 pl-5 text-slate-600'}>
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="list-disc leading-7">
              {children}
            </li>
          ),
          table: ({ children }) => (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className={inverted ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-700'}>
              {children}
            </thead>
          ),
          th: ({ children }) => (
            <th className="border-b border-slate-200 px-4 py-3 font-extrabold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className={inverted ? 'border-t border-white/15 px-4 py-3 text-white/90' : 'border-t border-slate-200 px-4 py-3 text-slate-600'}>
              {children}
            </td>
          ),
          strong: ({ children }) => (
            <strong className={inverted ? 'font-extrabold text-white' : 'font-extrabold text-slate-900'}>
              {children}
            </strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function parseWeeklyPlan(content) {
  const normalized = content.replace(/\r\n/g, '\n').trim();
  if (!normalized) return [];

  const matches = [...normalized.matchAll(/^##\s+(.+)$/gim)];
  if (matches.length === 0) return [];

  const sections = [];
  const intro = normalized.slice(0, matches[0].index).trim();

  if (intro) {
    sections.push({
      id: 'intro',
      type: 'intro',
      title: 'Study Plan',
      content: intro,
    });
  }

  matches.forEach((match, index) => {
    const title = match[1].trim();
    const start = match.index + match[0].length;
    const end = matches[index + 1]?.index ?? normalized.length;
    const body = normalized.slice(start, end).trim();
    const weekMatch = title.match(/^(Week\s+\d+\s+plan)(?:\s*[-–—:]\s*(.+))?$/i);

    sections.push({
      id: `section-${index}`,
      type: weekMatch ? 'week' : 'notes',
      title,
      weekLabel: weekMatch?.[1] || title,
      quickTitle: weekMatch?.[2] || 'Weekly focus',
      content: body,
    });
  });

  return sections;
}

function FilesTab({ documents, onUpload }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 p-5 sm:p-6">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Uploaded Syllabi & Files</h2>
          <p className="mt-1 text-sm text-slate-500">Files used to extract tasks for this class.</p>
        </div>
        <button type="button" onClick={onUpload} className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-bold text-white sm:w-auto sm:py-2">Upload file</button>
      </div>
      {documents.length === 0 ? (
        <div className="p-12 text-center text-sm text-slate-500">No files uploaded for this class yet.</div>
      ) : (
        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
          {documents.map((document) => (
            <article key={document._id} className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <FileIcon className="h-7 w-7 text-violet-600" />
              <h3 className="mt-4 break-words font-extrabold text-slate-900">{document.fileName}</h3>
              <p className="mt-2 text-sm text-slate-500">{document.fileType.toUpperCase()} • {document.processedAt ? 'Processed' : 'Processing pending'}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function StudyPlansView({ courses, selectedCourse, studyPlan, onOpenClass, onGeneratePlan, planLoading }) {
  return (
    <section>
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Study Plans</h1>
      <p className="mt-2 text-sm font-semibold text-slate-500">Generate and review course-specific plans from your tasks.</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr] xl:grid-cols-[360px_1fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-extrabold text-slate-900">Classes</h2>
          <div className="mt-4 space-y-3">
            {courses.map((course) => (
              <button key={course._id} type="button" onClick={() => onOpenClass(course._id)} className="w-full rounded-xl bg-slate-50 p-4 text-left hover:bg-violet-50">
                <span className="block font-extrabold text-slate-900">{course.name}</span>
                <span className="text-sm text-slate-500">{course.courseCode}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">{selectedCourse?.name || 'Select a class'}</h2>
              <p className="mt-1 text-sm text-slate-500">Current generated plan</p>
            </div>
            <button type="button" onClick={onGeneratePlan} disabled={!selectedCourse || planLoading} className="w-full rounded-lg bg-violet-600 px-4 py-3 text-sm font-bold text-white disabled:opacity-50 sm:w-auto sm:py-2">
              {planLoading ? 'Generating...' : 'Generate study plan'}
            </button>
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            {studyPlan?.aiRecommendations ? (
              <PlanMarkdown content={studyPlan.aiRecommendations} />
            ) : (
              'No study plan generated for this class yet.'
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function EmptyClassesState({ onAddClass }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
        <PlusIcon className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-extrabold text-slate-900">You don't have any classes</h2>
      <button type="button" onClick={onAddClass} className="mt-4 text-base font-extrabold text-violet-600 hover:text-violet-700">
        Click here to add classes
      </button>
    </section>
  );
}

function SummaryCard({ icon: Icon, label, value, accent }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-3xl font-extrabold text-slate-900">{value}</div>
      <p className="mt-2 text-sm font-bold text-slate-500">{label}</p>
    </article>
  );
}

function CompactTask({ assignment }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="min-w-0">
        <h3 className="break-words font-extrabold text-slate-800">{assignment.title}</h3>
        <p className="mt-1 text-sm font-semibold text-slate-500">
          Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No date'}
        </p>
      </div>
      <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClass(assignment.priority)}`}>
        {assignment.priority || 'medium'}
      </span>
    </div>
  );
}

function AssignmentRow({ assignment, onDelete, onEdit, onStatusChange }) {
  const isComplete = assignment.status === 'complete';

  return (
    <article className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
      <div className="flex min-w-0 items-start gap-4">
        <input
          type="checkbox"
          checked={isComplete}
          onChange={(e) => onStatusChange(e.target.checked ? 'complete' : 'pending')}
          className="mt-1 h-5 w-5 rounded border-slate-300 text-violet-600"
        />
        <div className="min-w-0">
          <h3 className="break-words font-extrabold text-slate-800">{assignment.title}</h3>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Due: {assignment.dueDate ? new Date(assignment.dueDate).toLocaleDateString() : 'No date'}
          </p>
          {assignment.description && <p className="mt-2 max-w-2xl text-sm text-slate-500">{assignment.description}</p>}
        </div>
      </div>

      <div className="ml-9 flex w-full flex-wrap items-center gap-3 sm:ml-0 sm:w-auto">
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClass(assignment.priority)}`}>
          {assignment.priority || 'medium'}
        </span>
        <button type="button" onClick={onEdit} className="text-sm font-bold text-violet-600">Edit</button>
        <button type="button" onClick={onDelete} className="text-xl leading-none text-red-400">&times;</button>
      </div>
    </article>
  );
}

function AuthScreen({ authMode, authForm, error, loading, onAuth, onFormChange, onModeChange, onClearError }) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:p-6">
      <div className="mx-auto mt-4 max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-7">
        <div className="mb-5 flex items-center gap-3">
          <img src="/studymaster-logo.svg" alt="" className="h-11 w-11" />
          <h1 className="text-3xl font-bold text-slate-800">StudyMaster</h1>
        </div>
        <p className="mb-8 text-slate-500">{authMode === 'login' ? 'Log in to open your dashboard' : 'Create your account to start planning'}</p>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={onAuth}>
          {authMode === 'register' && (
            <input type="text" value={authForm.name} onChange={(e) => onFormChange({ ...authForm, name: e.target.value })} className="mb-3 w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" placeholder="Name" required />
          )}
          <input type="email" value={authForm.email} onChange={(e) => onFormChange({ ...authForm, email: e.target.value })} className="mb-3 w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" placeholder="Email" required />
          <input type="password" value={authForm.password} onChange={(e) => onFormChange({ ...authForm, password: e.target.value })} className="mb-4 w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" placeholder="Password" required />
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-violet-600 px-4 py-3 font-bold text-white disabled:opacity-50">
            {loading ? 'Loading...' : authMode === 'login' ? 'Login' : 'Signup'}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            onClearError();
            onModeChange(authMode === 'login' ? 'register' : 'login');
          }}
          className="mt-4 text-sm font-bold text-violet-600 hover:text-violet-700"
        >
          {authMode === 'login' ? 'Need an account? Signup' : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
}

function AddClassModal({ token, onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', courseCode: '', semester: 'Current Semester', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const course = await apiRequest('/courses', { token, method: 'POST', body: form });
      onCreated(course);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <h2 className="text-xl font-extrabold text-slate-900">Add Class</h2>
        <p className="mt-2 text-sm text-slate-500">Create a class before uploading a syllabus.</p>
        {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" placeholder="Class name" required />
          <input type="text" value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} className="w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" placeholder="Course code" required />
          <input type="text" value={form.semester} onChange={(e) => setForm({ ...form, semester: e.target.value })} className="w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" placeholder="Semester" required />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" placeholder="Description" rows="3" />
          <div className="grid gap-3 pt-2 sm:grid-cols-2">
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-violet-600 px-4 py-3 font-bold text-white disabled:opacity-50">{saving ? 'Adding...' : 'Add class'}</button>
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-200 px-4 py-3 font-bold text-slate-600">Cancel</button>
          </div>
        </form>
      </div>
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
        body: { title: name, dueDate: dueDate ? new Date(dueDate).toISOString() : null, description },
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center sm:p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6">
        <h2 className="mb-4 text-xl font-extrabold text-slate-900">Edit Assignment</h2>
        {error && <p className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mb-3 w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" placeholder="Assignment name" required />
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="mb-3 w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mb-4 w-full rounded-lg border border-slate-200 p-3 text-base outline-none focus:border-violet-400" placeholder="Description" rows="3" />
          <div className="grid gap-3 sm:grid-cols-2">
            <button type="submit" disabled={saving} className="flex-1 rounded-lg bg-violet-600 px-4 py-3 font-bold text-white disabled:opacity-50">{saving ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-slate-200 px-4 py-3 font-bold text-slate-600">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function LoadingCard({ label }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">{label}</div>;
}

function priorityClass(priority = 'medium') {
  if (priority === 'high') return 'bg-red-50 text-red-500';
  if (priority === 'low') return 'bg-slate-100 text-slate-500';
  return 'bg-amber-50 text-amber-600';
}

function isWithinNextDays(dateValue, days) {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  const now = new Date();
  const end = new Date();
  end.setDate(now.getDate() + days);
  return date >= now && date <= end;
}
