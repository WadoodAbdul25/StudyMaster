import { useState } from 'react';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-gray-900">
          <div className="w-7 h-7 bg-indigo-500 rounded-lg flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5M2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          StudyMaster
        </div>

        {/* Desktop links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-sm text-gray-500">features</button>
          <button className="text-sm text-gray-500">pricing</button>
          <button className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg">
            Sign up
          </button>
        </div>

        {/* Hamburger - only shows on mobile */}
        <button className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
      </nav>

      {/* Mobile menu - only shows when menuOpen is true */}
      {menuOpen && (
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-3">
          <button className="text-sm text-gray-600 text-left">Features</button>
          <button className="text-sm text-gray-600 text-left">Pricing</button>
          <button className="text-sm text-indigo-500 text-left">Sign up</button>
        </div>
      )}

      {/* Hero section */}
      <section className="bg-white px-6 py-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">

          {/* Left side - text */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full mb-4">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              AI-Powered Study Assistant
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Turn your syllabus into a complete study plan
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Upload your class documents and let AI automatically organize your entire semester.
              Get smart recommendations, automated task generation, and personalized study strategies.
            </p>
            <div className="flex gap-3">
              <button className="bg-indigo-500 text-white text-sm px-5 py-2.5 rounded-lg flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload syllabus
              </button>
              <button className="border border-gray-200 text-sm px-5 py-2.5 rounded-lg">
                See demo
              </button>
            </div>
          </div>

          {/* Right side - class preview card */}
          <div className="flex-1 border border-gray-200 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium">Your classes</p>
              <p className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">
                AI Generated · 24 tasks
              </p>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">Computer Science 101</p>
              <div className="w-24 h-1 bg-indigo-100 rounded-full">
                <div className="w-1/4 h-full bg-indigo-500 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">Web Development</p>
              <div className="w-24 h-1 bg-indigo-100 rounded-full">
                <div className="w-1/2 h-full bg-indigo-500 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <p className="text-xs text-gray-500">Data Structures</p>
              <div className="w-24 h-1 bg-indigo-100 rounded-full">
                <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <p className="text-xs text-gray-500">UI/UX Design</p>
              <div className="w-24 h-1 bg-indigo-100 rounded-full">
                <div className="w-full h-full bg-indigo-500 rounded-full"></div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* How it works section */}
      <section className="bg-white border-t border-gray-100 px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">How it works</h2>
        <p className="text-sm text-gray-400 mb-10">Get started in three simple steps</p>

        <div className="flex flex-col sm:flex-row gap-8 max-w-3xl mx-auto">

          {/* Step 1 */}
          <div className="flex-1">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">1. Upload</p>
            <p className="text-xs text-gray-400">Drop your syllabus, schedule, or assignment documents</p>
          </div>

          {/* Step 2 */}
          <div className="flex-1">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4l3 3" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">2. AI extraction</p>
            <p className="text-xs text-gray-400">Our AI analyzes deadlines, exams, and assignments automatically</p>
          </div>

          {/* Step 3 */}
          <div className="flex-1">
            <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">3. Study plan</p>
            <p className="text-xs text-gray-400">Get a complete semester roadmap with smart recommendations</p>
          </div>

        </div>
      </section>

      {/* Features section */}
      <section className="bg-indigo-50 border-t border-gray-100 px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Powerful features</h2>
          <p className="text-sm text-gray-400">Everything you need to succeed this semester</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto">

          {/* Feature 1 */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">AI task generation</p>
            <p className="text-xs text-gray-400">Automatically break down assignments into actionable tasks with smart deadlines</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#6366f1">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">Study recommendations</p>
            <p className="text-xs text-gray-400">Get personalized study strategies based on your workload and learning style</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">Class chatbot</p>
            <p className="text-xs text-gray-400">Ask questions about your classes and get instant AI-powered answers</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-gray-100 rounded-xl p-4">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-1">Timeline view</p>
            <p className="text-xs text-gray-400">Visualize your entire semester at a glance with an intelligent calendar</p>
          </div>

        </div>
      </section>

      {/* CTA section */}
      <section className="bg-indigo-500 px-6 py-14 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to ace this semester?</h2>
        <p className="text-sm text-indigo-100 mb-6">Join thousands of students using AI to stay organized and succeed</p>
        <button className="bg-white text-indigo-500 text-sm font-medium px-6 py-2.5 rounded-lg">
          Get started now →
        </button>
      </section>

    </div>
  );
}