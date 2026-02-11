/**
 * AgroFarm Application Root
 */
import { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { Navbar, Footer } from './components';
import AppRoutes from './routes';

// Global scroll-to-top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <AppRoutes />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
