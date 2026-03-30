import React from "react";
import { SidebarLayout } from "../Components/sidebar-layout";

import Myside from "./Myside";
import Mynave from "./Mynave";
import Order from "./Order";

import "../index.css";

const Temp = () => {
  return (
    <SidebarLayout
      navbar={<Mynave />}
      sidebar={<Myside />}
    >
      {/* Page Content */}
      <Order />
    </SidebarLayout>
  );
};

export default Temp;