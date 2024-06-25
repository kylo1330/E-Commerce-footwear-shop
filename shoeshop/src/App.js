import React from "react";
import Navbar from "./components/Navbar";
import WelcomeSection from './components/WelcomeSection';
import ShopCarousel from './components/ShopCarousel';
import checkAuth from "./components/auth/checkAuth";
import { useSelector } from "react-redux";


function App() {
  const user = useSelector((state) => state.auth.user);
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);

  return (
    <div>
      <Navbar />
      <WelcomeSection />
      <ShopCarousel/>
      <div>
        {user && isSuperuser ? ( // Check if user is logged in and is admin
          <div>
        
          </div>
        ) : user ? ( // Check if user is logged in
          <div>
          
          </div>
        ) : (
          <div><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          </div>
        )}
      </div>
    </div>
  );
}

export default checkAuth(App);




