import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Form from "./Content/Formtwo";
import ContainerTracknViewPortal from "./Content/secondpagee";
import Import from "./Content/Import";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Form />} />
          <Route path="/secondpagee" element={<ContainerTracknViewPortal />} />
          <Route path="/Import" element={<Import />} /> 
        </Routes>
      </div>
    </Router>
  );
};

export default App;
