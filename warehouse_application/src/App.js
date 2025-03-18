import { React, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Index from "./pages/index";
import Jobs from "./pages/Jobs";
import DeliveryLCL from "./pages/import/DeliveryLCL";
import DeliveryFCL from "./pages/import/DeliveryFCL";
import DestuffingFCL from "./pages/import/DestuffingFCL"
import DestuffingLCL from "./pages/import/DestuffingLCL";
import DirectDelivery from "./pages/import/DirectDelivery";
import DestuffingBill from "./pages/import/DestuffingBill";
import DeliveryBill from "./pages/import/DeliveryBill";


import DeStuffing from "./pages/de_stuffing/DeStuffing";
import DeStuffingBillDetails from "./pages/de_stuffing/DeStuffingBillDetails";
import DeStuffingTallySheet from "./pages/de_stuffing/DeStuffingTallySheet";
import Delivery from "./pages/delivery/Delivery";
import DeliveryBillDetails from "./pages/delivery/DeliveryBillDetails";
import DeliveryTallySheet from "./pages/delivery/DeliveryTallySheet";
import Carting from "./pages/carting/Carting";
import CartingBillDetails from "./pages/carting/CartingBillDetails";
import CartingTallySheet from "./pages/carting/CartingTallySheet";
import Stuffing from "./pages/stuffing/Stuffing";
import StuffingBillDetails from "./pages/stuffing/StuffingBillDetails";
import StuffingTallySheet from "./pages/stuffing/StuffingTallySheet";



export default function App() {
  const initialTheme = sessionStorage.getItem("myTheme") === "true";
  useEffect(() => {
    const coreCss = document.querySelector(".template-customizer-core-css");
    const themeCss = document.querySelector(".template-customizer-theme-css");

    if (initialTheme) {
      document.documentElement.setAttribute("data-style", "dark");
      if (coreCss && themeCss) {
        coreCss.setAttribute("href", "/assets/vendor/css/rtl/core-dark.css");
        themeCss.setAttribute(
          "href",
          "/assets/vendor/css/rtl/theme-default-dark.css"
        );
      }
    } else {
      document.documentElement.setAttribute("data-style", "light");
      if (coreCss && themeCss) {
        coreCss.setAttribute("href", "/assets/vendor/css/rtl/core.css");
        themeCss.setAttribute(
          "href",
          "/assets/vendor/css/rtl/theme-default.css"
        );
      }
    }
  }, []);
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Index />} />

          <Route path="/de-stuffing" element={<DeStuffing/>} />
          <Route path="/de-stuffing/bill-details" element={<DeStuffingBillDetails/>} />
          <Route path="/de-stuffing/tally_sheet" element={<DeStuffingTallySheet/>} />

          <Route path="/delivery" element={<Delivery/>} />
          <Route path="/delivery/bill-details" element={<DeliveryBillDetails/>} />
          <Route path="/delivery/tally_sheet" element={<DeliveryTallySheet/>} />

          <Route path="/carting" element={<Carting/>} />
          <Route path="/carting/bill-details" element={<CartingBillDetails/>} />
          <Route path="/carting/tally_sheet" element={<CartingTallySheet/>} />

          <Route path="/stuffing" element={<Stuffing/>} />
          <Route path="/stuffing/bill-details" element={<StuffingBillDetails/>} />
          <Route path="/stuffing/tally_sheet" element={<StuffingTallySheet/>} />

          <Route path="/DeliveryLCL" element={<DeliveryLCL />} />
          <Route path="/DeliveryFCL" element={<DeliveryFCL />} />
          <Route path="/DestuffingFCL" element={<DestuffingFCL />} />
          <Route path="/DestuffingLCL" element={<DestuffingLCL />} />
          <Route path="/DirectDelivery" element={<DirectDelivery />} />
          <Route path="/DestuffingBill" element={<DestuffingBill />} />
          <Route path="/DeliveryBill" element={<DeliveryBill />} />
          <Route path="/Jobs" element={<Jobs />} />

        </Routes>
    </Router>

  );
}