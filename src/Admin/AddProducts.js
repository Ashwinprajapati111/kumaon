import React from 'react'
import Myside from './Myside';
import Mynave from './Mynave';
import AddProduct from './AddProduct';
import { SidebarLayout } from '../Components/sidebar-layout'

const AddProducts = () => {
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

        <AddProduct/>


      </SidebarLayout>
    
    </>
  )
}

export default AddProducts
