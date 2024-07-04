import React from "react";
import "./navbar.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
} from "react-router-dom";
import logo from "../components/imgs/logo.png";

function Navbar({ connectWallet, account }) {
  return (
    <div className="navbar">
      <nav>
        <Link to="/" style={{ textDecoration: "none" }}>
          <img src={logo} alt="logo" className="logo" />
        </Link>
        <div className="right">
          <Link to="/" style={{ textDecoration: "none" }}>
            <button>
              <span class="text">Marketplace</span>
            </button>
          </Link>
          <Link to="/MyNFTs" style={{ textDecoration: "none" }}>
            <button>
              <span class="text">My NFT(s)</span>
            </button>
          </Link>
          <Link to="/UploadNFTForm" style={{ textDecoration: "none" }}>
            <button>
              <span class="text">Mint & List</span>
            </button>
          </Link>
          {account ? (
            <button class="btn" type="button">
              <strong>
                {account.slice(0, 6) + "..." + account.slice(38, 42)}
              </strong>
              <div id="container-stars">
                <div id="stars"></div>
              </div>
              <div id="glow">
                <div class="circle"></div>
                <div class="circle"></div>
              </div>
            </button>
          ) : (
            <button class="btn" type="button" onClick={connectWallet}>
              <strong>Connect Wallet</strong>
              <div id="container-stars">
                <div id="stars"></div>
              </div>
              <div id="glow">
                <div class="circle"></div>
                <div class="circle"></div>
              </div>
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
