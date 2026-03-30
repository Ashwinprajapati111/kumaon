import Logo from '../Images/Logo.png'
import { SidebarLayout } from '../Components/sidebar-layout'
import React, { useState } from "react";
import Myside from './Myside';
import Mynave from './Mynave';
import AddPhoto from './AddPhoto';
// import AddPhotos from './AddPhotos';

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

        <AddPhoto />


      </SidebarLayout>

    </>

  )
}

export default Temp