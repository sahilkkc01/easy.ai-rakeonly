import { React, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Index from "./pages/index";
import Jobs from "./pages/Jobs";
import DeliveryLCL from "./pages/import/DeliveryLCL";
import DeliveryFCL from "./pages/import/DeliveryFCL";
import DestuffingFCL from "./pages/import/DestuffingFCL"
import DestuffingLCL from "./pages/import/DestuffingLCL";
import DirectDelivery from "./pages/import/DirectDelivery";
import DestuffingBill from "./pages/import/DestuffingBill";
<<<<<<< HEAD
import DeStuffing from "./pages/DeStuffing";
import DeStuffingBillDetails from "./pages/DeStuffingBillDetails";
=======
import DeliveryBill from "./pages/import/DeliveryBill";
>>>>>>> 5ac0d64abf563fc3b9183c1defef3b439b3092aa

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
      <div>

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/de-stuffing" element={<DeStuffing/>} />
          <Route path="/de-stuffing/bill-details" element={<DeStuffingBillDetails/>} />


          <Route path="/DeliveryLCL" element={<DeliveryLCL />} />
          <Route path="/DeliveryFCL" element={<DeliveryFCL />} />
          <Route path="/DestuffingFCL" element={<DestuffingFCL />} />
          <Route path="/DestuffingLCL" element={<DestuffingLCL />} />
          <Route path="/DirectDelivery" element={<DirectDelivery />} />
          <Route path="/DestuffingBill" element={<DestuffingBill />} />
          <Route path="/DeliveryBill" element={<DeliveryBill />} />
          <Route path="/Jobs" element={<Jobs />} />

        </Routes>

      </div>
    </Router>

  );
}