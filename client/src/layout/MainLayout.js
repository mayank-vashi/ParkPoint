import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <>
      <Header />
      <main className="p-0">
        <Outlet />
      </main>
    </>
  );
}
