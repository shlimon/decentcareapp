import { Outlet } from 'react-router';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="pb-12">
      <Outlet />
      <Navbar />
    </div>
  );
}
