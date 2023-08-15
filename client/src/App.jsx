import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage';
import PageNotFound from './views/PageNotFound';
import Banner from './components/Banner';
import { initServiceWorker } from "./services/ServiceWorker.service";
import { useState } from 'react';
import Home from './views/Home';
import { useSelector } from 'react-redux';

function App() {
  //lance le service worker
  // initServiceWorker()

  const [isConnected, setIsConnected] = useState(false)
  const { user } = useSelector(state => state.user)


  return (
    <BrowserRouter>
      <div>
        {
          // si l'utilisateur est connecté, on affiche la barre de navigation
          user && 
          <Banner  setIsConnected={setIsConnected}/>
        }
        <div className="w-full">
          <Routes>
            <Route path="/" element={<LoginPage  setIsConnected={setIsConnected}/>} />

            <Route path="/login" element={
                                          // <IsNotOnlineRoute>
                                            <LoginPage setIsConnected={setIsConnected}/>
                                          // </IsNotOnlineRoute>
                                        } 
            />
            
            <Route path="/home" element={
                                          // <PrivateRoute  setIsConnected={setIsConnected}>
                                            <Home />
                                          // </PrivateRoute>
                                        }
            />                            
            <Route path="/*" element={<PageNotFound />} />                                                                                                     
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}


export default App;