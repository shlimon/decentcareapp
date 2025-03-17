import { Route, Routes } from "react-router";
import Layout from "./components/Layout";
import Announce from "./pages/announce/announce";
import { FormsDetails } from "./pages/forms-details/FormsDetails";
import Forms from "./pages/forms/Forms";
import Home from "./pages/home/home";
import { NotFound } from "./pages/not-found/NotFound";
import Resource from "./pages/resource/Resource";
import Work from "./pages/work/work";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/announce" element={<Announce />} />
        <Route path="/work" element={<Work />} />
        <Route path="/forms">
          <Route index element={<Forms />} />
          <Route path=":formsId" element={<FormsDetails />} />
        </Route>
        <Route path="/resource" element={<Resource />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
