const ArrowUpTrayIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 16V4m0 0 4 4m-4-4-4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SparkleIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 3l1.6 5.1L19 10l-5.4 1.9L12 17l-1.6-5.1L5 10l5.4-1.9L12 3ZM5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15ZM19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BrainIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 4a3 3 0 0 0-3 3v.4A3.5 3.5 0 0 0 4 14a3 3 0 0 0 3 5h2V4Zm6 0a3 3 0 0 1 3 3v.4A3.5 3.5 0 0 1 20 14a3 3 0 0 1-3 5h-2V4ZM9 9H7m2 5H6m9-5h2m-2 5h3m-6-9v14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckCircleIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 12.4 11 14l4-5m5 3a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TargetIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MessageIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6a2.5 2.5 0 0 1-2.5 2.5H11l-4 4v-4.1A2.5 2.5 0 0 1 5 12.5v-6Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 3v3m10-3v3M5 9h14M6.5 5h11A2.5 2.5 0 0 1 20 7.5v10A2.5 2.5 0 0 1 17.5 20h-11A2.5 2.5 0 0 1 4 17.5v-10A2.5 2.5 0 0 1 6.5 5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon = ({ className = 'h-4 w-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="m9 6 6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const classRows = [
  { name: 'Computer Science 101', width: 'w-[14%]' },
  { name: 'Web Development', width: 'w-[38%]' },
  { name: 'Data Structures', width: 'w-[60%]' },
  { name: 'UI/UX Design', width: 'w-[92%]' },
];

const steps = [
  {
    icon: ArrowUpTrayIcon,
    title: '1. Upload',
    text: 'Drop your syllabus, schedule, or assignment documents',
  },
  {
    icon: BrainIcon,
    title: '2. AI Extraction',
    text: 'Our AI analyzes deadlines, exams, and assignments automatically',
  },
  {
    icon: CheckCircleIcon,
    title: '3. Study Plan',
    text: 'Get a complete semester roadmap with smart recommendations',
  },
];

const features = [
  {
    icon: TargetIcon,
    title: 'AI Task Generation',
    text: 'Automatically break down assignments into actionable tasks with smart deadlines',
  },
  {
    icon: BrainIcon,
    title: 'Study Recommendations',
    text: 'Get personalized study strategies based on your workload and learning style',
  },
  {
    icon: MessageIcon,
    title: 'Class Chatbot',
    text: 'Ask questions about your classes and get instant AI-powered answers',
  },
  {
    icon: CalendarIcon,
    title: 'Timeline View',
    text: 'Visualize your entire semester at a glance with an intelligent calendar',
  },
];

export default function LandingPage() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <nav className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <a href="/" className="flex min-w-0 items-center gap-3 sm:gap-5">
            <img src="/studymaster-logo.svg" alt="" className="h-9 w-9 shrink-0 sm:h-10 sm:w-10" />
            <span className="truncate text-xl font-bold tracking-normal text-black sm:text-2xl md:text-[28px]">
              StudyMaster
            </span>
          </a>

          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={scrollToFeatures}
              className="hidden rounded-lg bg-slate-100 px-6 py-3 text-xs font-semibold text-slate-950 transition hover:bg-slate-200 sm:inline-flex"
            >
              features
            </button>
            <a
              href="/dashboard"
              className="rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-slate-200 sm:px-6 sm:py-3"
            >
              Login
            </a>
            <a
              href="/dashboard?auth=signup"
              className="rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-300 transition hover:bg-violet-700 sm:px-6 sm:py-3"
            >
              Signup
            </a>
          </div>
        </div>
      </nav>

      <main>
        <section className="bg-slate-50">
          <div className="mx-auto grid max-w-4xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_1.08fr] md:gap-12 lg:py-20">
            <div className="text-center md:text-left">
              <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[11px] font-medium text-slate-700">
                <SparkleIcon className="h-3 w-3 text-violet-600" />
                AI-Powered Study Assistant
              </div>

              <h1 className="mx-auto max-w-md text-4xl font-extrabold leading-[1.08] tracking-normal text-slate-900 sm:text-5xl md:mx-0">
                Turn your syllabus into a complete study plan
              </h1>
              <p className="mx-auto mt-6 max-w-md text-sm leading-6 text-slate-500 md:mx-0">
                Upload your class documents and let AI automatically organize your entire semester.
                Get smart recommendations, automated task generation, and personalized study
                strategies.
              </p>

              <div className="mt-7 flex flex-wrap justify-center gap-3 md:justify-start">
                <a
                  href="/dashboard?auth=signup"
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-violet-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"
                >
                  <ArrowUpTrayIcon className="h-3.5 w-3.5" />
                  Upload Syllabus
                  <ChevronRightIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[420px] px-1 sm:px-0">
              <div className="absolute -top-3 left-0 right-0 h-1 rounded-full bg-violet-600" />
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/70">
                <div className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-900">
                  <span className="text-violet-600">
                    <SparkleIcon className="h-3.5 w-3.5" />
                  </span>
                  Your Classes
                </div>

                <div className="space-y-3">
                  {classRows.map((row) => (
                    <div
                      key={row.name}
                      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <span className="text-xs font-medium text-slate-600">{row.name}</span>
                      <span className="h-1.5 w-16 rounded-full bg-slate-200">
                        <span
                          className={`block h-full rounded-full bg-violet-600 ${row.width}`}
                        />
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute -right-8 -top-4 hidden items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xl shadow-slate-300/60 sm:flex">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                  <BrainIcon className="h-5 w-5" />
                </span>
                <span className="text-[10px] font-semibold leading-tight text-slate-600">
                  AI Generated
                  <br />
                  <span className="text-slate-900">24 tasks</span>
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-white px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 md:text-4xl">How It Works</h2>
            <p className="mt-4 text-base font-medium text-slate-500">
              Get started in three simple steps
            </p>

            <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-3">
              {steps.map((step) => {
                const Icon = step.icon;

                return (
                  <div key={step.title} className="flex flex-col items-center text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white shadow-md shadow-violet-200">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-5 text-lg font-extrabold text-slate-900">{step.title}</h3>
                    <p className="mt-4 max-w-[270px] text-sm leading-6 text-slate-500">
                      {step.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-blue-500 bg-slate-50 px-4 py-14 sm:px-6 lg:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">
                Powerful Features
              </h2>
              <p className="mt-3 text-xs font-medium text-slate-500">
                Everything you need to succeed this semester
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <article
                    key={feature.title}
                    className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <h3 className="text-sm font-extrabold text-slate-900">{feature.title}</h3>
                    <p className="mt-3 text-xs leading-5 text-slate-500">{feature.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-14 text-center text-white sm:px-6">
          <h2 className="text-3xl font-extrabold md:text-4xl">Ready to ace this semester?</h2>
          <p className="mt-5 text-sm font-medium text-white/90">
            Join thousands of students using AI to stay organized and succeed
          </p>
          <a
            href="/dashboard?auth=signup"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-xs font-bold text-violet-600 shadow-lg shadow-blue-900/10 transition hover:bg-slate-50"
          >
            <ArrowUpTrayIcon className="h-3.5 w-3.5" />
            Get Started Now
            <ChevronRightIcon className="h-3.5 w-3.5" />
          </a>
        </section>
      </main>
    </div>
  );
}
