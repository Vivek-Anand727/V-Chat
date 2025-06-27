import React from 'react';
import { useSelector } from 'react-redux';
import SideBar from '../components/SideBar';
import MessageArea from '../components/MessageArea';
import getMessage from '../customHooks/useGetMessage';

function Home() {
  const { selectedUser } = useSelector((state) => state.user);
  getMessage();
  return (
    <div className="h-screen w-full">
      <div className="hidden md:flex h-full">
        <SideBar />
        <MessageArea />
      </div>

      <div className="flex md:hidden h-full">
        {!selectedUser && <SideBar className="w-full" />}
        {selectedUser && <MessageArea className="w-full" />}
      </div>
    </div>
  );
}

export default Home;
