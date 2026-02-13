import { useState } from 'react'
import './App.css'
import UploadSection from './components/UploadSection'
import ChatSection from './components/ChatSection'

function App() {

  return (
    <>
   <div className="min-h-screen bg-gray-100 flex justify-center p-10">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          📄 Local PDF Talker
        </h1>

        <UploadSection />
        <ChatSection />
      </div>
    </div>
    </>
  )
}

export default App
