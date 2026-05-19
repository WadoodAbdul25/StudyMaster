const DashboardIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-8.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BookIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 5.5A2.5 2.5 0 0 1 7.5 3H20v16H7.5A2.5 2.5 0 0 0 5 21V5.5Zm0 0A2.5 2.5 0 0 0 7.5 8H20"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlanIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M8 4v3m8-3v3M5 9h14M7 5h10a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm2 8h6m-6 4h4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LogoutIcon = ({ className = 'h-5 w-5' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M10 6H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h4m5-4 3-3m0 0-3-3m3 3H9"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const navItems = [
  { label: 'Dashboard', icon: DashboardIcon, active: true },
  { label: 'Classes', icon: BookIcon },
  { label: 'Study Plans', icon: PlanIcon },
];

export default function Sideboard({ activeView = 'dashboard', onNavigate, onLogout }) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-6 lg:flex">
        <a href="/" className="mb-10 flex items-center gap-3 px-1">
          <img src="/studymaster-logo.svg" alt="" className="h-11 w-11" />
          <span className="text-xl font-extrabold text-slate-800">StudyMaster</span>
        </a>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const view = item.label === 'Study Plans' ? 'studyPlans' : item.label.toLowerCase();
            const active = activeView === view;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(view)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  active
                    ? 'bg-violet-50 text-violet-600'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          type="button"
          onClick={onLogout}
          className="mt-auto flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-bold text-slate-600 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600"
        >
          <LogoutIcon className="h-5 w-5" />
          Logout
        </button>
      </aside>

      <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-4 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-300/60 backdrop-blur lg:hidden">
        {navItems.map((item) => {
          const Icon = item.icon;
          const view = item.label === 'Study Plans' ? 'studyPlans' : item.label.toLowerCase();
          const active = activeView === view;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate(view)}
              className={`flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-extrabold transition ${
                active ? 'bg-violet-50 text-violet-600' : 'text-slate-500'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="leading-none">{item.label === 'Study Plans' ? 'Plans' : item.label}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={onLogout}
          className="flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-xl px-2 text-[11px] font-extrabold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogoutIcon className="h-5 w-5" />
          <span className="leading-none">Logout</span>
        </button>
      </nav>
    </>
  );
}
