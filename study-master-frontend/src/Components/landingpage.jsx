import { useState } from 'react';

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-300">
        
        
        {/* Navigation bar */}
        <nav className="bg-white border-gray-200 px-7 h-13 flex items-center justify-between">
            <p className="font-semibold text-gray-800">StudyMaster</p>

            <div className="flex items-center gap-4">
                <button className="text-sm text-gray-500">features</button>
                <button className="text-sm text-gray-500">pricing</button>
                <button className="bg-indigo-500 text-white text-small px-4 py-2 rounded-lg">
                    Sign up
                </button>     
            </div>
        
        </nav>

        {/* upload section */}
        <section className="bg-gray-100 py-16 px-7">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Turn your syllabus into a complete study plan</h2>
            <p className="text-gray-600 mb-8">
                Upload your class documents and let AI automatically organize your entire
                semester. Get smart recommendations, automated task generation, and personalized study strategies.</p>
            
            <div className="flex gap-3 mt-6">
                <button className="bg-indigo-500 text-white text-small px-6 py-3 rounded-lg">
                Upload syllabus </button>
                <button className="border border-gray-200 text-sm px-6 py-3 rounded-lg">
                See demo </button>
            </div>
            


        </section>


    </div>
  );
}