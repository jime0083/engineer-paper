import { HashRouter, Routes, Route } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AddressPage from './pages/AddressPage';
import ContactPage from './pages/ContactPage';
import SkillsPage from './pages/SkillsPage';
import WorkHistoryPage from './pages/WorkHistoryPage';
import SelfPRPage from './pages/SelfPRPage';
import CreationDatePage from './pages/CreationDatePage';
import ConfirmPage from './pages/ConfirmPage';
import CompletePage from './pages/CompletePage';
import PreviewPage from './pages/PreviewPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import './App.css';

function App() {
  return (
    <FormProvider>
      <HashRouter>
        <MainLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/step/1" element={<ProfilePage />} />
          <Route path="/step/2" element={<AddressPage />} />
          <Route path="/step/3" element={<ContactPage />} />
          <Route path="/step/4" element={<SkillsPage />} />
          <Route path="/step/5" element={<WorkHistoryPage />} />
          <Route path="/step/6" element={<SelfPRPage />} />
          <Route path="/step/7" element={<CreationDatePage />} />
          <Route path="/step/8" element={<ConfirmPage />} />
          <Route path="/step/9" element={<CompletePage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
        </Routes>
        </MainLayout>
      </HashRouter>
    </FormProvider>
  );
}

export default App;
