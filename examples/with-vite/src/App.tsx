import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { BodyScrollLockUtilDemo } from './pages/demos/BodyScrollLockUtilDemo.tsx';
import { IsServerDemo } from './pages/demos/IsServerDemo.tsx';
import { UseBodyScrollLockDemo } from './pages/demos/UseBodyScrollLockDemo.tsx';
import { UseScrollDirectionDemo } from './pages/demos/UseScrollDirectionDemo.tsx';
import { UseVisualViewportDemo } from './pages/demos/UseVisualViewportDemo.tsx';
import { Home } from './pages/Home.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demos/is-server" element={<IsServerDemo />} />
        <Route path="/demos/use-body-scroll-lock" element={<UseBodyScrollLockDemo />} />
        <Route path="/demos/use-scroll-direction" element={<UseScrollDirectionDemo />} />
        <Route path="/demos/use-visual-viewport" element={<UseVisualViewportDemo />} />
        <Route path="/demos/body-scroll-lock-util" element={<BodyScrollLockUtilDemo />} />
      </Routes>
    </BrowserRouter>
  );
}
