import { React, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Index from "./pages/index";

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
import PrivateRoute from "./PrivateRoute";
import Login from "./Login";
import Logout from "./Logout";
import DeStuffingCompleted from "./pages/de_stuffing/DeStuffingCompleted";
import DeliveryCompleted from "./pages/delivery/DeliveryCompleted";
import CartingCompleted from "./pages/carting/CartingCompleted";
import StuffingCompleted from "./pages/stuffing/StuffingCompleted";
import Locations from "./pages/Locations";



export default function App() {
  return (
    <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />

          <Route path="/de-stuffing" element={<PrivateRoute><DeStuffing/></PrivateRoute>} />
          <Route path="/de_stuffing_completed_trans" element={<PrivateRoute><DeStuffingCompleted/></PrivateRoute>} />
          <Route path="/de-stuffing/bill-details" element={<PrivateRoute><DeStuffingBillDetails/></PrivateRoute>} />
          <Route path="/de-stuffing/tally_sheet" element={<PrivateRoute><DeStuffingTallySheet/></PrivateRoute>} />

          <Route path="/delivery" element={<PrivateRoute><Delivery/></PrivateRoute>} />
          <Route path="/completed_delivery" element={<PrivateRoute><DeliveryCompleted/></PrivateRoute>} />
          <Route path="/delivery/bill-details" element={<PrivateRoute><DeliveryBillDetails/></PrivateRoute>} />
          <Route path="/delivery/tally_sheet" element={<PrivateRoute><DeliveryTallySheet/></PrivateRoute>} />

          <Route path="/carting" element={<PrivateRoute><Carting/></PrivateRoute>} />
          <Route path="/carting_completed" element={<PrivateRoute><CartingCompleted/></PrivateRoute>} />
          <Route path="/carting/bill-details" element={<PrivateRoute><CartingBillDetails/></PrivateRoute>} />
          <Route path="/carting/tally_sheet" element={<PrivateRoute><CartingTallySheet/></PrivateRoute>} />

          <Route path="/stuffing" element={<PrivateRoute><Stuffing/></PrivateRoute>} />
          <Route path="/stuffing_completed" element={<PrivateRoute><StuffingCompleted/></PrivateRoute>} />
          <Route path="/stuffing/bill-details" element={<PrivateRoute><StuffingBillDetails/></PrivateRoute>} />
          <Route path="/stuffing/tally_sheet" element={<PrivateRoute><StuffingTallySheet/></PrivateRoute>} />

          <Route path="/locations" element={<PrivateRoute><Locations/></PrivateRoute>} />

        </Routes>
    </Router>

  );
}