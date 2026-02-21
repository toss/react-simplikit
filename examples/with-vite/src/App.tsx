import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { BodyScrollLockUtilDemo } from './pages/demos/BodyScrollLockUtilDemo.tsx';
import { GetSafeAreaInsetDemo } from './pages/demos/GetSafeAreaInsetDemo.tsx';
import { IsServerDemo } from './pages/demos/IsServerDemo.tsx';
import { UseBodyScrollLockDemo } from './pages/demos/UseBodyScrollLockDemo.tsx';
import { UseNetworkStatusDemo } from './pages/demos/UseNetworkStatusDemo.tsx';
import { UsePageVisibilityDemo } from './pages/demos/UsePageVisibilityDemo.tsx';
import { UseSafeAreaInsetDemo } from './pages/demos/UseSafeAreaInsetDemo.tsx';
import { UseScrollDirectionDemo } from './pages/demos/UseScrollDirectionDemo.tsx';
import { UseVisualViewportDemo } from './pages/demos/UseVisualViewportDemo.tsx';
import { Home } from './pages/Home.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demos/is-server" element={<IsServerDemo />} />
        <Route path="/demos/get-safe-area-inset" element={<GetSafeAreaInsetDemo />} />
        <Route path="/demos/use-safe-area-inset" element={<UseSafeAreaInsetDemo />} />
        <Route path="/demos/use-body-scroll-lock" element={<UseBodyScrollLockDemo />} />
        <Route path="/demos/use-page-visibility" element={<UsePageVisibilityDemo />} />
        <Route path="/demos/use-network-status" element={<UseNetworkStatusDemo />} />
        <Route path="/demos/use-scroll-direction" element={<UseScrollDirectionDemo />} />
        <Route path="/demos/use-visual-viewport" element={<UseVisualViewportDemo />} />
        <Route path="/demos/body-scroll-lock-util" element={<BodyScrollLockUtilDemo />} />
      </Routes>
    </BrowserRouter>
  );
}
