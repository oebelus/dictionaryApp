import "./App.css";
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import Home from "./pages/home";
import Login from "./pages/login";
import { useAuth } from "./pages/auth";

function App() {
    const { authenticated, setAuthenticated } = useAuth(); 
    const authToken = window.localStorage.getItem("authToken");
    const isAuthenticated = window.localStorage.getItem("isAuthenticated");

    const userId = localStorage.getItem("userId");
    
    const handleLogout = () => {
        setAuthenticated(false);
        console.log("AUTHTOKEN: ", authToken)
        window.localStorage.removeItem("authToken")
        window.localStorage.removeItem("isAuthenticated")
    }

    return (
        <div className="App">
            <BrowserRouter>
                <nav className="navbar navbar-light bg-light navContainer">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <h1>The Dictionary</h1>
                        </div>
                        <div className="navBar">
                            {authenticated ? (
                                <div className="navLinks">
                                    {authenticated ? (
                                        <Link to="/Login" className="nav-link logout-link">
                                            <button onClick={handleLogout}>Logout</button>
                                        </Link>
                                    ) : null}
                                </div>
                            ) : null}
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/:userId" element={isAuthenticated?<Home userId={userId}/>:<Login/>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Login />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
