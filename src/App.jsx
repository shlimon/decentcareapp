import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Announce from "./pages/announce/announce";
import { FormsDetails } from "./pages/forms-details/FormsDetails";
import Forms from "./pages/forms/Forms";
import Home from "./pages/home/Home";
import { NotFound } from "./pages/not-found/NotFound";
import Resource from "./pages/resource/Resource";
import ResourceDetail from "./pages/resource/ResourceDetail";
import Table from "./pages/tanstack-table/table";
import Work from "./pages/work/Work";
import WorkDetail from "./pages/work/WorkDetail";
import TableTest from "./pages/work/TableTest";
import { ReusableTableNayeemTest } from "./components/reusable/ReusableTableNayeemTest";

function App() {
   return (
      <Routes>
         <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/announce" element={<Announce />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:id" element={<WorkDetail />} />
            <Route path="/TableTest" element={<TableTest />} />
            <Route
               path="/ReusableTableNayeemTest"
               element={<ReusableTableNayeemTest />}
            />
            <Route path="/forms">
               <Route index element={<Forms />} />
               <Route path=":formsId" element={<FormsDetails />} />
            </Route>
            <Route path="/resource" element={<Resource />} />
            <Route path="/resource/:id" element={<ResourceDetail />} />
            <Route path="/tanstack-table" element={<Table />} />
         </Route>

         <Route path="*" element={<NotFound />} />
      </Routes>
   );
}

export default App;
