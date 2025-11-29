import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/Appcontext';
import AdminLogin from './pages/AdminLogin';
import Navbar from './components/Navbar';
import ResultTable from './components/ResultTable';

const App = () => {
  const { user } = useAppContext();

  return (
    <div className="w-full">
      <Toaster />
      {user ? (
        <div className="w-full">
          <Navbar />
          <ResultTable />
        </div>
      ) : (
        <div className='bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen'>
          <AdminLogin />
        </div>
      )}
    </div>
  );
};

export default App;