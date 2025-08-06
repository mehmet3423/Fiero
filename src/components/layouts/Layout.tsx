import { ReactNode } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import ScrollToTop from '@/components/ScrollToTop';
import AnnouncementSlider from '../home/AnnouncementSlider';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            
            <Header />
            {children}
            <Footer />
            <ScrollToTop />
        </>
    );
} 