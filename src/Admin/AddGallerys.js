import Logo from '../Images/Logo.png'
import { SidebarLayout } from '../Components/sidebar-layout'
import React, { useState } from "react";
import Myside from './Myside';
import Mynave from './Mynave';
import AddGallery from './AddGallery.js';


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

        <AddGallery />


      </SidebarLayout>

    </>

  )
}

export default Temp