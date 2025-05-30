import {useState,useEffect} from 'react';
import { useLocation } from "react-router-dom"
import DashboardComp from '../components/DashboardComp';
import DashComments from '../components/DashComments';
import DashPosts from '../components/DashPosts';
import DashProfile from '../components/DashProfile';
import DashSidebar from '../components/DashSidebar';
import DashUsers from '../components/DashUsers';

const Dashboard = () => {
  const location=useLocation();
  const [tab,setTab]=useState('');

  //anytime location changes we'll get the urlParams from the location and then the tab from the urlParams and based on tab we'll show different components i.e user jis tab pe hoga uske according different compnents show karenge inside dashboard
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search);
    const tabfromUrl=urlParams.get('tab');
    // console.log(tabfromUrl)
    if(tabfromUrl){
      setTab(tabfromUrl);
    }
  },[location.search]);

  return (
  
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        {/* sidebar */}
        <DashSidebar />
      </div>
      {/* component- based on tab value ex:profile*/}
      {tab === 'profile' && <DashProfile />}
      
      {/* posts */}
      {tab === 'posts' && <DashPosts />}

      {/* users */}
      {tab === 'users' && <DashUsers />}


       {/* comments  */}
       {tab === 'comments' && <DashComments />}

        {/* dashboard comp */}
      {tab === 'dash' && <DashboardComp />}
      </div>
    
    
  )
}

export default Dashboard