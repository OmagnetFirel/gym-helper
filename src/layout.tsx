import React from 'react';
import Header from "@/components/header/Header"
import Footer from '@/components/footer/Footer';
import InstallButton from "@/components/ui/InstallButton";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <main className="min-h-screen flex flex-col w-full bg-background">
                <Header />
                <section className="flex-1">
                    {children}
                </section>
                <InstallButton />
                <Footer />
        </main>
    );
};

export default Layout;
