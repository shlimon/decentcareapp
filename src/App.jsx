import ConflictOfInterestForm from '@components/Conflict-Of-Interest-comp/ConflictOfInterestForm';
import FinancialTransactionForms from '@components/financial-transaction/FinancialTransactionForms';
import MediaReleaseForm from '@components/media-release/MediaReleaseForm';
import PerformanceAppraisalDetails from '@components/performance-appraisal/PerformanceAppraisalDetails';
import StaffComplaintFeedbackForm from '@components/staff-complaint/StaffComplaintFeedbackForm';
import StaffComplaintForm from '@components/staff-complaint/StaffComplaintForm';
import WellbeingFollowupListDetails from '@components/wellbeing-followup/WellbeingFollowupListDetails';
import WHSForm from '@components/whs/WHSForm';
import useMarkNotificationRead from '@hooks/useMarkNotificationRead';
import AiDocChat from '@pages/ai-doc-chat/AiDocChat';
import AnnouncementDetails from '@pages/announce/AnnouncementDetails';
import ComplaintsForms from '@pages/Complaints/ComplaintsForms';
import ComplementFormPage from '@pages/Complaints/ComplementFormPage';
import SuggestionFormPage from '@pages/Complaints/SuggestionFormPage';
import ConflictOfInterestPage from '@pages/conflict-of-interest/ConflictOfInterestPage';
import DocumentDataPage from '@pages/document-data/DocumentDataPage';
import FinancialTransaction from '@pages/financial-transaction/FinancialTransaction';
import ComplaintForm from '@pages/forms/complaints-forms/ComplaintForm';
import Handbook from '@pages/handbook/Handbook';
import NotificationPage from '@pages/home/NotificationPage';
import AnnualLeaveDataShow from '@pages/leave-request/AnnualLeaveDataShow';
import AnnualLeaveForm from '@pages/leave-request/AnnualLeaveForm';
import LeaveRequestPage from '@pages/leave-request/LeaveRequestPage';
import SickLeaveDataShow from '@pages/leave-request/SickLeaveDataShow';
import SickLeaveForm from '@pages/leave-request/SickLeaveForm';
import UnpaidLeaveDataShow from '@pages/leave-request/UnpaidLeaveDataShow';
import UnpaidLeaveForm from '@pages/leave-request/UnpaidLeaveForm';
import MediaReleasePage from '@pages/media-release/MediaReleasePage';
import PerformanceAppraisalPage from '@pages/performance-appraisal/PerformanceAppraisalPage';
import Policy from '@pages/policy/Policy';
import Reimbursement from '@pages/reimbursement/Reimbursement';
import ReimbursementForm from '@pages/reimbursement/ReimbursementForm';
import StaffComplaintPage from '@pages/staff-complaint/StaffComplaintPage';
import TrainingList from '@pages/training-Form/TrainingList';
import WellbeingPage from '@pages/wellbeing/WellbeingPage';
import WHSPage from '@pages/whs/WHSpage';
import WorkDetail from '@pages/work/WorkDetail';
import WorkLogPage from '@pages/WorkLog/WorkLogPage';
import { Toaster } from 'react-hot-toast';
import { Navigate, Outlet, Route, Routes } from 'react-router';
import Layout from './components/Layout';
import { useAuth } from './context/auth';
import AddParticipant from './pages/add-participant/AddParticipant';
import Announcement from './pages/announce/Announcement';
import { FormsDetails } from './pages/forms-details/FormsDetails';
import Forms from './pages/forms/Forms';
import Login from './pages/login/Login';
import ResetPassword from './pages/login/ResetPassword';
import MedicationPage from './pages/medication/MedicationPage';
import MedicationParticipantSelectionPage from './pages/medication/MedicationParticipantSelectionPage';
import SingleMedicationPage from './pages/medication/SingleMedicationPage';
import { NotFound } from './pages/not-found/NotFound';
import ParticipantIncidentPage from './pages/ParticipantIncidentPage';
import Profile from './pages/profile/Profile';
import Resource from './pages/resource/Resource';
import ResourceDetail from './pages/resource/ResourceDetail';
import TravelLogPage from './pages/travel-log/TravelLogPage';
import Work from './pages/work/Work';

// Private Route
const PrivateRoute = () => {
  const { isLoggedIn, loading, userData } = useAuth();

  if (loading) {
    return null;
  }

  return isLoggedIn && userData ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  useMarkNotificationRead();
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
            <Route index element={<NotificationPage />} />
            <Route path="/announcements" element={<Announcement />} />
            <Route
              path="/announcements/:id"
              element={<AnnouncementDetails />}
            />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:id" element={<WorkDetail />} />
            <Route path="/work/travel-log" element={<TravelLogPage />} />
            <Route path="/work/document-data" element={<DocumentDataPage />} />
            <Route path="/work/leave-request" element={<LeaveRequestPage />} />
            <Route
              path="/work/leave-request/annual"
              element={<AnnualLeaveDataShow />}
            />
            <Route
              path="/work/leave-request/annual/form"
              element={<AnnualLeaveForm />}
            />
            <Route
              path="/work/leave-request/sick"
              element={<SickLeaveDataShow />}
            />
            <Route
              path="/work/leave-request/sick/form"
              element={<SickLeaveForm />}
            />
            <Route
              path="/work/leave-request/unpaid"
              element={<UnpaidLeaveDataShow />}
            />
            <Route
              path="/work/leave-request/unpaid/form"
              element={<UnpaidLeaveForm />}
            />
            <Route path="/work/timesheet" element={<WorkLogPage />} />
            <Route path="/work/reimbursement" element={<Reimbursement />} />
            <Route
              path="/work/reimbursement-form"
              element={<ReimbursementForm />}
            />
            <Route
              path="/work/my-wellbeing-notes"
              element={<WellbeingPage />}
            />

            <Route
              path="/work/my-wellbeing-notes/:id/details/:followUpId"
              element={<WellbeingFollowupListDetails />}
            />

            <Route
              path="/work/my-performance-appraisal"
              element={<PerformanceAppraisalPage />}
            />

            <Route
              path="/work/my-performance-appraisal/:id/details/:appraisalId"
              element={<PerformanceAppraisalDetails />}
            />

            <Route path="/work/training-form" element={<TrainingList />} />

            <Route path="/work/WHS-form" element={<WHSPage />} />

            <Route path="/work/WHS-form/create" element={<WHSForm />} />

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
              element={<MedicationParticipantSelectionPage />}
            />
            <Route
              path="/work/staff-complaint"
              element={<StaffComplaintPage />}
            />
            <Route
              path="/work/staff-complaint/ComplaintForm"
              element={<StaffComplaintForm />}
            />

            <Route
              path="/work/staff-complaint/FeedbackForm"
              element={<StaffComplaintFeedbackForm />}
            />

            <Route
              path="/medication/:participantId"
              element={<MedicationPage />}
            />
            <Route
              path="/medication/:medicationId/:participantId"
              element={<SingleMedicationPage />}
            />

            <Route
              path="/forms/financial-transaction"
              element={<FinancialTransaction />}
            />
            <Route
              path="/forms/financial-transaction/forms"
              element={<FinancialTransactionForms />}
            />
            <Route path="/forms/media-release" element={<MediaReleasePage />} />
            <Route
              path="/forms/media-release/form"
              element={<MediaReleaseForm />}
            />
            <Route
              path="/forms/conflict-of-interest"
              element={<ConflictOfInterestPage />}
            />
            <Route
              path="/forms/conflict-of-interest/create"
              element={<ConflictOfInterestForm />}
            />

            <Route path="/resource" element={<Resource />} />
            <Route path="/resource/:id" element={<ResourceDetail />} />

            <Route path="/resource/policy" element={<Policy />} />
            <Route path="/resource/handbook" element={<Handbook />} />
            <Route
              path="/resource/chat/:id/version/:versionId"
              element={<AiDocChat />}
            />

            <Route path="/add-participant" element={<AddParticipant />} />
            <Route path="/profile" element={<Profile />} />

            {/* Complaints Pages */}
            <Route path="/forms/complaint" element={<ComplaintsForms />} />
            <Route
              path="/complaints/complaint-form"
              element={<ComplaintForm />}
            />
            <Route
              path="/complaints/complement-form"
              element={<ComplementFormPage />}
            />
            {/* <Route
                     path="/complaints/concern-form"
                     element={<ConcernFormPage />}
                  /> */}
            <Route
              path="/complaints/suggestion-form"
              element={<SuggestionFormPage />}
            />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-left" />
    </>
  );
}

export default App;
