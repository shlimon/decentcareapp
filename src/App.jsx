import { Toaster } from 'react-hot-toast';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import { useAuth } from './context/auth';
import AddParticipant from './pages/add-participant/AddParticipant';
import Announcement from './pages/announce/Announcement';
import { FormsDetails } from './pages/forms-details/FormsDetails';
import Forms from './pages/forms/Forms';
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import ResetPassword from './pages/login/ResetPassword';
import MedicationPage from './pages/MedicationPage';
import { NotFound } from './pages/not-found/NotFound';
import ParticipantIncidentPage from './pages/ParticipantIncidentPage';
import Profile from './pages/profile/Profile';
import Resource from './pages/resource/Resource';
import ResourceDetail from './pages/resource/ResourceDetail';
import TravelLogPage from './pages/travel-log/TravelLogPage';
import Work from './pages/work/Work';
import WorkDetail from './pages/work/WorkDetail';

// Private Route
const PrivateRoute = () => {
  const { isLoggedIn, loading, userData } = useAuth();

  if (loading) {
    return null;
  }

  return isLoggedIn && userData ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  const { isLoggedIn, loading, userData } = useAuth();
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            !loading && isLoggedIn && userData ? (
              <Navigate to="/" replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            !loading && isLoggedIn && userData ? (
              <Navigate to="/" replace />
            ) : (
              <ResetPassword />
            )
          }
        />

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/announce" element={<Announcement />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:id" element={<WorkDetail />} />
            <Route path="/work/travel-log" element={<TravelLogPage />} />
            <Route path="/forms">
              <Route index element={<Forms />} />
              <Route path=":formsId" element={<FormsDetails />} />
            </Route>
            <Route
              path="/forms/participant-incident"
              element={<ParticipantIncidentPage />}
            />
            <Route
              path="/forms/participant-medication"
              element={<MedicationPage />}
            />
            <Route path="/resource" element={<Resource />} />
            <Route path="/resource/:id" element={<ResourceDetail />} />
            <Route path="/add-participant" element={<AddParticipant />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
