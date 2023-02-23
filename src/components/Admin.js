//Admin.js

import React, { useEffect, useState } from "react";
import "../style/test.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Spinner from "./Spinner";
import FlagIcon from "@mui/icons-material/Flag";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import NavItem from "./NavItem";
import SubjectRoundedIcon from "@mui/icons-material/SubjectRounded";
import SettingsApplicationsRoundedIcon from "@mui/icons-material/SettingsApplicationsRounded";
import HubRoundedIcon from "@mui/icons-material/HubRounded";
import ClassIcon from "@mui/icons-material/Class";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddTaskRoundedIcon from "@mui/icons-material/AddTaskRounded";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Subjects from "./Subjects";
import Tests from "./Tests";
import Topics from "./Topics";
import Chapters from "./Chapters";
import Classes from "./Classes";
import AdminDashboard from "./Admin-dashboard";
import AvailableTests from "./AvailableTests";
import ListAltIcon from "@mui/icons-material/ListAlt";

function Admin() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [loader, setLoader] = useState(true);

  const fetchUserDetails = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setUserData(data);
    } catch (err) {
      console.error(err);
    }
    setLoader(false);
  };
  useEffect(() => {
    fetchUserDetails();
  }, [user]);
  if (loading || loader) {
    return (
      <div style={{ flex: 1 }}>
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-w admin-f">
      <header className="test-header">
        <div className="right-menu ">
          <h1 className="Big">
            Admin <span className="fc-b">System</span>
          </h1>
        </div>
      </header>
      <div className="test-flex">
        <div className="left-c pt-25 admin-nav blue-theme">
          <NavItem title={"Dashboard"} path="/" Icon={GridViewRoundedIcon} />
          <NavItem title={"Classes"} path="/classes" Icon={ClassIcon} />
          <NavItem
            title={"Subjects"}
            path="subjects"
            Icon={SubjectRoundedIcon}
          />
          <NavItem
            title={"Chapters"}
            path="chapters"
            Icon={SettingsApplicationsRoundedIcon}
          />
          <NavItem title={"Topics"} path="topics" Icon={HubRoundedIcon} />
          <NavItem title={"Tests"} path="tests" Icon={AddTaskRoundedIcon} />
          <NavItem
            title={"Available Tests"}
            path="availableTests"
            Icon={ListAltIcon}
          />
        </div>
        <div className="right-c admin-c">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="classes" element={<Classes />} />
            <Route path="subjects" element={<Subjects />} />
            <Route path="chapters" element={<Chapters />} />
            <Route path="topics" element={<Topics />} />
            <Route path="tests" element={<Tests />} />
            <Route path="availableTests" element={<AvailableTests />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Admin;
