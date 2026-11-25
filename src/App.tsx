import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home';

const InterviewFramework = React.lazy(() => import('./routes/InterviewFramework'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/interview-framework" element={<InterviewFramework />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
