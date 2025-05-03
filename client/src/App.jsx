import {BrowserRouter, Routes, Route} from 
"react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import SignIn from "./pages/Signin";
import SignUp from "./pages/Signup";



function App() {
  return (
   <BrowserRouter>
   <Header />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      
      <Route element={<PrivateRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
      </Route>

      <Route path="/projects" element={<Projects />} />
      <Route path="/sign-in" element={<SignIn />} />
    <Route path="/sign-up" element={<SignUp />}/>     
    </Routes>
    <Footer />
   </BrowserRouter>
  )
  
}

export default App
