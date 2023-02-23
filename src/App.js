//kunal dongre
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Reset from "./components/Reset";
import { useAuthState } from "react-firebase-hooks/auth";
import Dashboard from "./components/Dashboard";
import { auth, db, logout } from "./config/firebase";
import "./style/app.css";
import HomeIcon from "@mui/icons-material/Home";
import MenuItem from "./components/MenuItem";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SchoolIcon from "@mui/icons-material/School";
import Result from "./components/Result";
import AttemptTest from "./components/AttemptTest";
import TestInstructions from "./components/TestInstructions";
import { useEffect, useState } from "react";
import Test from "./components/Test";
import Spinner from "./components/Spinner";
import Admin from "./components/Admin";
import Subjects from "./components/Subjects";
import Tests from "./components/Tests";
import Topics from "./components/Topics";
import Chapters from "./components/Chapters";
import AvailableTests from "./components/AvailableTests";
import { query, collection, getDocs, where } from "firebase/firestore";

function App(props) {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [loader, setLoader] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [showHeader, setShowHeader] = useState(true);
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

  if (loading || loader) {
    return <Spinner color="#000" />;
  }
  const { pathname } = location;
  return (
    <div className="app">
      {user ? (
        userData.isAdmin ? (
          <div>
            <Routes>
              <Route path="*" element={<Admin />}>
                <Route path="subjects" element={<Subjects />} />
                <Route path="chapters" element={<Chapters />} />
                <Route path="topics" element={<Topics />} />
                <Route path="tests" element={<Tests />} />
                <Route path="availableTests" element={<AvailableTests />} />
              </Route>
            </Routes>
          </div>
        ) : (
          <div>
            {showHeader ? (
              <header>
                <div className="right-menu">
                  <MenuItem Icon={HomeIcon} title="Home" address={"/"} />
                  <MenuItem
                    Icon={ListAltIcon}
                    title="Attempt Test"
                    address={"/attempt"}
                  />
                  <MenuItem
                    Icon={SchoolIcon}
                    title="Result"
                    address={"/result"}
                  />
                </div>
                <button
                  className="dashboard__btn"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </header>
            ) : null}
            <Routes>
              <Route exact path="/attempt" element={<AttemptTest />} />
              <Route
                exact
                path="/result/:testId"
                element={<Result headerShown={setShowHeader} />}
              />
              <Route
                exact
                path="/testInstructions/:testId"
                element={<TestInstructions />}
              />
              <Route
                exact
                path="/test/:testId"
                element={<Test headerShown={setShowHeader} />}
              />
              <Route exact path="/" index element={<Dashboard />} />
            </Routes>
          </div>
        )
      ) : (
        <div>
          <header></header>
          <div className="content">
            <Routes>
              <Route exact path="/" index element={<Login />} />
              <Route exact path="/register" element={<Register />} />
              <Route exact path="/reset" element={<Reset />} />
            </Routes>
          </div>
        </div>
      )}
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
