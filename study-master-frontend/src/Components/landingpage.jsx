import { useState } from 'react';

export default function LandingPage() {

  return (
    <div className="min-h-screen bg-gray-50">
        
        
        {/* Navigation bar */}
        <nav className="bg-white border-gray-200 px-7 h-13 border-b flex items-center justify-between">
            <p className="font-semibold text-gray-800">StudyMaster</p>

            <div className="flex items-center gap-5 py-2 px-4">
                <button className="text-sm text-gray-500">features</button>
                <button className="text-sm text-gray-500">pricing</button>
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
                    Turn your syllabus into a complete study plan</h2>
                <p className="text-gray-600 mb-8">
                    Upload your class documents and let AI automatically organize your entire
                    semester. Get smart recommendations, automated task generation, and personalized study strategies.</p>
                
                <div className="flex gap-4">
                    <button className="bg-indigo-500 text-white text-sm px-6 py-3 rounded-lg">
                    Upload syllabus </button>
                    <button className="border border-gray-200 text-sm px-6 py-3 rounded-lg">
                    See demo </button>
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
        <section className="bg-gray-100 py-16 px-7">

        </section>


        {/* get started section */}
        <section className="bg-gray-100 py-16 px-7">


        </section>
    </div>
  );
}