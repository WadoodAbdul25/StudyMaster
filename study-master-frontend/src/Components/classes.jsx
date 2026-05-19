import { useState } from 'react';
import { Link } from 'react-router-dom';

const classesData = [
  {
    id: 1,
    name: 'Web Development',
    code: 'CS 301',
    instructor: 'Dr. Johnson',
    progress: 82,
    assignments: 3,
    nextClass: 'Today • 2:00 PM',
    color: 'bg-indigo-500',
  },

  {
    id: 3,
    name: 'UI/UX Design',
    code: 'DES 204',
    instructor: 'Sarah Lee',
    progress: 91,
    assignments: 1,
    nextClass: 'Wednesday • 1:00 PM',
    color: 'bg-pink-500',
  },
  {
    id: 4,
    name: 'Computer Science',
    code: 'CS 101',
    instructor: 'Dr. Brown',
    progress: 74,
    assignments: 4,
    nextClass: 'Thursday • 9:00 AM',
    color: 'bg-green-500',
  },
];

const upcomingAssignments = [
  {
    id: 1,
    title: 'React Dashboard Project',
    course: 'Web Development',
    due: 'Due Tomorrow',
  },
  {
    id: 2,
    title: 'Binary Tree Quiz',
    course: 'Data Structures',
    due: 'Due Friday',
  },
  
];

const navItems = [
  'Dashboard',
  'Classes',
  'Calendar',
  'AI Assistant',
  'Settings',
];

export default function Classes() {
  const [activeNav, setActiveNav] = useState('Classes');
  const [selectedClass, setSelectedClass] = useState(classesData[0]);

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
              Study Tip
            </p>

            <p className="text-xs text-gray-500 leading-relaxed">
              Stay consistent by reviewing class notes for 15 minutes daily.
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
              placeholder="Search classes..."
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
              Your Classes
            </h1>

            <p className="text-sm text-gray-500">
              Track progress, assignments, and upcoming lectures.
            </p>
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
            
            {/* Left */}
            <div className="space-y-6">

              {/* Class Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {classesData.map((course) => (
                  <button
                    key={course.id}
                    onClick={() => setSelectedClass(course)}
                    className={`bg-white border rounded-xl p-5 text-left transition hover:border-indigo-200 ${
                      selectedClass.id === course.id
                        ? 'border-indigo-200'
                        : 'border-gray-100'
                    }`}>

                    {/* Top */}
                    <div className="flex items-start justify-between mb-5">
                      
                      <div>
                        <p className="text-lg font-semibold text-gray-800">
                          {course.name}
                        </p>

                        <p className="text-sm text-gray-400 mt-1">
                          {course.code}
                        </p>
                      </div>

                      <div className={`w-3 h-3 rounded-full ${course.color}`} />
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      
                      <div>
                        <p className="text-xs text-gray-400 mb-1">
                          Instructor
                        </p>

                        <p className="text-sm text-gray-700">
                          {course.instructor}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-400">
                            Progress
                          </p>

                          <p className="text-xs text-gray-500">
                            {course.progress}%
                          </p>
                        </div>

                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div>
                          <p className="text-xs text-gray-400">
                            Assignments
                          </p>

                          <p className="text-sm font-medium text-gray-700 mt-1">
                            {course.assignments}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs text-gray-400">
                            Next Class
                          </p>

                          <p className="text-sm font-medium text-gray-700 mt-1">
                            {course.nextClass}
                          </p>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Class */}
              <div className="bg-white border border-gray-100 rounded-xl">
                
                <div className="p-5 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-800">
                    {selectedClass.name}
                  </h2>

                  <p className="text-sm text-gray-400 mt-1">
                    {selectedClass.code} • {selectedClass.instructor}
                  </p>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedClass.progress}%
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Course Progress
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-2xl font-bold text-gray-800">
                      {selectedClass.assignments}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Active Assignments
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-gray-800">
                      {selectedClass.nextClass}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Upcoming Lecture
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">

              {/* Upcoming Assignments */}
              <div className="bg-white border border-gray-100 rounded-xl">
                
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-800">
                    Upcoming Work
                  </h2>

                  <button className="text-sm text-indigo-500">
                    View all
                  </button>
                </div>

                <div className="p-5 space-y-4">
                  {upcomingAssignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="border border-gray-100 rounded-xl p-4">
                      
                      <p className="text-sm font-medium text-gray-700">
                        {assignment.title}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {assignment.course}
                      </p>

                      <p className="text-xs text-indigo-500 mt-3 font-medium">
                        {assignment.due}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Reminder */}
              <div className="bg-indigo-500 rounded-xl p-5 text-white">
                
                <p className="text-sm font-semibold mb-2">
                  Weekly Goal
                </p>

                <p className="text-sm text-indigo-100 leading-relaxed">
                  Complete all assignments before Friday and maintain 80%+ progress in every class.
                </p>

                <button className="mt-5 bg-white text-indigo-500 px-4 py-2 rounded-lg text-sm font-medium">
                  View Study Plan
                </button>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}