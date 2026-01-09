/**
 * AgroFarm Application Root
 * 
 * Clean, modular structure with:
 * - Lazy-loaded routes for better performance
 * - Separated route configurations
 * - Enhanced UI components
 * - Scroll-to-top functionality
 */
import { BrowserRouter } from 'react-router-dom';
import { Navbar } from './components';
import { Footer, ScrollToTop } from './components/common';
import { AppRoutes } from './routes/AppRoutes';
import { useScrollToTop } from './hooks';

// Scroll to top on route change wrapper
function ScrollToTopOnNavigate() {
  useScrollToTop({ behavior: 'smooth' });
  return null;
}

function App() {
  return (
    <BrowserRouter>
      {/* Auto scroll to top on navigation */}
      <ScrollToTopOnNavigate />
      
      <div className="flex flex-col min-h-screen">
        {/* Navigation Header */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <AppRoutes />
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Floating Scroll to Top Button */}
        <ScrollToTop />
      </div>
    </BrowserRouter>
  );
}

export default App;
