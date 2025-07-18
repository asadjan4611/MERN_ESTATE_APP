import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import CreateListening from './pages/createListening';
import UpdateListening from './pages/updateListening';
import Header from './components/Header';
import PrivateRoute from './components/privateRoute'; 
import Listening from './pages/listening';
import Search from './pages/Search';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/search" element={<Search />} />
        <Route path="/sign-up" element={<SignUp />} />
              <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/createListening" element={<CreateListening />} />
           <Route path="/update-Listening/:listeningId" element={<UpdateListening />} />
           <Route path="/listening/:listeningId" element={<Listening />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;