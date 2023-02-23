//Kunal Dongre

import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, Link } from "react-router-dom";
import "../style/dashboard.css";
import "../style/listbox.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { auth, db, logout } from "../config/firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Spinner from "./Spinner";
import InfoBox from "./InfoBox";
import LoadingDashboard from "./LoadingDashboard";

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [loader, setLoader] = useState(true);
  const [tests, setTests] = useState([]);
  const [load, setLoading] = useState(true);
  const [attempted, setAttempted] = useState([]);
  const [loading1, setLoading1] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [attemptedTest, setAttemptedTest] = useState([]);

  const fetchUserName = async () => {
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
    fetchUserName();
    fetchTests();
    userAttemptedTest();
  }, [user]);

  const userAttemptedTest = async () => {
    const t = query(
      collection(db, "testAttempted"),
      where("user_id", "==", user.uid)
    );
    const testSnapshot = await getDocs(t);
    setAttempted(testSnapshot.docs.map((doc) => ({ ...doc.data() })));

    setLoading1(false);
  };
  const fetchTests = async () => {
    const data = await getDocs(collection(db, "tests"));
    setTests(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };
  const testDetails = async () => {
    for (var i = 0; i < attempted.length; i++) {
      const t = query(
        collection(db, "tests"),
        where("id", "==", attempted[i].test_id)
      );
      const testSnapshot = await getDocs(t);
      testSnapshot.docs.forEach((doc) => {
        setAttemptedTest((prev) => [...prev, { ...doc.data() }]);
      });
    }

    setLoading2(false);
  };
  useEffect(() => {
    testDetails();
  }, [attempted]);
  if (loading || loader || load || loading1 || loading2) {
    return (
      <div style={{ flex: 1 }}>
        <LoadingDashboard />
      </div>
    );
  }
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div className="flex-ct mb15">
          <div className="list-box">
            <div className="list-header">
              <div className="flex-jcsp">
                <div className="flex">
                  <AccountCircleIcon
                    style={{
                      fontSize: 45,
                      marginLeft: -5,
                      color: "#066ead",
                      marginRight: 5,
                    }}
                  />

                  <div>{userData.name}</div>
                </div>
                <Link className="button-link" to="/editProfile">
                  Edit Profile
                </Link>
              </div>
            </div>
            <div className="list-body pa-10 flex-r">
              <InfoBox value="3" title="Test Attempted" />
              <InfoBox value="92%" title="Average Score" />
              <InfoBox value="98%" title="Highest Score" />
              <InfoBox value="87%" title="Lowest Score" />
            </div>
          </div>
        </div>
        <div className="flex-ct">
          <div className="list-box">
            <div className="list-header">
              <img src={require("../images/testIcon.png")} />
              <div>Available Tests</div>
            </div>
            <div className="list-body attempt">
              {tests.length ? (
                tests
                  .sort(function (a, b) {
                    return b.created_on - a.created_on;
                  })
                  .map((test, i) => (
                    <Link to={`/testInstructions/${test.id}`} key={test.id}>
                      <div className="list-item">
                        <span>
                          <span className="num">{i + 1}</span>
                          {test.name ? test.name : "Untitled Test"}
                        </span>
                        <button>ATTEMPT</button>
                      </div>
                    </Link>
                  ))
              ) : (
                <div className="pd-152">No test Available</div>
              )}
            </div>
          </div>
          <div className="list-box">
            <div className="list-header">
              <img src={require("../images/test-attempted.png")} />
              <div>Attempted Tests</div>
            </div>
            <div className="list-body">
              {attempted.length ? (
                attempted
                  .sort(function (a, b) {
                    return b.created_on - a.created_on;
                  })
                  .map((x, i) => (
                    <Link
                      className="list-item"
                      key={x.id}
                      to={`/result/${x.ref_id}`}
                    >
                      <span>
                        <span className="num">{i + 1}</span>
                        {attemptedTest
                          .filter((y) => y.id === x.test_id)
                          .map((n) => n.name)}
                      </span>
                      <button>RESULT</button>
                    </Link>
                  ))
              ) : (
                <span className="list-item" style={{ border: "none" }}>
                  No test attempted
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
