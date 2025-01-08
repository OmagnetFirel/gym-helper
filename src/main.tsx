import './index.css'
import './App.css'
import { StrictMode } from 'react'
import {BrowserRouter, Routes, Route} from "react-router"
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from "@/components/theme-provider.tsx"
import CreateTrainingPage from "@/pages/create/create-training.page.tsx";
import ListTrainingPage from "@/pages/list/list-training.page.tsx";
import Layout from "@/layout.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Layout>
              <Routes>
                    <Route path="/" element={<ListTrainingPage />} />
                    <Route path="/cadastro" element={<CreateTrainingPage />} />
                    <Route path="/listar" element={<ListTrainingPage />} />
                    <Route path="*" element={<ListTrainingPage />} />
              </Routes>
          </Layout>
      </ThemeProvider>
  </BrowserRouter>
</StrictMode>,
)
