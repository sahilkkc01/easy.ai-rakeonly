import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Index from "./pages/index";
import IndexR from "./pages/IndexR";
import { useEffect } from "react";
import Login from "./Login";
import Logout from "./Logout";
import "./App.css"

import CWHCartingReadLCL from "./pages/CWHCartingReadLCL";
import CWHCartingRead from "./pages/CWHCartingRead";
import CWHDeStuffingRead from "./pages/CwhDestuffingRead";
import CWHDeStuffingReadLCL from "./pages/CwhDestuffingReadLcl";
import CWHStuffingReadFCL from "./pages/CwhStuffingReadFcl";
import CWHStuffingRead from "./pages/CwhStuffingLCL";
import PrivateRoute from "./PrivateRoute";
import TallySheetDeStuffingLCL from "./pages/TallySheetDeStuffingLCL";
import TallySheetDelivery from "./pages/TallySheetDelivery";
import RakeOutWord from "./pages/RakeOutWord";
import RakeOutWordData from "./pages/RakeOutWordData";
import TallySheetDeStuffingFCL from "./pages/TallySheetDeStuffingFCL.jsx";
import TallySheetCartingReadFCL from "./pages/TallySheetCartingReadFCL.jsx";
import TallySheetStuffingFCL from "./pages/TallySheetStuffingFCL.jsx";
import YardTransactions from "./pages/YardTransactions.jsx";
import RakeOutWordWTR from "./pages/RakeOutWordWTR.jsx";
import EIR from "./pages/EIR.jsx";
import EIRMain from "./pages/EIRMain.jsx";
import Cisf from "./pages/Cisf.jsx";
import CisfIn from "./pages/CisfIn.jsx";
import CisfOut from "./pages/CisfOut.jsx";
import Rst from "./pages/Rst.jsx";
import CWHDelivery from "./pages/CWHDelivery.jsx";
import DTMSGate from "./pages/DTMSGate.jsx";
import DTMSRst from "./pages/DTMSRst.jsx";
import Gate from "./pages/Gate.jsx";
import GateIN from "./pages/GateIN.jsx";
import GateOUT from "./pages/GateOUT.jsx";
import Rake_survey_tool from "./pages/Rake_survey_tool.jsx";
import IndexROut from "./pages/IndexROut.jsx";
import WTR from "./pages/WTR.jsx";

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
  }, [initialTheme]);
  return (
    <Router>
      <div>
        <Routes>
          {/* Login - Logout */}
          <Route path="/" element={<Login />} />
          <Route path="/Logout" element={<Logout />} />

          {/* GATE */}
          <Route path="/Gate" element={<PrivateRoute ><GateIN /></PrivateRoute>} />
          <Route path="/CISF" element={<PrivateRoute ><Cisf /></PrivateRoute>} />
          <Route path="/CISFIn" element={<PrivateRoute ><CisfIn /></PrivateRoute>} />
          <Route path="/CISFOut" element={<PrivateRoute ><CisfOut /></PrivateRoute>} />

          {/* RAKE */}
          <Route path="/RakeINWord" element={<PrivateRoute><IndexR /></PrivateRoute>} />
          <Route path="/RakeOUTWord" element={<PrivateRoute><IndexROut /></PrivateRoute>} />
          <Route path="/RakeOutWordWTR" element={<PrivateRoute><RakeOutWordWTR /></PrivateRoute>} />

          {/* YARD */}
          <Route path="/YardTransactions" element={<PrivateRoute><YardTransactions /></PrivateRoute>} />
          <Route path="/Rst" element={<PrivateRoute><Rst/></PrivateRoute>} />

          {/* WAREHOUSE */}
          <Route path="/CartingReadFCL" element={<PrivateRoute><CWHCartingRead /></PrivateRoute>} />
          <Route path="/StuffingReadFCL" element={<PrivateRoute><CWHStuffingReadFCL /></PrivateRoute>} />
          <Route path="/Delivery" element={<PrivateRoute><CWHDelivery /></PrivateRoute>} />
          <Route path="/DeStuffingReadFCL" element={<PrivateRoute><CWHDeStuffingRead /></PrivateRoute>} />
          <Route path="/DeStuffingReadLCL" element={<PrivateRoute><CWHDeStuffingReadLCL /></PrivateRoute>} />
          <Route path="/CartingReadLCL" element={<PrivateRoute><CWHCartingReadLCL /></PrivateRoute>} />
          <Route path="/StuffingReadLCL" element={<PrivateRoute><CWHStuffingRead /></PrivateRoute>} />

          {/* WAREHOUSE TallySheet */}
          <Route path="/TallySheetCartingReadFCL/:crnNumber" element={<TallySheetCartingReadFCL />} />
          <Route path="/TallySheetStuffingFCL/:ContainerNo" element={<TallySheetStuffingFCL />} />
          <Route path="/TallySheetDelivery/:GpmNo" element={<TallySheetDelivery />} />
          <Route path="/TallySheetDeStuffingFCL/:ContainerNo" element={<TallySheetDeStuffingFCL />} />
          <Route path="/TallySheetDeStuffingLCL/:ContainerNo" element={<TallySheetDeStuffingLCL />} />

          {/* 
          <Route path="/DTMSGate" element={<PrivateRoute ><DTMSGate /></PrivateRoute>} />
          <Route path="/GateOld" element={<Index />} />
          <Route path="/DTMSYardTransactions" element={<PrivateRoute><DTMSRst /></PrivateRoute>} />
          <Route path="/RakeOutWords" element={<RakeOutWord />} />
          <Route path="/RakeOutWordData/:type" element={<RakeOutWordData />} />
          <Route path="/EIRMain/:Permit" element={<PrivateRoute><EIRMain /></PrivateRoute>} />
          <Route path="/EIR/:Permit" element={<PrivateRoute><EIR /></PrivateRoute>} /> 
          <Route path="/GateTools" element={<Gate />} />
          <Route path="/rake_survey_tool" element={<Rake_survey_tool />} />
          <Route path="/GateOUT" element={<GateOUT />} />
          <Route path="/WTR" element={<WTR />} />
            */}


        </Routes>
      </div>
    </Router>

  );
}