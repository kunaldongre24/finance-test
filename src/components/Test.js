//Kunal Dongre
import React, { useEffect, useState, useRef } from "react";
import "../style/test.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  setDoc,
  addDoc,
  query,
  getDoc,
  where,
} from "firebase/firestore";
import Spinner from "./Spinner";
import DButton from "./DButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import FlagIcon from "@mui/icons-material/Flag";
import { useParams } from "react-router-dom";
import Countdown from "react-countdown";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

function Test(props) {
  const [user, loading, error] = useAuthState(auth);
  const [userData, setUserData] = useState({});
  const [test, setTest] = useState({});
  const [questions, setQuestions] = useState([]);
  const [loader, setLoader] = useState(true);
  const [load, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [optionLoading, setOptionLoading] = useState(true);
  const [questionLoading, setQuestionLoading] = useState(true);
  const { testId } = useParams();
  const [MemoCountdown, setMemoCountDown] = useState();
  const [showExitModal, setShowExitModal] = useState();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitTestReq, setSubmitTest] = useState(false);
  const [testAvailable, setTestAvailable] = useState(false);
  const [answered, setAnswered] = useState([]);
  const [flag, setFlag] = useState([]);
  const navigate = useNavigate();
  const counter = useRef(0);

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
    setFlag((prev) => [...prev.filter((x) => x !== currentQuestion)]);
  }, [currentQuestion]);
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  const markAnswer = (id) => {
    setAnswered((prev) => [...prev.filter((x) => x != id), id]);
  };
  const flagQuestion = () => {
    setFlag((prev) => [
      ...prev.filter((x) => x !== currentQuestion),
      currentQuestion,
    ]);
  };
  const prevQuestion = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  useEffect(() => {
    fetchTest();
  }, [testId]);
  useEffect(() => {
    if (test.id) {
      fetchQuestions();
    }
  }, [test.id]);
  useEffect(() => {
    if (questions.length) {
      fetchOptions();
    }
  }, [questions]);
  const fetchOptions = async () => {
    setOptionLoading(true);
    for (var i = 0; i < questions.length; i++) {
      const t = query(
        collection(db, "options"),
        where("question_id", "==", questions[i].id)
      );
      const questionSnapshot = await getDocs(t);
      questionSnapshot.docs.forEach((doc) => {
        setOptions((prev) => [...prev, doc.data()]);
      });
    }
    setOptionLoading(false);
  };

  const fetchQuestions = async () => {
    setQuestionLoading(true);
    const t = query(
      collection(db, "questions"),
      where("test_id", "==", test.id)
    );
    const testSnapshot = await getDocs(t);
    testSnapshot.docs.forEach((doc) => {
      setQuestions((prev) => [...prev, doc.data()]);
    });
    setQuestionLoading(false);
  };
  const fetchTest = async () => {
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
      setTestAvailable(true);
      setTest(docSnap.data());
    } else {
      setTestAvailable(false);
      setLoading(false);
      setImageLoading(false);
      setOptionLoading(false);
      setQuestionLoading(false);
    }
    setLoading(false);
  };
  useEffect(() => {
    props.headerShown(false);
  }, []);
  const CountdownWrapper = () => (
    <Countdown
      onComplete={() => {
        submitTest();
      }}
      date={Date.now() + parseInt(test.time) * 60 * 1000} //parseInt(test.time) * 60 * 1000
      renderer={renderer}
    />
  );
  useEffect(() => {
    const memo = React.memo(CountdownWrapper);
    setMemoCountDown(memo);
  }, [test]);
  const Completionist = () => (
    <div className="file-upload-modal">
      <div className="file-modal-box">
        <div className="modal-box-header">ending Test!</div>
        <div className="modal-body" style={{ textAlign: "center" }}>
          <div style={{ flex: 1, height: 50 }}>
            <Spinner color="#000" />
          </div>
          <h2>Your test is being Submitted!</h2>
        </div>
      </div>
    </div>
  );

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return (
        <div>
          <span>
            {hours < 10 ? `0${hours}` : hours}:
            {minutes < 10 ? `0${minutes}` : minutes}:
            {seconds < 10 ? `0${seconds}` : seconds}
          </span>
          <Completionist />
        </div>
      );
    } else {
      return (
        <span>
          {hours < 10 ? `0${hours}` : hours}:
          {minutes < 10 ? `0${minutes}` : minutes}:
          {seconds < 10 ? `0${seconds}` : seconds}
        </span>
      );
    }
  };
  const imageLoaded = () => {
    counter.current += 1;
    if (
      counter.current >=
      questions.filter((x) => x.imageUrl).length +
        options.filter((x) => x.imageUrl).length
    ) {
      setImageLoading(false);
    }
  };
  const uploadQuestion = async (question_id, topic, index, selectedOption) => {
    const mapId = uuidv4();
    const res = await addDoc(collection(db, "userQuestionMap"), {
      id: mapId,
      user_id: user.uid,
      test_id: test.id,
      question_id: question_id,
      index: index,
      topic: topic,
      selectedOption,
      created_on: Date.now(),
      last_update: Date.now(),
    }).catch((err) => console.error(err));
  };
  const submitTest = async () => {
    setShowExitModal(false);
    setSubmitTest(true);
    const attemptId = uuidv4();
    await addDoc(collection(db, "testAttempted"), {
      id: attemptId,
      user_id: user.uid,
      test_id: test.id,
      ref_id: testId,
      created_on: Date.now(),
      last_update: Date.now(),
    }).catch((err) => console.error(err));
    for (var i = 0; i < questions.length; i++) {
      const selectedOption = document.querySelector(
        `input[name="${questions[i].id}"]:checked`
      );
      const selected = selectedOption ? selectedOption.value : "";
      uploadQuestion(
        questions[i].id,
        questions[i].topic_id,
        questions[i].index,
        selected
      );
    }
    navigate(`/result/${testId}`);
  };

  useEffect(() => {
    fetchUserDetails();
  }, [user]);
  if (loading || loader || load || optionLoading || questionLoading) {
    return (
      <div style={{ flex: 1, height: 400 }}>
        <Spinner color="#000" />
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
    <div className="bg-w">
      {submitTestReq ? <Completionist /> : null}
      <div
        className="file-upload-modal"
        id="file-modal-body"
        hidden={showExitModal ? "" : "hidden"}
      >
        <div className="file-modal-box">
          <div className="modal-box-header">
            Are you sure you want to end?
            <div
              className="modal-close"
              onClick={() => {
                setShowExitModal(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 0 24 24"
                width="24px"
                fill="#000000"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </div>
          </div>
          <div className="modal-body">
            Answered: {answered.length}
            <br />
            Unanswered: {questions.length - answered.length}
            <div className="flex-space-between">
              <button
                className="upload-button"
                onClick={() => {
                  setShowExitModal(false);
                }}
              >
                No
              </button>
              <button
                className="upload-button red"
                onClick={() => {
                  submitTest();
                }}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <header className="test-header">
        <div className="right-menu">
          <h1 className="Big">
            Assessment <span className="fc-b">System</span>
          </h1>
        </div>
        <div className="timer">
          Time Remaining-&nbsp;
          <span className="timer-cnt">
            <MemoCountdown />
          </span>
        </div>
      </header>
      <div className="test-flex">
        <div className="left-c ">
          <div className="check-e ">
            <div className="in-box b1">{userData.name}</div>
          </div>
          <div className="check-e">
            <div className="in-box b2">
              <div className="in-box-header">Status</div>
              <div className="in-box-body">
                <DButton
                  bgColor={"#5cb85c"}
                  left
                  title="Answered"
                  fontSize={22}
                  count={answered.length ? answered.length : "0"}
                />
                <DButton
                  bgColor={"#f0ad4e"}
                  right
                  title="Flagged"
                  fontSize={15}
                  count={flag.length ? flag.length : "0"}
                />
                <DButton
                  bgColor={"#5cb85c"}
                  right
                  title="Pending"
                  count={
                    questions.length - answered.length
                      ? questions.length - answered.length
                      : "0"
                  }
                  fontSize={15}
                />
              </div>
            </div>
          </div>
          <div className="check-e">
            <div className="in-box b3">
              <div className="in-box-header bh3">Questions</div>
              <div className="in-box-body bb3" style={{ display: "flex" }}>
                {questions
                  .sort((a, b) => a.index - b.index)
                  .map((q, i) => (
                    <button
                      className={`question-index 
                      ${
                        answered.filter((x) => x === q.id).length
                          ? "answered"
                          : ""
                      }
                      ${
                        flag.filter((x) => x === q.index).length
                          ? "flagged"
                          : ""
                      }
                      ${q.index === currentQuestion ? "active" : ""}
                      `}
                      key={q.id}
                      onClick={() => {
                        setCurrentQuestion(q.index);
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <div className="right-c pd-15">
          {questions
            .sort((a, b) => a.index - b.index)
            .map((q) => (
              <div
                key={q.id}
                hidden={q.index === currentQuestion ? "" : "hidden"}
              >
                <div className="q-cnt">
                  <div className="q-index">
                    Q: {questions.indexOf(q) + 1} of {questions.length}
                  </div>
                  <div className="q-statement">
                    {q.statement}
                    {q.imageUrl ? (
                      <div className="q-image">
                        <div
                          style={{
                            display: "flex",
                            height: 50,
                            alignItems: "center",
                            display: imageLoading ? "block" : "none",
                          }}
                        >
                          <Spinner color="#000" />
                        </div>

                        <img
                          src={q.imageUrl}
                          onLoad={imageLoaded}
                          style={{
                            display: imageLoading ? "none" : "block",
                          }}
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <div className="q-cnt o-cnt">
                  <div className="q-index">Options :</div>
                  <div className="q-options">
                    {options
                      .filter((x) => x.question_id === q.id)
                      .sort((a, b) => a.index - b.index)
                      .map((x, i) => (
                        <div key={x.id}>
                          <div className="o-flex">
                            <input
                              onChange={() => markAnswer(q.id)}
                              type="radio"
                              name={q.id}
                              id={x.id}
                              value={x.id}
                            />
                            <label htmlFor={x.id}>
                              <span>
                                {x.statement ? x.statement : `Option ${i + 1}`}
                              </span>
                            </label>
                          </div>
                          {x.imageUrl ? (
                            <div style={{ width: "100%" }}>
                              <div
                                style={{
                                  display: "flex",
                                  height: 50,
                                  alignItems: "center",
                                  display: imageLoading ? "block" : "none",
                                }}
                              >
                                <Spinner color="#000" />
                              </div>
                              <img
                                src={x.imageUrl}
                                className="option-img"
                                onLoad={imageLoaded}
                                style={{
                                  display: imageLoading ? "none" : "block",
                                }}
                              />
                            </div>
                          ) : null}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <footer className="test-foot">
        <div className="footer-right">
          <DButton
            Icon={ArrowBackIosIcon}
            bgColor={"#5cb85c"}
            right
            title="Previous"
            fontSize={15}
            onClick={() => {
              prevQuestion();
            }}
          />
          <DButton
            Icon={FlagIcon}
            bgColor={"#f0ad4e"}
            right
            title="Flag"
            fontSize={15}
            onClick={() => {
              flagQuestion();
            }}
          />
          <DButton
            Icon={NavigateNextIcon}
            bgColor={"#5cb85c"}
            left
            title="Next"
            fontSize={22}
            onClick={() => {
              nextQuestion();
            }}
          />
        </div>
        <DButton
          bgColor={"#d9534f"}
          right
          title="End Test"
          onClick={() => {
            setShowExitModal(true);
          }}
          fontSize={15}
        />
      </footer>
    </div>
  );
}

export default Test;
