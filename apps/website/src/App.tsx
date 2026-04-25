import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Media } from './pages/Media';
import { Events } from './pages/Events';
import { Communities } from './pages/Communities';
import { Contact } from './pages/Contact';

import { Library } from './pages/Library';
import { WeeklyTeachings } from './pages/WeeklyTeachings';
import { FullGallery } from './pages/Gallery';
import { Give } from './pages/Give';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="media" element={<Media />} />
          <Route path="events" element={<Events />} />
          <Route path="communities" element={<Communities />} />
          <Route path="contact" element={<Contact />} />

          <Route path="library" element={<Library />} />
          <Route path="weekly-teachings" element={<WeeklyTeachings />} />
          <Route path="gallery" element={<FullGallery />} />
          <Route path="give" element={<Give />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

