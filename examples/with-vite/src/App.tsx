import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { IsServerDemo } from './pages/demos/IsServerDemo.tsx';
import { Home } from './pages/Home.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demos/is-server" element={<IsServerDemo />} />
      </Routes>
    </BrowserRouter>
  );
}
