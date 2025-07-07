import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePgae";
import DashboardLayout from "./components/admin/layout/DashboardLayout";
import HomeDashboard from "./pages/DashBoard/HomeDashboard";
import ActivitiesPage from "./pages/DashBoard/ActivitiesPage";
import NotFound from "./pages/NotFound";
import { MessageDisplay, useGlobalMessage } from "./utils/messageUtils";


function App() {
  const { messageState, clearMessage } = useGlobalMessage();
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardLayout />} >
          <Route path="" element={<HomeDashboard />} />
          <Route path="activities" element={<ActivitiesPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MessageDisplay messageState={messageState} onClose={clearMessage} />
    </BrowserRouter>
  );
}

export default App;
