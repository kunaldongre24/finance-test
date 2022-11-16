import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import { useAuthState } from "react-firebase-hooks/auth";
import Dashboard from "./components/Dashboard";
import { auth, db, logout } from "./config/firebase";
import "./style/app.css";
import { useEffect, useState } from "react";
import { query, collection, getDocs, where } from "firebase/firestore";
import Rules from "./components/Rules";
import InPlay from "./components/InPlay";
import Ledger from "./components/Ledger";
import Password from "./components/Password";
import LiveCasino from "./components/LiveCasino";
import Settings from "./components/Settings";
import Search from "./components/Search";
import "./style/adminhome.css";
import SidebarItem from "./components/SidebarItem";
import Odds from "./components/Odds";
import NavBtn from "./components/NavBtn";

function App(props) {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [loader, setLoader] = useState(true);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);
  const [fullSidebar, setSidebar] = useState(false);
  const fetchUser = async () => {
    if (user) {
      try {
        const q = query(collection(db, "users"), where("uid", "==", user?.uid));
        const doc = await getDocs(q);
        const data = doc.docs[0].data();
        setUserData(data);
      } catch (err) {
        console.error(err);
      }
    }
    setLoader(false);
  };
  useEffect(() => {
    fetchUser();
  }, [user]);
  useEffect(() => {
    if (pathname === "/") {
      setSidebar(true);
    } else {
      setSidebar(false);
    }
  }, [pathname]);
  function openNav() {
    document.getElementById("mySidebar").style.transition = "0.3s ease";
    document.getElementById("mySidebar").style.left = "0";
  }

  function closeNav() {
    document.getElementById("mySidebar").style.transition = "none";
    document.getElementById("mySidebar").style.left = "-100%";
  }
  // useEffect(() => {
  //   document.addEventListener("contextmenu", (e) => {
  //     e.preventDefault();
  //   });
  //   document.onkeydown = function (e) {
  //     if (e.keyCode == 123) {
  //       return false;
  //     }
  //     if (e.ctrlKey && e.shiftKey && e.keyCode == "I".charCodeAt(0)) {
  //       return false;
  //     }
  //     if (e.ctrlKey && e.shiftKey && e.keyCode == "C".charCodeAt(0)) {
  //       return false;
  //     }
  //     if (e.ctrlKey && e.shiftKey && e.keyCode == "J".charCodeAt(0)) {
  //       return false;
  //     }
  //     if (e.ctrlKey && e.keyCode == "U".charCodeAt(0)) {
  //       return false;
  //     }
  //   };
  // }, []);

  return (
    <div className="app">
      {user ? (
        <div>
          {showHeader ? (
            <div>
              <header>
                <div className="right-menu">
                  <div style={{ display: "flex", paddingLeft: 10 }}>
                    <div>
                      <span className="c-logo">
                        <img src={require("./images/logo.png")} alt="logo" />
                      </span>
                    </div>
                    <div className="c-flex">
                      <div>
                        <span style={{ textTransform: "uppercase" }}>
                          SP0035
                        </span>{" "}
                        (Aditya)
                      </div>
                      <div>BAL: 0.00</div>
                    </div>
                  </div>
                </div>
                <div className="flex__align">
                  <button
                    className="dashboard_btn mobile-home"
                    onClick={() => openNav()}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40"
                      width="40"
                    >
                      <path d="M7.5 34.167v-18.75L20 6l12.5 9.417v18.75h-9.333V23h-6.334v11.167Z" />
                    </svg>
                  </button>
                  <button
                    className="dashboard__btn logout__btn"
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="40"
                      width="40"
                    >
                      <path d="M20 21.708q-.833 0-1.417-.583Q18 20.542 18 19.667V5.833q0-.833.583-1.437.584-.604 1.417-.604.833 0 1.438.604.604.604.604 1.437v13.834q0 .875-.604 1.458-.605.583-1.438.583Zm0 14.417q-3.333 0-6.271-1.271-2.937-1.271-5.104-3.458-2.167-2.188-3.437-5.104-1.271-2.917-1.271-6.25 0-2.959 1.021-5.667 1.02-2.708 3.02-4.875.542-.667 1.438-.729.896-.063 1.521.521.583.625.562 1.416-.021.792-.479 1.417-1.5 1.667-2.271 3.688-.771 2.02-.771 4.229 0 5 3.5 8.541 3.5 3.542 8.542 3.542t8.542-3.542q3.5-3.541 3.5-8.541 0-2.25-.792-4.271T29 12.083q-.458-.666-.458-1.458 0-.792.583-1.333.625-.625 1.542-.5.916.125 1.583.833 1.875 2.167 2.854 4.833.979 2.667.979 5.584 0 3.333-1.271 6.25-1.27 2.916-3.437 5.104-2.167 2.187-5.104 3.458-2.938 1.271-6.271 1.271Z" />
                    </svg>
                    <span className="svgBtn_text">LOGOUT</span>
                  </button>
                </div>
              </header>
              <div
                className={`sidebar ${
                  fullSidebar ? "fullSidebar" : "noSidebar"
                }`}
              >
                <div className="side-container">
                  <SidebarItem
                    link={"/inPlay"}
                    title="In Play"
                    Icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        width="40"
                      >
                        <path d="m24.417 23.708-4.334 4.334q-.458.458-1.104.458-.646 0-1.104-.458L3.792 13.958q-.459-.458-.459-1.02 0-.563.459-1.021l4.333-4.334q.417-.458 1.083-.541.667-.084 1.125.375L24.417 21.5q.458.458.458 1.125t-.458 1.083ZM19 25.25l2.625-2.625L9.292 10.292l-2.625 2.625Zm11.125 10.292-6.25-6.25 2-2 6.292 6.291q.416.417.395.979-.02.563-.437 1.021-.375.375-.979.375t-1.021-.416Zm1-21.084q-2.333 0-3.937-1.625-1.605-1.625-1.605-3.958t1.605-3.937q1.604-1.605 3.937-1.605 2.333 0 3.958 1.605 1.625 1.604 1.625 3.937 0 2.333-1.625 3.958t-3.958 1.625Zm0-2.791q1.167 0 1.979-.813.813-.812.813-1.979 0-1.125-.813-1.937-.812-.813-1.979-.813-1.125 0-1.937.813-.813.812-.813 1.937 0 1.167.813 1.979.812.813 1.937.813Zm0-2.792Zm-17 8.917Z" />
                      </svg>
                    }
                  />
                  <SidebarItem
                    link={"/rules"}
                    title="Rules"
                    Icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        width="40"
                      >
                        <path d="M18.708 28.333h2.75v-10h-2.75ZM20 15.167q.625 0 1.042-.417.416-.417.416-1.042t-.416-1.062q-.417-.438-1.042-.438t-1.042.438q-.416.437-.416 1.062t.416 1.042q.417.417 1.042.417Zm0 21.5q-3.458 0-6.479-1.313-3.021-1.312-5.292-3.583t-3.583-5.292Q3.333 23.458 3.333 20t1.313-6.5q1.312-3.042 3.583-5.292t5.292-3.562Q16.542 3.333 20 3.333t6.5 1.313q3.042 1.312 5.292 3.562t3.562 5.292q1.313 3.042 1.313 6.5t-1.313 6.479q-1.312 3.021-3.562 5.292T26.5 35.354q-3.042 1.313-6.5 1.313Zm0-2.792q5.792 0 9.833-4.042 4.042-4.041 4.042-9.833t-4.021-9.833Q25.833 6.125 20 6.125q-5.792 0-9.833 4.021Q6.125 14.167 6.125 20q0 5.792 4.042 9.833 4.041 4.042 9.833 4.042ZM20 20Z" />
                      </svg>
                    }
                  />
                  <SidebarItem
                    link={"/ledger"}
                    title="Ledger"
                    Icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        width="40"
                      >
                        <path d="M9.5 36.667q-1.917 0-3.25-1.334Q4.917 34 4.917 32.083v-5.125h5.208V3.333l2.5 2.5 2.458-2.5 2.5 2.5 2.5-2.5 2.5 2.5 2.5-2.5 2.5 2.5 2.5-2.5 2.5 2.5 2.5-2.5v28.75q0 1.917-1.333 3.25-1.333 1.334-3.25 1.334Zm21-2.792q.792 0 1.292-.5t.5-1.292V7.792H12.875v19.166h15.833v5.125q0 .792.5 1.292t1.292.5Zm-15.583-19.5v-2.75h10v2.75Zm0 5.417V17h10v2.792Zm13.708-5.417q-.583 0-1-.396-.417-.396-.417-.979t.417-.979q.417-.396 1-.396.542 0 .958.396.417.396.417.979t-.417.979q-.416.396-.958.396Zm0 5.25q-.583 0-1-.396-.417-.396-.417-.979t.417-.979q.417-.396 1-.396.542 0 .958.396.417.396.417.979t-.417.979q-.416.396-.958.396ZM9.458 33.875h16.459v-4.167H7.708v2.375q0 .792.5 1.292t1.25.5Zm-1.75 0v-4.167 4.167Z" />
                      </svg>
                    }
                  />
                  <SidebarItem
                    link={"/password"}
                    title="Password"
                    Icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        width="40"
                      >
                        <path d="M9.458 36.667q-1.166 0-1.979-.813-.812-.812-.812-1.979V16.292q0-1.167.812-1.98.813-.812 1.979-.812h2.5V9.708q0-3.333 2.354-5.687Q16.667 1.667 20 1.667q3.333 0 5.688 2.354 2.354 2.354 2.354 5.687V13.5h2.5q1.166 0 1.979.812.812.813.812 1.98v17.583q0 1.167-.812 1.979-.813.813-1.979.813Zm0-2.792h21.084V16.292H9.458v17.583ZM20 28.333q1.333 0 2.292-.937.958-.938.958-2.271 0-1.292-.958-2.292-.959-1-2.292-1-1.333 0-2.292 1-.958 1-.958 2.334 0 1.291.958 2.229.959.937 2.292.937ZM14.708 13.5h10.584V9.708q0-2.166-1.542-3.708Q22.208 4.458 20 4.458T16.25 6q-1.542 1.542-1.542 3.708Zm-5.25 20.375V16.292v17.583Z" />
                      </svg>
                    }
                  />
                  <SidebarItem
                    link={"/liveCasino"}
                    title="Live Casino"
                    Icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        width="40"
                      >
                        <path d="M12.5 29.708q.917 0 1.562-.646.646-.645.646-1.562t-.646-1.562q-.645-.646-1.562-.646t-1.562.646q-.646.645-.646 1.562t.646 1.562q.645.646 1.562.646Zm0-15q.917 0 1.562-.645.646-.646.646-1.563 0-.917-.646-1.562-.645-.646-1.562-.646t-1.562.646q-.646.645-.646 1.562t.646 1.563q.645.645 1.562.645Zm7.5 7.5q.917 0 1.562-.646.646-.645.646-1.562t-.646-1.562q-.645-.646-1.562-.646t-1.562.646q-.646.645-.646 1.562t.646 1.562q.645.646 1.562.646Zm7.5 7.5q.917 0 1.562-.646.646-.645.646-1.562t-.646-1.562q-.645-.646-1.562-.646t-1.562.646q-.646.645-.646 1.562t.646 1.562q.645.646 1.562.646Zm0-15q.917 0 1.562-.645.646-.646.646-1.563 0-.917-.646-1.562-.645-.646-1.562-.646t-1.562.646q-.646.645-.646 1.562t.646 1.563q.645.645 1.562.645ZM7.792 35q-1.125 0-1.959-.833Q5 33.333 5 32.208V7.792q0-1.125.833-1.959Q6.667 5 7.792 5h24.416q1.125 0 1.959.833.833.834.833 1.959v24.416q0 1.125-.833 1.959-.834.833-1.959.833Zm0-2.792h24.416V7.792H7.792v24.416Zm0-24.416v24.416V7.792Z" />
                      </svg>
                    }
                  />
                  <SidebarItem
                    link={"/setting"}
                    title="Setting"
                    Icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="40"
                        width="40"
                      >
                        <path d="m15.917 36.667-.792-5.292q-.708-.25-1.437-.687-.73-.438-1.355-.896L7.417 32l-4.125-7.208L7.75 21.5q-.083-.333-.104-.75-.021-.417-.021-.75t.021-.75q.021-.417.104-.75l-4.458-3.292L7.417 8l4.916 2.208q.625-.458 1.375-.896.75-.437 1.417-.687l.792-5.292h8.166l.792 5.292q.708.25 1.458.667.75.416 1.334.916L32.583 8l4.125 7.208-4.458 3.209q.083.375.104.791.021.417.021.792 0 .375-.021.771t-.104.771l4.417 3.25L32.583 32l-4.916-2.208q-.625.458-1.355.916-.729.459-1.437.667l-.792 5.292Zm4.125-11.125q2.291 0 3.916-1.625T25.583 20q0-2.292-1.625-3.917t-3.916-1.625q-2.334 0-3.959 1.625T14.458 20q0 2.292 1.625 3.917t3.959 1.625Zm0-2.75q-1.167 0-1.98-.813-.812-.812-.812-1.979t.812-1.979q.813-.813 1.98-.813 1.125 0 1.937.813.813.812.813 1.979t-.813 1.979q-.812.813-1.937.813ZM20 20Zm-1.792 13.875h3.542l.583-4.583q1.375-.334 2.563-1.021 1.187-.688 2.146-1.646l4.333 1.833L33 25.542l-3.792-2.834q.167-.666.271-1.333.104-.667.104-1.375t-.083-1.375q-.083-.667-.292-1.333L33 14.458l-1.625-2.916-4.333 1.833q-.959-1.042-2.125-1.729-1.167-.688-2.584-.938l-.541-4.583H18.25l-.583 4.583q-1.375.292-2.563.98-1.187.687-2.146 1.687l-4.333-1.833L7 14.458l3.792 2.834q-.167.666-.271 1.333-.104.667-.104 1.375t.104 1.375q.104.667.271 1.333L7 25.542l1.625 2.916 4.333-1.833q.959.958 2.146 1.646 1.188.687 2.563 1.021Z" />
                      </svg>
                    }
                  />
                </div>
              </div>
            </div>
          ) : null}
          <div className={`content-cnt ${!fullSidebar ? "no-sidebar" : null}`}>
            <Routes>
              <Route exact path="/" index element={<Dashboard />} />
              <Route exact path="/rules" index element={<Rules />} />
              <Route exact path="/inPlay" index element={<InPlay />} />
              <Route exact path="/odds/:matchId" index element={<Odds />} />
              <Route exact path="/ledger" index element={<Ledger />} />
              <Route exact path="/password" index element={<Password />} />
              <Route exact path="/liveCasino" index element={<LiveCasino />} />
              <Route exact path="/settings" index element={<Settings />} />
              <Route exact path="/search" index element={<Search />} />
            </Routes>
          </div>
        </div>
      ) : (
        <div>
          <header></header>
          <div className="content">
            <Routes>
              <Route exact path="/" index element={<Login />} />
              <Route exact path="/register" element={<Register />} />
            </Routes>
          </div>
        </div>
      )}
      <div id="mySidebar" class="mobile-sidebar">
        <a
          href="javascript:void(0)"
          class="closebtn"
          onClick={() => closeNav()}
        >
          ×
        </a>

        <NavBtn title="HOME" path="/" onClick={() => closeNav()} />
        <NavBtn title="INPLAY" path="/inPlay" onClick={() => closeNav()} />
        <NavBtn title="RULES" path="/rules" onClick={() => closeNav()} />
        <NavBtn title="LEDGER" path="/ledger" onClick={() => closeNav()} />
        <NavBtn title="PASSWORD" path="/password" onClick={() => closeNav()} />
        <NavBtn
          title="LIVE CASINO"
          path="/liveCasino"
          onClick={() => closeNav()}
        />
        <NavBtn title="SETTINGS" path="/settings" onClick={() => closeNav()} />
        <NavBtn title="LOGOUT" path="/logout" onClick={() => closeNav()} />
      </div>
    </div>
  );
}
const RouterWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};
export default RouterWrapper;
