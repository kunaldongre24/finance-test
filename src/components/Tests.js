//Kunal Dongre
import React, { useState, useEffect, useCallback } from "react";
import "../style/newTest.css";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { v4 as uuidv4 } from "uuid";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  setDoc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "../config/firebase";
import { useDropzone } from "react-dropzone";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import Spinner from "./Spinner";

function Tests() {
  const [loading, setLoading] = useState(true);
  const [focusId, setFocusId] = useState();
  const [questions, setQuestions] = useState([]);
  const [options, setOptions] = useState([]);
  const [QFocusId, setQFocusId] = useState({});
  const [YFocusId, setYFocusId] = useState();
  const [duplicateId, setDuplicateId] = useState();
  const [classes, setClasses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFileModal, setFileModal] = useState(false);
  const [data, setData] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imgUrl, setImgUrl] = useState();
  const [uploadId, setUploadId] = useState({});
  const [uploading, setUploading] = useState(false);
  const [test, setTest] = useState({});
  const [saveLoader, setSaveLoader] = useState(false);
  const [errorFocus, setErrorFocus] = useState();
  const [testName, setTestName] = useState("");
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      setFiles((oldArray) => [...oldArray, file]);
    });
  }, []);
  const changeTestName = (e) => {
    const name = e.target.value;
    setTestName(name);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const setShowFileModal = (param) => {
    setFileModal(param);
    setFiles([]);
    setUploading(false);
    setUploadProgress();
  };
  const removeFile = (filePath) => {
    setFiles(files.filter((item) => item.path !== filePath));
  };

  const handleSubmit = () => {
    setUploading(true);
    const file = files[0];
    if (!file) return;
    const metadata = {
      contentType: "image/jpeg",
    };
    const fileName = uuidv4();
    const storageRef = ref(storage, `files/${fileName + file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.error(error);
        setUploading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          if (uploadId.type === 1) {
            questions.forEach((element, index) => {
              if (element.id === uploadId.id) {
                questions[index].imageUrl = downloadURL;
              }
            });
          } else if (uploadId.type === 2) {
            options.forEach((element, index) => {
              if (element.id === uploadId.id) {
                options[index].imageUrl = downloadURL;
              }
            });
          } else {
            questions.forEach((element, index) => {
              if (element.id === uploadId.id) {
                questions[index].solutionImageUrl = downloadURL;
              }
            });
          }
          setUploading(false);
          setShowFileModal(false);
        });
      }
    );
  };
  const uploadQuestions = async (
    id,
    statement,
    chapter_id,
    subject_id,
    imageUrl,
    topic_id,
    test_id,
    index,
    solution,
    solutionImageUrl,
    correct_option
  ) => {
    const res = await addDoc(collection(db, "questions"), {
      id: id,
      chapter_id: chapter_id,
      subject_id: subject_id,
      statement: statement,
      imageUrl: imageUrl ? imageUrl : "",
      topic_id: topic_id,
      test_id: test_id,
      index: index,
      correct: correct_option,
      solution: solution,
      solutionImageUrl: solutionImageUrl ? solutionImageUrl : "",
      created_on: Date.now(),
      last_update: Date.now(),
    }).catch((err) => console.error(err));
    return res;
  };
  const uploadOptions = async (id, statement, imageUrl, question_id, index) => {
    const res = await addDoc(collection(db, "options"), {
      id: id,
      statement: statement,
      imageUrl: imageUrl ? imageUrl : "",
      question_id: question_id,
      test_id: test.id,
      index: index,
      created_on: Date.now(),
      last_update: Date.now(),
    }).catch((err) => console.error(err));
    return res;
  };
  const saveTest = async (e) => {
    setErrorFocus();
    setSaveLoader(true);
    const t = query(collection(db, "tests"), where("id", "==", test.id));
    const testSnapshot = await getDocs(t);
    testSnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    const q = query(
      collection(db, "questions"),
      where("test_id", "==", test.id)
    );
    const questionsSnapshot = await getDocs(q);
    questionsSnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    const o = query(collection(db, "options"), where("test_id", "==", test.id));
    const optionsSnapshot = await getDocs(o);
    optionsSnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
    if (!test.time || !test.class_id) {
      setSaveLoader(false);

      return setErrorFocus(test.id);
    }
    console.log(test);
    const res = await addDoc(collection(db, "tests"), {
      id: test.id,
      name: testName,
      time: test.time,
      isVisible: false,
      isAvailable: false,
      class_id: test.class_id,
      created_on: Date.now(),
      last_update: Date.now(),
    }).catch((err) => console.error(err));

    if (res) {
      for (var i = 0; i < questions.length; i++) {
        var selected;
        const {
          id,
          statement,
          chapter_id,
          subject_id,
          imageUrl,
          topic_id,
          solution,
          solutionImageUrl,
        } = questions[i];
        const selectedOption = document.querySelector(
          `input[name="${questions[i].id}"]:checked`
        );
        if (selectedOption && chapter_id && subject_id && topic_id) {
          selected = selectedOption.value;
        } else {
          const t = query(collection(db, "tests"), where("id", "==", test.id));
          const testSnapshot = await getDocs(t);
          testSnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
          });
          const q = query(
            collection(db, "questions"),
            where("test_id", "==", test.id)
          );
          const questionsSnapshot = await getDocs(q);
          questionsSnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
          });
          const o = query(
            collection(db, "options"),
            where("test_id", "==", test.id)
          );
          const optionsSnapshot = await getDocs(o);
          optionsSnapshot.forEach((doc) => {
            deleteDoc(doc.ref);
          });
          setSaveLoader(false);
          return setErrorFocus(questions[i].id);
        }
        const qRes = uploadQuestions(
          id,
          statement,
          chapter_id,
          subject_id,
          imageUrl,
          topic_id,
          test.id,
          i,
          solution,
          solutionImageUrl,
          selected
        );
      }
      for (var j = 0; j < options.length; j++) {
        const { id, statement, imageUrl, question_id } = options[j];
        const oRes = uploadOptions(id, statement, imageUrl, question_id, j);
      }
      alert("Test has been created!");
    }

    setSaveLoader(false);
  };
  useEffect(() => {
    fetchClasses();
    fetchChapters();
    fetchSubjects();
    fetchSubtopics();
  }, []);
  const showUploadModal = (id) => {
    setShowModal(true);
  };
  const fetchClasses = async () => {
    const data = await getDocs(collection(db, "classes"));
    setClasses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const fetchChapters = async () => {
    const data = await getDocs(collection(db, "chapters"));
    setChapters(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };
  const fetchSubjects = async () => {
    const data = await getDocs(collection(db, "subjects"));
    setSubjects(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  const fetchSubtopics = async () => {
    const data = await getDocs(collection(db, "topics"));
    setSubtopics(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };
  const deleteQuestion = (id) => {
    setQuestions(questions.filter((x) => x.id !== id));
  };
  const removeOption = (id) => {
    setOptions(options.filter((x) => x.id !== id));
  };
  const addOption = (qid) => {
    const oid = uuidv4();
    setOptions([...options, { id: oid, statement: "", question_id: qid }]);
    setFocusId(oid);
  };
  const addQuestion = () => {
    const qid = uuidv4();
    const oid = uuidv4();
    setQuestions([...questions, { id: qid, statement: "", test_id: test.id }]);
    setOptions((prev) => [
      ...options.filter((x) => x.id !== oid),
      { id: oid, statement: "", question_id: qid },
    ]);
    setYFocusId(qid);
    const tmp = QFocusId;
    tmp.old = QFocusId.new;
    tmp.new = qid;
    setQFocusId(tmp);
  };
  useEffect(() => {
    if (errorFocus) {
      document
        .getElementsByClassName(errorFocus)[0]
        .scrollIntoView({ behavior: "smooth" });
    }
  }, [errorFocus]);
  useEffect(() => {
    if (document.getElementsByClassName(QFocusId.old).length) {
      document.getElementsByClassName(QFocusId.old)[0].style.borderLeftColor =
        "transparent";
    }
    if (document.getElementsByClassName(QFocusId.new).length) {
      document.getElementsByClassName(QFocusId.new)[0].style.borderLeftColor =
        "#2A6DE6";
      document
        .getElementsByClassName(QFocusId.new)[0]
        .scrollIntoView({ behavior: "smooth" });
      const tmp = QFocusId;
      tmp.old = QFocusId.new;
      setQFocusId(tmp);
    }
  }, [QFocusId.new, QFocusId.old]);
  useEffect(() => {
    if (document.getElementById(focusId)) {
      document.getElementById(focusId).focus();
    }
  }, [options]);
  useEffect(() => {
    if (document.getElementById(YFocusId)) {
      document.getElementById(YFocusId).focus();
    }
    if (document.getElementsByClassName(YFocusId).length) {
      document
        .getElementsByClassName(YFocusId)[0]
        .scrollIntoView({ behavior: "smooth" });
    }
  }, [questions]);
  const setQuestionStatement = (e, id) => {
    const statement = e.target.value;
    questions.filter((x) => x.id === id)[0].statement = statement;
  };
  const setQuestionSolution = (e, id) => {
    const solution = e.target.value;
    questions.filter((x) => x.id === id)[0].solution = solution;
  };

  const setTestClass = (e) => {
    const classInfo = e.target.value;
    test.class_id = classInfo;
  };
  const setQuestionSubject = (e, id) => {
    const subject = e.target.value;
    questions.filter((x) => x.id === id)[0].subject_id = subject;
  };
  const setQuestionChapter = (e, id) => {
    const chapter = e.target.value;
    questions.filter((x) => x.id === id)[0].chapter_id = chapter;
  };
  const setQuestionTopic = (e, id) => {
    const topic = e.target.value;
    questions.filter((x) => x.id === id)[0].topic_id = topic;
  };
  const setOptionStatement = (e, id) => {
    const statement = e.target.value;
    options.filter((x) => x.id === id)[0].statement = statement;
  };
  const setTestTime = (e) => {
    const time = e.target.value;
    test.time = time;
    setTest(test);
  };
  const removeImage = (id, type) => {
    if (type === 3) {
      const element = questions;
      element.filter((x) => x.id === id)[0].solutionImageUrl = "";
    } else {
      const element = type === 1 ? questions : options;
      element.filter((x) => x.id === id)[0].imageUrl = "";
    }
  };
  const duplicate = (element) => {
    const {
      statement,
      class_id,
      subject_id,
      chapter_id,
      topic_id,
      imageUrl,
      test_id,
      solution,
      solutionImageUrl,
    } = element;
    const qid = uuidv4();
    const tmp = {
      id: qid,
      statement: statement,
      class_id,
      chapter_id,
      subject_id,
      imageUrl,
      topic_id,
      test_id,
      solution,
      solutionImageUrl,
    };
    const index = questions.indexOf(element);
    const qtmp = questions;
    qtmp.splice(index + 1, 0, tmp);
    const oTmp = [];
    const tmp2 = options.filter((q) => q.question_id === element.id);
    for (var i = 0; i < tmp2.length; i++) {
      oTmp.push({
        id: uuidv4(),
        statement: tmp2[i].statement,
        question_id: qid,
        imageUrl: tmp2[i].imageUrl,
      });
      setQFocusId(uuidv4);
    }
    setOptions(oTmp);
    setQuestions(qtmp);
    setOptions(() => [...options, ...oTmp]);
    setDuplicateId(qid);
  };
  const checkEmpty = (id, index) => {
    if (document.getElementById(id)) {
      const element = document.getElementById(id);
      if (element.value.slice(" ") === "") {
        element.value = `Option ${index + 1}`;
      }
    }
  };
  const checkName = () => {
    const id = test.id;
    if (document.getElementById(id)) {
      const element = document.getElementById(id);
      if (element.value.slice(" ") === "") {
        element.value = `Untitled Test`;
      }
    }
  };
  useEffect(() => {
    setYFocusId(duplicateId);
    const el = QFocusId;
    el.old = QFocusId.new;
    el.new = duplicateId;
    setQFocusId(el);
  }, [duplicateId]);
  useEffect(() => {
    const qid = uuidv4();
    const oid = uuidv4();
    setQuestions(() => [
      ...questions.filter((x) => x.id !== qid),
      { id: qid, statement: "", test_id: test.id },
    ]);
    setOptions((prev) => [
      ...options.filter((x) => x.id !== oid),
      { id: oid, statement: "", question_id: qid },
    ]);
  }, []);
  useEffect(() => {
    const test_id = uuidv4();
    setTest({ name: "", id: test_id });
    setQFocusId({ new: test_id, old: QFocusId.old ? QFocusId.old : null });
  }, []);

  function CSVToJSON(csvData) {
    var data = CSVToArray(csvData);
    var objData = [];
    for (var i = 1; i < data.length; i++) {
      objData[i - 1] = {};
      for (var k = 0; k < data[0].length && k < data[i].length; k++) {
        var key = data[0][k];
        objData[i - 1][key] = data[i][k];
      }
    }

    return objData;
  }
  function CSVToArray(csvData, delimiter) {
    delimiter = delimiter || ",";
    var pattern = new RegExp(
      "(\\" +
        delimiter +
        "|\\r?\\n|\\r|^)" +
        '(?:"([^"]*(?:""[^"]*)*)"|' +
        '([^"\\' +
        delimiter +
        "\\r\\n]*))",
      "gi"
    );
    var data = [[]];
    var matches = null;
    while ((matches = pattern.exec(csvData))) {
      var matchedDelimiter = matches[1];
      if (matchedDelimiter.length && matchedDelimiter != delimiter) {
        data.push([]);
      }
      if (matches[2]) {
        var matchedDelimiter = matches[2].replace(new RegExp('""', "g"), '"');
      } else {
        var matchedDelimiter = matches[3];
      }
      data[data.length - 1].push(matchedDelimiter);
    }
    return data;
  }
  const importCSV = (e) => {
    e.preventDefault();

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;

      let word_array = CSVToJSON(text);
      for (var i = 0; word_array && i < word_array.length; i++) {
        setIndividualQuestion(word_array[i]);
      }
    };
    reader.readAsText(e.target.files[0]);
  };
  //   Chapter ID: "15"
  // Class ID: "5"
  // Difficulty Level: "1"
  // Nature: "Theory / Practical"
  // Option 1: "Rbei"
  // Option 2: "Deepak"
  // Option 3: "Aman"
  // Option 4: "Shyam"
  // Question: "What is the name of this person?"
  // Question ID: "632"
  // Question Image Link: "https://www.rbeiset.com/rbei.png"
  // Right Answer: "1"
  // Solution: "Yes this is the logo of Rbei"
  // Solution Image Link: "https://www.rbeiset.com/rbei.png"
  // Subject ID: "25"
  // Test ID: "20"
  const setIndividualQuestion = (question) => {
    if (!question["Question"] && !question["Question Image Link"]) {
      return;
    }
    const qid = uuidv4();
    const oid1 = uuidv4();
    const oid2 = uuidv4();
    const oid3 = uuidv4();
    const oid4 = uuidv4();
    test.class_id = question["Class ID"];
    setTest(test);
    setOptions((prev) => [
      ...prev,
      { id: oid1, statement: question["Option 1"], question_id: qid },
      { id: oid2, statement: question["Option 2"], question_id: qid },
      { id: oid3, statement: question["Option 3"], question_id: qid },
      { id: oid4, statement: question["Option 4"], question_id: qid },
    ]);
    var coId = oid1;
    const coi = question["Right Answer"];
    if (coi === "1") {
      coId = oid1;
    } else if (coi === "2") {
      coId = oid2;
    } else if (coi === "3") {
      coId = oid3;
    } else if (coi === "4") {
      coId = oid4;
    } else {
      coId = "";
    }
    const qObj = {
      id: qid,
      statement: question["Question"] ? question["Question"] : "",
      class_id: question["Class ID"] ? question["Class ID"] : "",
      chapter_id: question["Chapter ID"] ? question["Chapter ID"] : "",
      subject_id: question["Subject ID"] ? question["Subject ID"] : "",
      imageUrl: question["Question Image Link"]
        ? question["Question Image Link"]
        : "",
      correct_option_id: coId,
      topic_id: question["Topic ID"] ? question["Topic ID"] : "",

      solution: question["Solution"],
      solutionImageUrl: question["Solution Image Link"],
      test_id: test.id,
    };
    setQuestions((prev) => [...prev, qObj]);
  };
  return (
    <div>
      <div
        className="file-upload-modal"
        id="file-modal-body"
        hidden={showFileModal ? "" : "hidden"}
      >
        <div className="file-modal-box">
          <div className="modal-box-header">
            Upload File
            <div
              className="modal-close"
              onClick={() => {
                setShowFileModal(false);
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
            <div className="upload-here" {...getRootProps()}>
              {!files.length ? (
                <>
                  <h1>Drag the file here</h1>
                  <div className="or-center">OR</div>
                  <div className="file-input">
                    click to select file
                    <input {...getInputProps()} type="file" accept="image/*" />
                  </div>
                </>
              ) : (
                <>
                  <div className="or-center">{files.length} file selected</div>
                  <ul className="fileList">
                    {files.map((file) => {
                      return (
                        <li key={file.path}>
                          {file.path} - {file.size / 1000}kb
                          <span onClick={() => removeFile(file.path)}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              height="24px"
                              viewBox="0 0 24 24"
                              width="24px"
                              fill="#777"
                            >
                              <path d="M0 0h24v24H0V0z" fill="none" />
                              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                            </svg>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>
            <div
              className="uploadProgress"
              hidden={uploadProgress === "" || !uploadProgress ? "hidden" : ""}
            >
              <div
                className="uploadStatus"
                style={{ width: uploadProgress + "%" }}
              >
                {uploadProgress}%
              </div>
            </div>
            <button
              disabled={files.length ? false : true}
              className="upload-button"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </div>
      </div>
      <div className="create-test-header">
        <label htmlFor="file-upload" className="custom-file-upload">
          Import Csv
        </label>
        <input id="file-upload" type="file" onChange={importCSV} />
        <button
          style={{ width: 100 }}
          onClick={() => {
            saveTest();
          }}
        >
          {saveLoader ? <Spinner /> : "Save Test"}
        </button>
      </div>
      <div className="pd-152">
        <div
          className={`new-test ${test.id} test-name  ${
            errorFocus === test.id ? "missing" : null
          }`}
          onClick={() =>
            setQFocusId({
              new: test.id,
              old: QFocusId.old ? QFocusId.old : null,
            })
          }
        >
          <div className="nhead"></div>

          <div className="flx-h">
            <div style={{ position: "relative", width: "100%" }}>
              <textarea
                type="text"
                id={test.id}
                onChange={(e) => changeTestName(e)}
                placeholder="Test Name"
                onBlur={() => checkName(test.id, 0)}
                className="effect-2 bold-input"
                defaultValue={testName ? testName : "Untitled Test"}
              ></textarea>
              <span className="focus-border"></span>
            </div>
          </div>
          <select
            name="  "
            required
            style={{ marginTop: 10 }}
            onChange={(e) => {
              setTestTime(e);
            }}
            defaultValue={test.time}
          >
            <option value="">Test Time</option>

            <option value="10">10 minutes</option>
            <option value="20">20 minutes</option>
            <option value="30">30 minutes</option>
            <option value="30">40 minutes</option>
            <option value="45">45 minutes</option>
            <option value="60">60 minutes</option>
            <option value="90">90 minutes</option>
            <option value="120">120 minutes</option>
            <option value="180">180 minutes</option>
            <option value="180">240 minutes</option>
          </select>
          <select
            required
            name="class"
            onChange={(e) => {
              setTestClass(e);
            }}
            defaultValue={test.class_id}
          >
            <option value="">Select Class</option>
            {classes.map((x) => {
              return (
                <option value={x.id} key={x.id}>
                  {x.name}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="pd-15">
        {questions.map((x, i) => (
          <div
            key={x.id}
            className={`${x.id} new-test ${
              errorFocus === x.id ? "missing" : ""
            }`}
            onClick={() =>
              setQFocusId({
                new: x.id,
                old: QFocusId.old ? QFocusId.old : null,
              })
            }
          >
            <div className="nhead">
              <DragIndicatorIcon
                className="dragIcon"
                style={{ fontSize: 24 }}
              />
            </div>
            <div className="flx-h sel-to">
              {test.class_id ? (
                <select
                  name="subject"
                  onChange={(e) => {
                    setQuestionSubject(e, x.id);
                  }}
                  defaultValue={x.subject_id}
                >
                  <option value="">Select Subject</option>
                  {subjects
                    .filter((sub) => sub.class_id === test.class_id)
                    .map((sub) => {
                      return (
                        <option value={sub.id} key={sub.id}>
                          {sub.name}
                        </option>
                      );
                    })}
                </select>
              ) : (
                ""
              )}
              {x.subject_id && test.class_id ? (
                <select
                  name="chapter"
                  onChange={(e) => {
                    setQuestionChapter(e, x.id);
                  }}
                  defaultValue={x.chapter_id}
                >
                  <option value="">Select Chapter</option>
                  {chapters
                    .filter((chap) => chap.subject_id === x.subject_id)
                    .map((chap) => {
                      return (
                        <option value={chap.id} key={chap.id}>
                          {chap.name}
                        </option>
                      );
                    })}
                </select>
              ) : (
                ""
              )}
              {x.chapter_id && x.subject_id && test.class_id ? (
                <select
                  name="topic"
                  onChange={(e) => {
                    setQuestionTopic(e, x.id);
                  }}
                  defaultValue={x.topic_id}
                >
                  <option value="">Select Topic</option>
                  {subtopics
                    .filter((top) => top.chapter_id === x.chapter_id)
                    .map((top) => {
                      return (
                        <option value={top.id} key={top.id}>
                          {top.name}
                        </option>
                      );
                    })}
                </select>
              ) : (
                ""
              )}
            </div>
            <div className="flx-h">
              <div style={{ position: "relative", width: "100%" }}>
                <textarea
                  type="text"
                  id={x.id}
                  onChange={(e) => setQuestionStatement(e, x.id)}
                  placeholder="Question"
                  className="effect-2"
                  defaultValue={x.statement}
                ></textarea>
                <span className="focus-border"></span>
              </div>
              <button
                className="img-h tr-btn"
                onClick={() => {
                  setUploadId({ id: x.id, type: 1 });
                  setShowFileModal(true);
                }}
              >
                <ImageOutlinedIcon style={{ fontSize: 24, color: "#666" }} />
              </button>
            </div>

            {x.imageUrl ? (
              <div className="pd-10">
                <button
                  className="circle-btn"
                  onClick={() => removeImage(x.id, 1)}
                >
                  <CloseOutlinedIcon />
                </button>
                <img src={x.imageUrl} className="question-img" />
              </div>
            ) : null}

            <div className="n0p">
              {options
                .filter((q) => q.question_id === x.id)
                .map((y, i) => (
                  <div key={y.id}>
                    <div className="n-options ml-n">
                      <button className="tr-btn sbtn">
                        <DragIndicatorIcon
                          className="dragIcon-1"
                          style={{ fontSize: 22 }}
                        />
                      </button>
                      <input
                        type="radio"
                        className="sel"
                        name={x.id}
                        value={y.id}
                        defaultChecked={
                          x.correct_option_id === y.id ? "checked" : ""
                        }
                      />
                      <div
                        className="i-b"
                        style={{
                          width: "100%",
                          position: "relative",
                        }}
                      >
                        <textarea
                          className="o-in effect-2"
                          type="text"
                          name={x.id}
                          id={y.id}
                          onBlur={() => checkEmpty(y.id, i)}
                          defaultValue={
                            y.statement.slice(" ").length
                              ? y.statement
                              : `Option ${i + 1}`
                          }
                          onClick={(e) => e.target.select()}
                          onChange={(e) => setOptionStatement(e, y.id)}
                        ></textarea>

                        <span className="focus-border"></span>
                      </div>
                      <button
                        onClick={() => {
                          setUploadId({ id: y.id, type: 2 });
                          setShowFileModal(true);
                        }}
                        className="img-h hid-img tr-btn"
                      >
                        <ImageOutlinedIcon
                          style={{ fontSize: 24, color: "#666" }}
                        />
                      </button>
                      <button
                        onClick={() => removeOption(y.id)}
                        className="img-h ext tr-btn"
                      >
                        <CloseOutlinedIcon
                          style={{ fontSize: 24, color: "#ccc" }}
                        />
                      </button>
                    </div>
                    <div className="img-cover">
                      {y.imageUrl ? (
                        <div style={{ marginTop: 10 }}>
                          <button
                            className="circle-btn sm-btn"
                            onClick={() => removeImage(y.id, 2)}
                          >
                            <CloseOutlinedIcon />
                          </button>
                          <img src={y.imageUrl} className="option-img" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}

              <div className="n-options">
                <input type="radio" className="sel" disabled />
                <div style={{ width: "80px", position: "relative" }}>
                  <input
                    className="small-in effect-2"
                    placeholder="Add option"
                    type="text"
                    onClick={() => addOption(x.id)}
                  />
                  <span className="focus-border"></span>
                </div>
              </div>
            </div>
            <div className="q-footer" style={{ paddingBottom: 0 }}>
              <div className="flx-h" style={{ width: "100%" }}>
                <div style={{ position: "relative", width: "100%" }}>
                  <textarea
                    type="text"
                    onChange={(e) => setQuestionSolution(e, x.id)}
                    placeholder="Solution"
                    className="effect-2"
                    defaultValue={x.solution}
                  ></textarea>
                  <span className="focus-border"></span>
                </div>
                <button
                  className="img-h tr-btn"
                  onClick={() => {
                    setUploadId({ id: x.id, type: 3 });
                    setShowFileModal(true);
                  }}
                >
                  <ImageOutlinedIcon style={{ fontSize: 24, color: "#666" }} />
                </button>
              </div>
            </div>
            {x.solutionImageUrl ? (
              <div className="pd-10">
                <button
                  className="circle-btn"
                  onClick={() => removeImage(x.id, 3)}
                >
                  <CloseOutlinedIcon />
                </button>
                <img src={x.solutionImageUrl} className="question-img" />
              </div>
            ) : null}
            <div className="q-footer" style={{ marginTop: 0 }}>
              <div style={{ width: "100%" }}></div>
              <div className="footer-menu">
                <button
                  className="tr-btn"
                  title="Duplicate"
                  onClick={() => {
                    duplicate(x);
                  }}
                >
                  <ContentCopyIcon
                    style={{ fontSize: 24, color: "#666", marginRight: 10 }}
                  />
                </button>
                <button
                  onClick={() => deleteQuestion(x.id)}
                  className="tr-btn"
                  title="Delete"
                >
                  <DeleteOutlineOutlinedIcon
                    style={{ fontSize: 24, color: "#666", marginRight: 10 }}
                  />
                </button>
              </div>
            </div>
          </div>
        ))}
        <button className="addQuestion" onClick={() => addQuestion()}>
          <AddCircleOutlineOutlinedIcon
            style={{ fontSize: 24, color: "#666", marginRight: 10 }}
          />
          <div>Add Question</div>
        </button>
      </div>
    </div>
  );
}

export default Tests;
