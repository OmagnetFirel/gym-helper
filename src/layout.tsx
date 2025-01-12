import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import {Header} from "@/components/header/Header.tsx";
import Footer from "@/components/footer/index.tsx";
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            {/* <AppSidebar /> */}
            <main className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
                <Header />
                {children}
                <Footer/>
            </main>
        </SidebarProvider>
    )
}
