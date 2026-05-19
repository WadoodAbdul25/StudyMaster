import { useState } from 'react';

const mockTasks = [
  { id: 1, title: 'Complete React Assignment', course: 'Web Development', time: '2 hours', priority: 'high', done: false },
  { id: 2, title: 'Study for Midterm', course: 'Computer Science', time: '4 hours', priority: 'medium', done: false },
  { id: 3, title: 'Review Chapter 5', course: 'Data Structures', time: '6 hours', priority: 'low', done: false },
  { id: 4, title: 'UI/UX Design Project', course: 'UI/UX Design', time: '1 day', priority: 'medium', done: false },
];

const aiMessages = [
  {
    from: 'AI',
    text: 'Hi Alex! I noticed you have a Web Development assignment due soon.',
  },
  {
    from: 'user',
    text: 'Can you help me organize this week?',
  },
  {
    from: 'AI',
    text: 'Absolutely — I created a study plan prioritizing your React assignment and midterm prep.',
  },
];

const navItems = [
  'Dashboard',
  'Classes',
  'Calendar',
  'AI Assistant',
  'Settings',
];

const stats = [
  { label: 'Tasks Due', value: 8 },
  { label: 'Upcoming Exams', value: 2 },
  { label: 'Completed', value: 24 },
  { label: 'Overdue', value: 3 },
];

export default function Dashboard() {
  const [tasks, setTasks] = useState(mockTasks);
  const [messages, setMessages] = useState(aiMessages);
  const [chatInput, setChatInput] = useState('');
  const [activeNav, setActiveNav] = useState('Dashboard');

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;

    setMessages([
      ...messages,
      {
        from: 'user',
        text: chatInput,
      },
    ]);

    setChatInput('');

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'AI',
          text: "I'll help you build a study schedule for that.",
        },
      ]);
    }, 700);
  };

  const priorityStyles = {
    high: 'bg-red-50 text-red-500',
    medium: 'bg-orange-50 text-orange-500',
    low: 'bg-green-50 text-green-500',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
        
        {/* Logo */}
        <div className="h-14 border-b border-gray-100 flex items-center px-6">
          <p className="font-semibold text-gray-800">
            StudyMaster
          </p>
        </div>

        {/* Navigation */}
        <div className="flex-1 px-3 py-5">
          <div className="space-y-1">
            {navItems.map((item) => {
              const routeMap = {
                'Dashboard': '/dashboard',
                'Classes': '/classes',
                'Calendar': '/calendar',
                'AI Assistant': '/ai',
                'Settings': '/settings',
              };
              return (
                <Link
                  key={item}
                  to={routeMap[item]}
                  onClick={() => setActiveNav(item)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition block ${
                    activeNav === item
                      ? 'bg-indigo-50 text-indigo-500 font-medium'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}>
                  {item}
                </Link>
              );
            })}
          </div>

          {/* Tip Card */}
          <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-medium text-indigo-500 mb-1">
              AI Tip
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              Ask AI to automatically create a study plan for your exams.
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <div className="h-14 bg-white border-b border-gray-100 px-6 flex items-center justify-between">
          
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search classes or tasks..."
              className="w-full bg-gray-100 border border-gray-100 rounded-lg px-4 py-2 text-sm outline-none focus:border-indigo-200"/>
          </div>

          <div className="ml-4 w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-medium">
            A
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, Alex
            </h1>

            <p className="text-sm text-gray-500">
              You have 3 assignments due this week.
            </p>
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
            
            {/* Left */}
            <div className="space-y-6">

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white border border-gray-100 rounded-xl p-5">
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tasks */}
              <div className="bg-white border border-gray-100 rounded-xl">
                
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">
                    Today's Tasks
                  </h2>

                  <button className="text-sm text-indigo-500">
                    View all
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between" >
                      <div className="flex items-start gap-3">
                        
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`mt-1 w-5 h-5 rounded border flex items-center justify-center ${
                            task.done
                              ? 'bg-indigo-500 border-indigo-500'
                              : 'border-gray-300'
                          }`}>
                          {task.done && (
                            <span className="text-white text-xs">
                              ✓
                            </span>
                          )}
                        </button>

                        <div>
                          <p
                            className={`text-sm ${
                              task.done
                                ? 'line-through text-gray-400'
                                : 'text-gray-700'
                            }`}>
                            {task.title}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {task.course} • {task.time}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-2 py-1 rounded-md font-medium ${priorityStyles[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            <div className="bg-white border border-gray-100 rounded-xl flex flex-col h-[600px]">
              
              {/* Header */}
              <div className="p-5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800 mb-1">
                  AI Assistant
                </h2>

                <p className="text-xs text-gray-400">
                  Ask questions about your schedule or classes
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.from === 'user'
                        ? 'justify-end'
                        : 'justify-start'
                    }`}>
                    <div
                      className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                        msg.from === 'user'
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="px-5 pb-3 flex gap-2">
                <button
                  onClick={() => setChatInput('Plan my week')}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-50" >
                  Plan my week
                </button>

                <button
                  onClick={() => setChatInput('Summarize my assignments')}
                  className="text-xs border border-gray-200 rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-50">
                  Summarize assignments
                </button>
              </div>

              {/* Input */}
              <div className="p-5 pt-0 flex gap-2">
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === 'Enter' && sendMessage()
                  }
                  placeholder="Ask AI anything..."
                  className="flex-1 bg-gray-100 border border-gray-100 rounded-lg px-4 py-3 text-sm outline-none focus:border-indigo-200"
                />

                <button
                  onClick={sendMessage}
                  className="bg-indigo-500 text-white px-4 rounded-lg text-sm">
                  Send
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
