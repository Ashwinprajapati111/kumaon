import Logo from '../Images/Logo.png'
import { SidebarLayout } from '../Components/sidebar-layout'
import React, { useState } from "react";
import Myside from './Myside';
import Mynave from './Mynave';
import AddBlog from './AddBlog.js';


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

        <AddBlog />


      </SidebarLayout>

    </>

  )
}

export default Temp