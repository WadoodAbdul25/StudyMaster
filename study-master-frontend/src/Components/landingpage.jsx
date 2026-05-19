import { useState } from 'react';
import UploadModal from './uploadModal';

export default function LandingPage() {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
        
        
        {/* Navigation bar */}
        <nav className="bg-white border-gray-200 px-7 h-13 border-b flex items-center justify-between">
            <p className="font-semibold text-gray-800">StudyMaster</p>

            <div className="flex items-center gap-5 py-2 px-4">
                <button 
                    onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })}
                    className="text-sm text-gray-500">
                        features
                </button>
                <button className="text-sm text-gray-500">pricing</button>
                <a href="/dashboard" className="text-sm text-gray-500">Dashboard</a>
                <button className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg">
                    Sign up
                </button>     
            </div>
        
        </nav>

        {/* upload see demo section */}
        <section className="bg-gray-100 py-16 px-7">
            <div className="flex flex-col md:flex-row items-center gap-12">
 
                <div className="flex-1">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Turn your syllabus into a complete study plan
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Upload your class documents and let AI automatically organize your entire
                        semester. Get smart recommendations, automated task generation, and personalized study strategies.
                    </p>
                    
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setShowUpload(true)}
                            className="bg-indigo-500 text-white text-sm px-6 py-3 rounded-lg">
                            Upload syllabus
                        </button>
                        <button className="border border-gray-200 text-sm px-6 py-3 rounded-lg">
                            See demo
                        </button>
                </div>

            </div>

            <div className="flex-1 border border-gray-300 rounded-lg p-6 bg-white">
                <p className="text-gray-800 text-sm">Your classes</p>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500">Computer Science 101</p>
                <span className="w-24 h-1 bg-indigo-100 rounded-full">
                    <div className="w-1/4 h-full bg-indigo-500 rounded-full"></div>
                </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500">Web Development</p>
                <span className="w-24 h-1 bg-indigo-100 rounded-full">
                    <div className="w-1/2 h-full bg-indigo-500 rounded-full"></div>
                </span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <p className="text-xs text-gray-500">Data Structures</p>
                <span className="w-24 h-1 bg-indigo-100 rounded-full">
                    <div className="w-3/4 h-full bg-indigo-500 rounded-full"></div>
                </span>
                </div>

                <div className="flex items-center justify-between py-2">
                <p className="text-xs text-gray-500">UI/UX Design</p>
                <span className="w-24 h-1 bg-indigo-100 rounded-full">
                    <div className="w-full h-full bg-indigo-500 rounded-full"></div>
                </span>
                </div>
            </div>

        </div>
        </section>


        {/* How it works section */}

        <section className="bg-gray-100 border-b border-t py-16 px-7">
        <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How it Works</h2>
            <p className="text-gray-600 mb-12">Get started in three simple steps: </p>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1 bg-white rounded-lg p-6 shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Upload </h3>
                    <p className="text-gray-600 text-sm">Drop your syllabus, schedule, or assignment documents.</p>
                </div>
                <div className="flex-1 bg-white rounded-lg p-6 shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">2. AI Extraction</h3>
                    <p className="text-gray-600 text-sm">Our AI analyzes deadlines, and assignments automatically.</p>
                </div>
                <div className="flex-1 bg-white rounded-lg p-6 shadow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Study Plan</h3>
                    <p className="text-gray-600 text-sm">Get a complete semester roadmap with smart recommendations.</p>
                </div>
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
 
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-800 mb-1">AI task generation</p>
                    <p className="text-xs text-gray-400">Automatically break down assignments into actionable tasks with smart deadlines</p>
                </div>
 
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-800 mb-1">Study recommendations</p>
                    <p className="text-xs text-gray-400">Get personalized study strategies based on your workload and learning style</p>
                </div>
 
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-800 mb-1">Class chatbot</p>
                    <p className="text-xs text-gray-400">Ask questions about your classes and get instant AI-powered answers</p>
                </div>
 
                <div className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="text-sm font-medium text-gray-800 mb-1">Timeline view</p>
                    <p className="text-xs text-gray-400">Visualize your entire semester at a glance with an intelligent calendar</p>
                </div>
 
            </div>
        </section>


        {/* get started section */}
        <section className="bg-indigo-500 px-6 py-14 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to ace this semester?</h2>
            <p className="text-sm text-indigo-100 mb-6">Join thousands of students using AI to stay organized and succeed</p>
            <button 
                onClick={() => setShowUpload(true)}
                className="bg-white text-indigo-500 text-sm font-medium px-6 py-2.5 rounded-lg">
                Get started now →
            </button>
        </section>


        {/* Upload Modal */}
         {showUpload && (
            <UploadModal
                onClose={() => setShowUpload(false)}
                onUploadSuccess={() => window.location.reload()}
            />
        )}

    </div>
  );
}