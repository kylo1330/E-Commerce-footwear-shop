import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { removeUser } from "../store/authSlice";

function Navbar() {
    const user = useSelector(store => store.auth.user);
    const token = user?.token;
    const userId = user ? user.id : null;
    const isSuperuser = useSelector(store => store.auth.isSuperuser);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function logout() {
        if (user) {
            axios.post('http://127.0.0.1:8000/shop/logout', {}, {
                headers: { 'Authorization': "Token " + user.token }
            })
            .then(() => {
                dispatch(removeUser());
                navigate('/login');
            })
            .catch(error => {
                console.error("Logout failed:", error);
                // Handle logout failure, if necessary
            });
        }
    }

    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
            <div className="navbar-brand">
                <h4 style={{ paddingLeft: '10px' }}>
                    <span style={{ color: '#E6DDF3' }}>METRO</span>
                    <span style={{ color: '#A52A2A' }}>WEARS</span>
                </h4>
            </div>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse mr-auto" id="navbarNav" style={{ float: "left" }}>
                <ul className="navbar-nav ml-auto" style={{ color: "#ffffff" }}>
                    <li className="nav-item">
                        <NavLink exact to="/" className="nav-link" activeClassName="active">
                            Home
                        </NavLink>
                    </li>
                    {user ? (
                        <React.Fragment>
                            {!isSuperuser && (
                                <li className="nav-item">
                                    <NavLink to="/user/list" className="nav-link" activeClassName="active">
                                        Footwear
                                    </NavLink>
                                </li>
                            )}
                            {!isSuperuser && (
                                <li className="nav-item">
                                    <NavLink to="/cart/" className="nav-link" activeClassName="active">
                                        Cart
                                    </NavLink>
                                </li>
                            )}
                            {isSuperuser && (
                                <li className="nav-item">
                                    <NavLink to="/admin/list" className="nav-link" activeClassName="active">
                                        Create
                                    </NavLink>
                                </li>
                            )}
                            <li className="nav-item">
                                <span className="nav-link" onClick={logout}>Logout</span>
                            </li>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <li className="nav-item">
                                <NavLink to="/register" className="nav-link" activeClassName="active">
                                    Signup
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink to="/login" className="nav-link" activeClassName="active">
                                    Login
                                </NavLink>
                            </li>
                        </React.Fragment>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
