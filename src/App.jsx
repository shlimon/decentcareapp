import { useAuth } from "./context/auth";

// Layout & Pages
import { Navigate, Outlet, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import { ReusableTableNayeemTest } from "./components/reusable/ReusableTableNayeemTest";
import AddParticipant from "./pages/add-participant/AddParticipant";
import Announce from "./pages/announce/announce";
import { FormsDetails } from "./pages/forms-details/FormsDetails";
import Forms from "./pages/forms/Forms";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { NotFound } from "./pages/not-found/NotFound";
import FormPage from "./pages/react-form/FormPage";
import Resource from "./pages/resource/Resource";
import ResourceDetail from "./pages/resource/ResourceDetail";
import Table from "./pages/tanstack-table/table";
import Work from "./pages/work/Work";
import WorkDetail from "./pages/work/WorkDetail";
import PerticipentStaff from "./pages/work/perticipent-staff/PerticipentStaff";

// Private Route
const PrivateRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/announce" element={<Announce />} />
          <Route path="/work" element={<Work />} />
          <Route path="/work/:id" element={<WorkDetail />} />
          <Route path="/forms">
            <Route index element={<Forms />} />
            <Route path=":formsId" element={<FormsDetails />} />
          </Route>
          <Route path="/resource" element={<Resource />} />
          <Route path="/resource/:id" element={<ResourceDetail />} />
          <Route path="/add-participant" element={<AddParticipant />} />
          <Route path="/PerticipentStaff" element={<PerticipentStaff />} />
          <Route
            path="/ReusableTableNayeemTest"
            element={<ReusableTableNayeemTest />}
          />
          <Route path="/tanstack-table" element={<Table />} />
          <Route path="/react-form" element={<FormPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
