import './index.css'
import './App.css'
import { StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider.tsx"
import CreateTrainingPage from "@/pages/create/create-training.page.tsx";
import ListTrainingPage from "@/pages/list/list-training.page.tsx";
import TrainingPage from "@/pages/training/TrainingPage.tsx";
import Layout from "@/layout.tsx";
import { APP_CONFIG } from "@/constants/config";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Layout>
              <Routes>
                    <Route path={APP_CONFIG.ROUTES.HOME} element={<ListTrainingPage />} />
                    <Route path={APP_CONFIG.ROUTES.CREATE} element={<CreateTrainingPage />} />
                    <Route path={APP_CONFIG.ROUTES.LIST} element={<ListTrainingPage />} />
                    <Route path={APP_CONFIG.ROUTES.TRAINING} element={<TrainingPage />} />
                    <Route path="*" element={<ListTrainingPage />} />
              </Routes>
          </Layout>
      </ThemeProvider>
  </BrowserRouter>
</StrictMode>,
)
