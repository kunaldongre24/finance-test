//Kunal Dongre
import React, { useState, useEffect } from "react";
import "../style/testInstructions.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FlagIcon from "@mui/icons-material/Flag";
import DButton from "./DButton";
import {
  query,
  doc,
  collection,
  getDoc,
  getDocs,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { useNavigate, Link, useParams } from "react-router-dom";
import Spinner from "./Spinner";

function TestInstructions(props) {
  const [user, loading, error] = useAuthState(auth);
  const [test, setTest] = useState({});
  const [loading1, setLoading] = useState(true);
  const [questionsCount, setQuestionsCount] = useState();
  const [testAvailable, setTestAvailable] = useState(false);
  const [instructions, toggleInstructions] = useState(false);
  const navigate = useNavigate();
  const { testId } = useParams();
  const fetchTest = async () => {
    setLoading(true);
    const docRef = doc(db, "tests", testId);
    const docSnap = await getDoc(docRef);

    const t = query(
      collection(db, "testAttempted"),
      where("test_id", "==", docSnap.data().id),
      where("user_id", "==", user?.uid)
    );

    const snapshot = await getDocs(t);
    if (!snapshot.empty) {
      navigate(`/result/${docSnap.id}`);
    }
    if (docSnap.exists()) {
      setTest(docSnap.data());
      const t = query(
        collection(db, "questions"),
        where("test_id", "==", docSnap.data().id)
      );
      const testSnapshot = await getDocs(t);
      setQuestionsCount(testSnapshot.size);
      setTestAvailable(true);
    } else {
      setTestAvailable(false);
    }
    setLoading(false);
  };

  const goToTest = () => {
    if (!instructions) {
      alert("Please confirm if you have gone through all the instructions.");
    } else {
      navigate(`/test/${testId}`);
    }
  };
  useEffect(() => {
    fetchTest();
  }, [testId, user]);

  if (loading1) {
    return (
      <div className="centerSpin">
        <Spinner color="#222" />
      </div>
    );
  } else if (!testAvailable) {
    return (
      <div
        style={{
          width: "100%",
          height: 50,
          lineHeight: "50px",
          textAlign: "center",
        }}
      >
        This test is not available!
      </div>
    );
  }
  return (
    <div>
      <div className="dashboard__container">
        <div className="instruction-container">
          <div className="left-cnt">
            <h1>Test Instructions</h1>
            <div className="cnt-body">
              <div className="flex-info">
                <ul>
                  <li>Test Name:</li>
                  <li>Number of Questions:</li>
                  <li>Allocated Time:</li>
                  <li>Negative Marking:</li>
                </ul>
                <ul className="ul-res">
                  <li>{test.name}</li>
                  <li>{questionsCount}</li>
                  <li>{test.time} Minutes</li>
                  <li>NA</li>
                </ul>
              </div>
              <div className="ins-b">
                <h3>{test.instructions ? test.instructions : ""}</h3>
              </div>
            </div>
          </div>
          <div className="right-cnt">
            <h1 className="Big">
              <div>Online</div> Assessment <span className="fc-b">System</span>
            </h1>
            <div className="cnt-body">
              <div className="ins-b">
                <h3>Navigation Tools</h3>
                <div className="flex-info">
                  <div className="f-btn-cnt">
                    <DButton
                      Icon={NavigateNextIcon}
                      bgColor={"#5cb85c"}
                      left
                      title="Next"
                      fontSize={22}
                    />
                    <DButton
                      Icon={ArrowBackIosIcon}
                      bgColor={"#5cb85c"}
                      right
                      title="Previous"
                      fontSize={15}
                    />
                    <DButton
                      Icon={FlagIcon}
                      bgColor={"#f0ad4e"}
                      right
                      title="Flag"
                      fontSize={15}
                    />{" "}
                    <DButton
                      bgColor={"#d9534f"}
                      right
                      title="Exit Test"
                      fontSize={15}
                    />
                  </div>
                  <div className="rightest">
                    <div>
                      Next: By clicking Next button the next question will
                      appear to the User.
                    </div>
                    <div>
                      Previous: By clicking Previous button the previous
                      question will appear to the User.
                    </div>
                    <div>
                      Flag: To flag a question (To Respond Later), choose an
                      answer and click on flag button.
                    </div>
                    <div>
                      End Test: By clicking End Test Button the test gets
                      submitted.
                    </div>
                  </div>
                </div>
              </div>
            </div>{" "}
            <div className="agree">
              <input
                type="checkbox"
                checked={instructions}
                onChange={(e) => toggleInstructions(!instructions)}
              />
              <div>
                I have gone through the instructions, understood legends and
                will hereby follow the same.
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        <div className="footer-in">
          <button onClick={() => navigate(-1)}>
            <span>Back</span>{" "}
            <ArrowBackIcon style={{ fontSize: 18, marginLeft: 5 }} />
          </button>
          <button
            onClick={() => {
              goToTest();
            }}
          >
            <span>Start Test</span>{" "}
            <PlayArrowIcon style={{ fontSize: 18, marginLeft: 5 }} />
          </button>
        </div>
      </footer>
    </div>
  );
}

export default TestInstructions;
