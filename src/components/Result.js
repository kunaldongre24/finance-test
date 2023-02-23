//Kunal Dongre
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { useAuthState } from "react-firebase-hooks/auth";
import BarChart from "./BarChart";
import { db, auth } from "../config/firebase";
import Donut from "./Donut";
import PieChart from "./PieChart";
import Spinner from "./Spinner";

function Result(props) {
  const { testId } = useParams();
  const [loading1, setLoading] = useState(true);
  const [user, loading, error] = useAuthState(auth);
  const [questionLoading, setQuestionLoading] = useState(true);
  const [attemptLoading, setAttemptLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [userAttempedQ, setUserAttempedQ] = useState([]);
  const [optCount, setOptCount] = useState({});
  const [distinctTopic, setDistinctTopic] = useState([]);
  const [distinctNature, setDistinctNature] = useState([]);
  const [distinctDifficulty, setDistinctDifficulty] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [optionLoading, setOptionLoading] = useState(true);
  const [marks, setMarks] = useState(0);
  const [test, setTest] = useState({});
  const [dCount, setDCount] = useState({});
  const [topicCount, setTopicCount] = useState();
  const [nCount, setNCount] = useState({});
  const [loading2, setLoading2] = useState(true);
  const [userAnswers, setUserAnswers] = useState([]);
  const alp = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
  const counter = useRef(0);
  const navigate = useNavigate();

  useEffect(() => {
    props.headerShown(true);
  }, []);
  useEffect(() => {
    if (questions.length) {
      fetchOptions();
    }
  }, [questions]);
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

  const fetchTest = async () => {
    const docRef = doc(db, "tests", testId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTest(docSnap.data());
    } else {
      console.log("No such document!");
    }
    setLoading(false);
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
  const fetchAttemptedQuestion = async () => {
    setAttemptLoading(true);
    const t = query(
      collection(db, "userQuestionMap"),
      where("test_id", "==", test.id),
      where("user_id", "==", user.uid)
    );
    const testSnapshot = await getDocs(t);
    if (testSnapshot.empty) {
      navigate("/");
    }
    testSnapshot.docs.forEach((doc) => {
      setUserAttempedQ((prev) => [...prev, doc.data()]);
    });
    setAttemptLoading(false);
  };
  const fetchSubtopics = async () => {
    const data = await getDocs(collection(db, "topics"));
    setSubtopics(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };
  const fetchResponseCount = async () => {
    setLoading2(true);
    const t = query(
      collection(db, "userQuestionMap"),
      where("test_id", "==", test.id),
      where("user_id", "==", user.uid)
    );
    const arr = [];
    const topicArr = [];
    const resSnapshot = await getDocs(t);
    resSnapshot.docs.forEach((doc) => {
      arr.push(doc.data().selectedOption);
      topicArr.push(doc.data().topic);
    });
    var uniqs = arr.reduce((acc, val) => {
      acc[val] = acc[val] === undefined ? 1 : (acc[val] += 1);
      return acc;
    }, {});
    var uniqs2 = topicArr.reduce((acc, val) => {
      acc[val] = acc[val] === undefined ? 1 : (acc[val] += 1);
      return acc;
    }, {});

    setTopicCount(uniqs2);
    setOptCount(uniqs);
    setLoading2(false);
  };

  useEffect(() => {
    fetchTest();
  }, [testId]);
  useEffect(() => {
    if (test.id) {
      fetchQuestions();
      fetchSubtopics();
      fetchResponseCount();
      fetchAttemptedQuestion();
    }
  }, [test.id, user]);
  useEffect(() => {
    setLoading(true);
    var sum = 0;
    const testData = [];
    const natureData = [];
    const difficultyData = [];
    for (var i = 0; i < questions.length; i++) {
      const res = userAttempedQ.filter(
        (x) => x.question_id === questions[i].id
      )[0];
      testData.push({
        topic: questions[i].topic_id,
        marks: res && questions[i].correct === res.selectedOption ? 1 : 0,
      });
      natureData.push({
        name: questions[i].nature === "1" ? "Theory" : "Practical",
        count: res && questions[i].correct === res.selectedOption ? 1 : 0,
      });
      difficultyData.push({
        name:
          questions[i].difficulty === "1"
            ? "Easy"
            : questions[i].difficulty === "2"
            ? "Moderate"
            : "Hard",
        count: res && questions[i].correct === res.selectedOption ? 1 : 0,
      });
      if (res && questions[i].correct === res.selectedOption) {
        sum++;
      }
    }
    setMarks(sum);
    var tempData = [...testData],
      grouped = Array.from(
        tempData
          .reduce(
            (m, { topic, marks }) => m.set(topic, (m.get(topic) || 0) + marks),
            new Map()
          )
          .entries(),
        ([topic, marks]) => ({ topic, marks })
      ),
      natureGrouped = Array.from(
        natureData
          .reduce(
            (m, { name, count }) => m.set(name, (m.get(name) || 0) + count),
            new Map()
          )
          .entries(),
        ([name, count]) => ({ name, count })
      ),
      diffGrouped = Array.from(
        difficultyData
          .reduce(
            (m, { name, count }) => m.set(name, (m.get(name) || 0) + count),
            new Map()
          )
          .entries(),
        ([name, count]) => ({ name, count })
      );
    setDistinctTopic(grouped);
    setDistinctNature(natureGrouped);
    setDistinctDifficulty(diffGrouped);
    const userAnswers = userAttempedQ.map((x) => x.selectedOption);
    setUserAnswers(userAnswers);
    setLoading(false);
  }, [userAttempedQ, questions]);
  if (loading1 || loading || attemptLoading) {
    return (
      <div className="centerSpin">
        <Spinner color="#222" />
      </div>
    );
  }
  return (
    <div>
      <div className="dashboard__container">
        <div className="mb15 list-box">
          <h3
            style={{
              marginLeft: 20,
              marginRight: 20,
              lineHeight: "20px",
              flexWrap: "wrap",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Result</span>
            <span>Download Certificate</span>
          </h3>
          <div
            className="flex-ev"
            style={{
              minHeight: 220,
              paddingBottom: 10,
              alignItems: "center",
              borderBottom: "1px solid #eaeaea",
            }}
          >
            <div>
              <h2>Your Score</h2>
              <h1 style={{ textAlign: "center" }}>
                {marks}/{questions.length}
              </h1>
            </div>
            <Donut
              title={`${Math.round((marks / questions.length) * 100)}%`}
              g1={marks}
              g2={questions.length - marks}
            />
            <div>
              <h2>Marks per topic</h2>
              {distinctTopic.map((x) => (
                <span
                  key={x.topic}
                  className="flex-ct"
                  style={{ textTransform: "capitalize" }}
                >
                  <div>
                    {subtopics
                      .filter((topic) => topic.id === x.topic)
                      .map((data) => data.name)}
                    :
                  </div>
                  <div>
                    {Math.round((x.marks / topicCount[x.topic]) * 100)}%
                  </div>
                </span>
              ))}
            </div>
          </div>
          <div
            className="flex-ev"
            style={{
              height: 280,
              alignItems: "center",
              borderBottom: "1px solid #eaeaea",
            }}
          >
            <div
              style={{
                minWidth: 400,
                height: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: "bold",
                justifyContent: "space-around",
              }}
            >
              <PieChart colors={["#53A9DB", "#DA5365"]} data={distinctNature} />
              <div style={{ height: 30 }}>Theory vs Practical marks</div>
            </div>
            <div
              style={{
                minWidth: 400,
                height: 260,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                fontWeight: "bold",
                justifyContent: "space-around",
              }}
            >
              <PieChart
                colors={["#CC4525", "#6D924A", "#F19C2D"]}
                data={distinctDifficulty}
              />
              <div style={{ height: 30 }}>Marks as per difficulty</div>
            </div>
          </div>

          <div className="pd-15">
            <h3 style={{ color: "#f5832a" }}>Questions</h3>

            {questionLoading ? (
              <div className="centerSpin">
                <Spinner color="#222" />
              </div>
            ) : (
              questions
                .sort((a, b) => a.index - b.index)
                .map((q) => (
                  <div
                    key={q.id}
                    style={{
                      border: "1px solid #eaeaea",
                      padding: 25,
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ width: "50%" }}>
                        <div className="q-cnt" style={{ display: "block" }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              className="q-index"
                              style={{ color: "#006900" }}
                            >
                              Question {questions.indexOf(q) + 1}
                            </div>
                          </div>
                          <div
                            className="q-statement"
                            style={{ fontWeight: "bold" }}
                          >
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
                          <div className="q-options">
                            {optionLoading ? (
                              <div className="centerSpin">
                                <Spinner color="#222" />
                              </div>
                            ) : (
                              options
                                .filter((x) => x.question_id === q.id)
                                .sort((a, b) => a.index - b.index)
                                .map((x, i) => (
                                  <div key={x.id}>
                                    <div
                                      className="o-flex"
                                      style={{ marginTop: 0 }}
                                    >
                                      <span
                                        style={{
                                          marginRight: 15,
                                          width: 30,
                                          color: "#444",
                                          borderRight: "1px solid #ddd",
                                          paddingTop: 4,
                                          paddingBottom: 4,
                                        }}
                                      >
                                        {alp[i]}
                                      </span>
                                      <span
                                        style={{
                                          fontWeight:
                                            q.correct === x.id ? "bold" : 400,
                                          color:
                                            userAnswers.indexOf(x.id) > -1 &&
                                            q.correct !== x.id
                                              ? "#bd0000"
                                              : q.correct === x.id
                                              ? "#54CBA9"
                                              : "#555",
                                          paddingTop: 4,
                                          paddingBottom: 4,
                                        }}
                                      >
                                        {x.statement
                                          ? x.statement
                                          : `Option ${i + 1}`}
                                      </span>
                                    </div>
                                    {x.imageUrl ? (
                                      <div style={{ width: "100%" }}>
                                        <div
                                          style={{
                                            display: "flex",
                                            height: 50,
                                            alignItems: "center",
                                            display: imageLoading
                                              ? "block"
                                              : "none",
                                          }}
                                        >
                                          <Spinner color="#000" />
                                        </div>
                                        <img
                                          src={x.imageUrl}
                                          className="option-img"
                                          onLoad={imageLoaded}
                                          style={{
                                            display: imageLoading
                                              ? "none"
                                              : "block",
                                          }}
                                        />
                                      </div>
                                    ) : null}
                                  </div>
                                ))
                            )}
                            <h5 style={{ marginTop: 10 }}>
                              Nature:{" "}
                              <span style={{ color: "#888" }}>
                                {parseInt(q.nature) === 1
                                  ? "Theory"
                                  : "Practical"}
                              </span>
                            </h5>
                            <div>
                              <h5 style={{ marginTop: -10 }}>
                                Difficulty Level:{" "}
                                <span style={{ color: "#888" }}>
                                  {parseInt(q.difficulty) === 1
                                    ? "Easy"
                                    : parseInt(q.difficulty) === 2
                                    ? "Moderate"
                                    : "Hard"}
                                </span>
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                      {optionLoading || attemptLoading ? (
                        <div
                          className="centerSpin"
                          style={{
                            width: "50%",
                          }}
                        >
                          <Spinner color="#222" />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: "50%",
                          }}
                        >
                          <BarChart
                            optCount={optCount}
                            correctOption={q.correct}
                            options={options
                              .filter((x) => x.question_id === q.id)
                              .sort((a, b) => a.index - b.index)}
                          />
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row-reverse",
                              alignItems: "flex-end",
                              justifyContent: "right",
                            }}
                          >
                            <div className="flex-r">
                              <h4 style={{ color: "#555" }}>Your Response:</h4>
                              {options
                                .filter((x) => x.question_id === q.id)
                                .sort((a, b) => a.index - b.index)
                                .map((x, i) => (
                                  <h4
                                    key={x.id}
                                    style={{
                                      color:
                                        q.correct !== x.id
                                          ? "#bd0000"
                                          : "#54CBA9",
                                      marginLeft: 10,
                                      display:
                                        userAnswers.indexOf(x.id) > -1
                                          ? ""
                                          : "none",
                                    }}
                                  >
                                    {alp[i]}
                                  </h4>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="q-footer" style={{ display: "block" }}>
                      <h3 style={{ color: "#a00000" }}>Solution:</h3>
                      {q.solution || q.solutionImageUrl ? (
                        <div style={{ marginLeft: 10, display: "block" }}>
                          {q.solution}
                          <div className="q-image">
                            <img
                              src={q.solutionImageUrl}
                              onLoad={imageLoaded}
                              style={{
                                marginTop: 10,
                                maxWidth: 900,
                                display: imageLoading ? "none" : "block",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <h3 style={{ color: "#888" }}>No Solution</h3>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
