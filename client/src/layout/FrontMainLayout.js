import FrontHeader from '../components/FrontHeader';
import { Outlet } from 'react-router-dom';

const FrontMainLayout = () => {
  return (
    <>
      <FrontHeader />
      <main className="p-0">
        <Outlet />
      </main>
    </>
  )
}

export default FrontMainLayout
