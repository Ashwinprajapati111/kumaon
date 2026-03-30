import Logo from '../Images/Logo.png'
import { SidebarLayout } from '../Components/sidebar-layout'
import React, { useState } from "react";
import Myside from './Myside';
import Mynave from './Mynave';
import Admin_user from './Admin_user.js';


import '../index.css';

const Temp = () => {

  return (
    <>
      <SidebarLayout
        navbar={
          <Mynave />
        }

        sidebar={
          <Myside />
        }
      >

        {/* The page content */}

        <Admin_user/>


      </SidebarLayout>

    </>

  )
}

export default Temp