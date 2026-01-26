import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { GetSafeAreaInsetDemo } from './pages/demos/GetSafeAreaInsetDemo.tsx';
import { IsServerDemo } from './pages/demos/IsServerDemo.tsx';
import { UseSafeAreaInsetDemo } from './pages/demos/UseSafeAreaInsetDemo.tsx';
import { Home } from './pages/Home.tsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/demos/is-server" element={<IsServerDemo />} />
        <Route path="/demos/get-safe-area-inset" element={<GetSafeAreaInsetDemo />} />
        <Route path="/demos/use-safe-area-inset" element={<UseSafeAreaInsetDemo />} />
      </Routes>
    </BrowserRouter>
  );
}
