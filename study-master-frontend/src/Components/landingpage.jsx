import { useState } from 'react';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const classes = [
    { name: 'Computer Science 101', pct: 30 },
    { name: 'Web Development', pct: 55 },
    { name: 'Data Structures', pct: 70 },
    { name: 'UI/UX Design', pct: 85 },
  ];

  const steps = [
    { num: '1', label: 'Upload', desc: 'Drop your syllabus, schedule, or assignment documents' },
    { num: '2', label: 'AI extraction', desc: 'Our AI analyzes deadlines, exams, and assignments automatically' },
    { num: '3', label: 'Study plan', desc: 'Get a complete semester roadmap with smart recommendations' },
  ];

  const features = [
    { title: 'AI task generation', desc: 'Automatically break down assignments into actionable tasks with smart deadlines' },
    { title: 'Study recommendations', desc: 'Get personalized study strategies based on your workload and learning style' },
    { title: 'Class chatbot', desc: 'Ask questions about your classes and get instant AI-powered answers' },
    { title: 'Timeline view', desc: 'Visualize your entire semester at a glance with an intelligent calendar' },
  ];

  return (
    <div className="font-sans bg-gray-50 min-h-screen">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-sm text-gray-900">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          StudyMaster
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm text-gray-500 hover:text-gray-800">features</button>
          <button className="text-sm text-gray-500 hover:text-gray-800">pricing</button>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            Sign up
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="block w-5 h-0.5 bg-gray-700 rounded" />
          <span className="block w-5 h-0.5 bg-gray-700 rounded" />
          <span className="block w-5 h-0.5 bg-gray-700 rounded" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-6 flex flex-col">
          <button className="text-sm text-gray-600 py-3 text-left border-b border-gray-100">Features</button>
          <button className="text-sm text-gray-600 py-3 text-left border-b border-gray-100">Pricing</button>
          <button className="text-sm text-indigo-500 font-medium py-3 text-left">Sign up</button>
        </div>
      )}

      {/* Hero */}
      <section className="bg-white px-6 py-14">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              AI-Powered Study Assistant
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900 mb-4">
              Turn your syllabus into a complete study plan
            </h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Upload your class documents and let AI automatically organize your entire semester.
              Get smart recommendations, automated task generation, and personalized study strategies.
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload syllabus
              </button>
              <button className="border border-gray-200 hover:bg-gray-50 text-sm px-5 py-2.5 rounded-lg transition-colors">
                See demo
              </button>
            </div>
          </div>

          {/* Preview card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-800">Your classes</span>
              <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-2 py-1 rounded-md">
                AI Generated · 24 tasks
              </span>
            </div>
            {classes.map((cls) => (
              <div key={cls.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-500">{cls.name}</span>
                <div className="w-24 h-1 rounded-full bg-indigo-50">
                  <div className="h-full rounded-full bg-indigo-500" style={{ width: `${cls.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-t border-gray-100 px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">How it works</h2>
        <p className="text-sm text-gray-400 mb-10">Get started in three simple steps</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          {steps.map((step) => (
            <div key={step.num}>
              <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <polyline points="9 11 12 14 22 4" />
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-800 mb-1">{step.num}. {step.label}</div>
              <p className="text-xs text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-indigo-50 border-t border-gray-100 px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Powerful features</h2>
          <p className="text-sm text-gray-400">Everything you need to succeed this semester</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {features.map((f) => (
            <div key={f.title} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#6366f1">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-800 mb-1">{f.title}</div>
              <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-500 px-6 py-14 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to ace this semester?</h2>
        <p className="text-sm text-indigo-100 mb-6">Join thousands of students using AI to stay organized and succeed</p>
        <button className="bg-white text-indigo-500 hover:bg-indigo-50 font-medium text-sm px-6 py-2.5 rounded-lg inline-flex items-center gap-2 transition-colors">
          Get started now →
        </button>
      </section>

    </div>
  );
}
