import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import AddParticipant from "./pages/add-participant/AddParticipant";
import Announce from "./pages/announce/announce";
import { FormsDetails } from "./pages/forms-details/FormsDetails";
import Forms from "./pages/forms/Forms";
import Home from "./pages/home/Home";
import { NotFound } from "./pages/not-found/NotFound";
import FormPage from "./pages/react-form/FormPage";
import Resource from "./pages/resource/Resource";
import ResourceDetail from "./pages/resource/ResourceDetail";
import Table from "./pages/tanstack-table/table";
import Work from "./pages/work/Work";
import WorkDetail from "./pages/work/WorkDetail";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/announce" element={<Announce />} />
        <Route path="/work" element={<Work />} />
        <Route path="/work/:id" element={<WorkDetail />} />
        <Route path="/forms">
          <Route index element={<Forms />} />
          <Route path=":formsId" element={<FormsDetails />} />
        </Route>
        <Route path="/add-participant" element={<AddParticipant />} />
        <Route path="/resource" element={<Resource />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/tanstack-table" element={<Table />} />
        <Route path="/react-form" element={<FormPage />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
