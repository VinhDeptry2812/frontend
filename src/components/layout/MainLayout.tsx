import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';

interface MainLayoutProps {
  cartCount: number;
  onOpenCart: () => void;
}

export const MainLayout = ({ cartCount, onOpenCart }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100">
      <Header cartCount={cartCount} onOpenCart={onOpenCart} />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
