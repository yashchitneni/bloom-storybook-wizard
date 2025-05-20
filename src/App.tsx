
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import WizardPage from './pages/WizardPage';
import AccountPage from './pages/AccountPage';
import SignupPage from './pages/SignupPage';
import StoryDetailPage from './pages/StoryDetailPage';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import SuccessPage from './pages/SuccessPage';
import { WizardProvider } from './contexts/WizardContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <WizardProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/wizard" element={<WizardPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/story/:id" element={<StoryDetailPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-right" />
      </WizardProvider>
    </Router>
  );
}

export default App;
