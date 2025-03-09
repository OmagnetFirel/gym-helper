import React from 'react';
import Header from "@/components/header/Header"
import Footer from '@/components/footer/Footer';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <main className="min-h-screen flex flex-col w-full">
                <Header />
                <section className="flex-1">
                    {children}
                </section>
                <Footer />
        </main>
    );
};

export default Layout;
