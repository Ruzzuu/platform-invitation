import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import TemplateDetails from './pages/TemplateDetails'
import CatalogPage from './pages/CatalogPage'
import AboutFaqPage from './pages/AboutFaqPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/template/:id" element={<TemplateDetails />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/about" element={<AboutFaqPage />} />
      </Route>
    </Routes>
  )
}
