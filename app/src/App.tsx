import { Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { NotFound } from "./components/NotFound";
import { LandingPage } from "./pages/LandingPage";
import { MintPage } from "./pages/MintPage";
import { ProfilePage } from "./pages/ProfilePage";
import { EditProfilePage } from "./pages/EditProfilePage";
import { DeveloperResourcesPage } from "./pages/DeveloperResourcesPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/mint" element={<MintPage />} />
        <Route path="/profile/:address" element={<ProfilePage />} />
        <Route path="/edit" element={<EditProfilePage />} />
        <Route path="/resources" element={<DeveloperResourcesPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
