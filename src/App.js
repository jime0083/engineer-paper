import { HashRouter, Routes, Route } from 'react-router-dom';
import { FormProvider } from './context/FormContext';
import MainLayout from './components/layout/MainLayout';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import AddressPage from './pages/AddressPage';
import ContactPage from './pages/ContactPage';
import SummaryPage from './pages/SummaryPage';
import SkillsPage from './pages/SkillsPage';
import WorkHistoryPage from './pages/WorkHistoryPage';
import SelfPRPage from './pages/SelfPRPage';
import CreationDatePage from './pages/CreationDatePage';
import ConfirmPage from './pages/ConfirmPage';
import CompletePage from './pages/CompletePage';
import PreviewPage from './pages/PreviewPage';
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
          <Route path="/step/4" element={<SummaryPage />} />
          <Route path="/step/5" element={<SkillsPage />} />
          <Route path="/step/6" element={<WorkHistoryPage />} />
          <Route path="/step/7" element={<SelfPRPage />} />
          <Route path="/step/8" element={<CreationDatePage />} />
          <Route path="/step/9" element={<ConfirmPage />} />
          <Route path="/step/10" element={<CompletePage />} />
          <Route path="/preview" element={<PreviewPage />} />
        </Routes>
        </MainLayout>
      </HashRouter>
    </FormProvider>
  );
}

export default App;
