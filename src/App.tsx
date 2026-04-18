import { Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import Register from './layer1/register';
import Login from './layer1/login';

function App() {
  return (
    <Routes>
      <Route path= "/" element= {<Login></Login>} />
      <Route path= "/login" element= {<Login></Login>}></Route>
      <Route path= "/register" element= {<Register></Register>}></Route>
      <Route path= "*" element= {<Navigate to= "/login" />} />
    </Routes>
  );
}
export default App;
