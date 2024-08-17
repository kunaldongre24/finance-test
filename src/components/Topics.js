//Kunal Dongre
import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  setDoc,
  addDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Spinner from "../components/Spinner";

function Topics() {
  const [classes, setClasses] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [editId, setEditId] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
    fetchChapters();
    fetchSubjects();
    fetchSubtopics();
    if (!document.getElementById("subtopic").value) {
      document.getElementById("button").disabled = "true";
    }
  }, []);
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
  const uploadData = async (name, chapterId, subjectId, classId) => {
    addDoc(collection(db, "topics"), {
      name: name,
      chapter_id: chapterId,
      subject_id: subjectId,
      class_id: classId,
      created_on: Date.now(),
      last_update: Date.now(),
    }).catch((err) => console.error(err));
    document.getElementById("subtopic").value = "";
    fetchSubtopics();
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const topicName = e.target.topic.value;
    const chapterId = e.target.chapter.value;
    const subjectId = e.target.subject.value;
    const classId = e.target.class.value;
    if (
      !topicName ||
      topicName === "" ||
      !subjectId ||
      !chapterId ||
      !classId ||
      !classId
    ) {
      return;
    } else {
      const res = await uploadData(topicName, chapterId, subjectId, classId);
      if (res) {
        document.getElementById("subtopic").value = "";
        fetchSubtopics();
      }
    }
  };
  const handleSubject = (e) => {
    const subject = e.target.value;
    const chapter = chapters.filter((x) => x.subject_id === subject);
    setFilteredChapters(chapter);
  };
  const handleClass = (e) => {
    const classInfo = e.target.value;
    const subject = subjects.filter((x) => x.class_id === classInfo);
    setFilteredSubjects(subject);
  };
  const checkName = () => {
    const name = document.getElementById("subtopic").value;
    const input = document.getElementById("subtopic");
    const button = document.getElementById("button");
    const subject = filteredSubjects.length
      ? document.getElementsByName("subject")[0].value
      : 0;
    const chapter = filteredChapters.length
      ? document.getElementsByName("chapter")[0].value
      : 0;
    if (
      subtopics.filter(
        (x) =>
          x.name.toLowerCase() === name.toLowerCase() &&
          x.subject_id === subject &&
          x.chapter_id === chapter
      ).length
    ) {
      input.style.borderColor = "red";
      button.disabled = true;
    } else {
      input.style.borderColor = "#888";
      button.disabled = false;
    }
  };
  const deleteData = async (id) => {
    let request = await deleteDoc(doc(db, "topics", id));
    fetchSubtopics();
  };
  const updateData = async (id) => {
    const name = document.getElementsByName(`topic-${id}`)[0].value;
    const subject = document.getElementsByName(`subject-${id}`)[0].value;
    const chapter = document.getElementsByName(`chapter-${id}`)[0].value;
    const itemRef = doc(db, "topics", id);
    setDoc(itemRef, {
      name: name,
      subject_id: subject,
      chapter_id: chapter,
      last_update: Date.now(),
    });
    setEditId();
    fetchSubtopics();
  };
  return (
    <div className="pd-15">
      <h2 className="heading">Create new subtopic</h2>
      <form className="container-x" onSubmit={handleUpload}>
        <input
          type="text"
          placeholder={"Enter topic name..."}
          className="input"
          name="topic"
          id="subtopic"
          onChange={checkName}
          autoComplete="off"
        />
        <select
          name="class"
          onChange={(e) => {
            handleClass(e);
            checkName();
          }}
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
        {filteredSubjects.length ? (
          <select
            name="subject"
            onChange={(e) => {
              handleSubject(e);
              checkName();
            }}
          >
            <option value="">Select Subject</option>
            {subjects.map((x) => {
              return (
                <option value={x.id} key={x.id}>
                  {x.name}
                </option>
              );
            })}
          </select>
        ) : (
          ""
        )}
        {filteredChapters.length ? (
          <select name="chapter" onChange={checkName}>
            <option value="">Select Chapter</option>
            {filteredChapters.map((x) => {
              return (
                <option value={x.id} key={x.id}>
                  {x.name}
                </option>
              );
            })}
          </select>
        ) : (
          ""
        )}
        <button className="create" id="button" disabled>
          Create New Topic
        </button>
      </form>
      {loading ? (
        <Spinner color="#222" style={{ marginTop: 20 }} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Topic Name</th>
              <th>Chapter Name</th>
              <th>Subject Name</th>
              <th>Class</th>
              <th colSpan={2} className="edit-head">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {subtopics.map((x, i) => {
              const edit = editId === x.id;
              return (
                <tr key={x.id}>
                  <td className="serial">{i + 1}</td>
                  <td>
                    {edit ? (
                      <input
                        type="text"
                        className="table-input"
                        name={`topic-${x.id}`}
                        defaultValue={x.name}
                      />
                    ) : (
                      x.name
                    )}
                  </td>
                  <td>
                    {edit ? (
                      <select
                        name={`chapter-${x.id}`}
                        defaultValue={x.chapter_id}
                      >
                        {chapters.map((chapter) => {
                          return (
                            <option value={chapter.id} key={chapter.id}>
                              {chapter.name}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      chapters
                        .filter((chapter) => chapter.id === x.chapter_id)
                        .map((data) => data.name)
                    )}
                  </td>
                  <td>
                    {edit ? (
                      <select
                        name={`subject-${x.id}`}
                        defaultValue={x.subject_id}
                      >
                        {subjects.map((subject) => {
                          return (
                            <option value={subject.id} key={subject.id}>
                              {subject.name}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      subjects
                        .filter((subject) => subject.id === x.subject_id)
                        .map((data) => data.name)
                    )}
                  </td>
                  <td>
                    {edit ? (
                      <select name={`class-${x.id}`} defaultValue={x.class_id}>
                        {classes.map((classInfo) => {
                          return (
                            <option value={classInfo.id} key={classInfo.id}>
                              {classInfo.name}
                            </option>
                          );
                        })}
                      </select>
                    ) : (
                      classes
                        .filter((classInfo) => classInfo.id === x.class_id)
                        .map((data) => data.name)
                    )}
                  </td>
                  <td className="edit">
                    <button
                      onClick={() =>
                        edit ? updateData(x.id) : setEditId(x.id)
                      }
                      type="button"
                    >
                      {edit ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="#fff"
                        >
                          <path d="M0 0h24v24H0V0z" fill="none" />
                          <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="#fff"
                        >
                          <path d="M0 0h24v24H0V0z" fill="none" />
                          <path d="M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z" />
                        </svg>
                      )}
                    </button>
                  </td>
                  <td className="edit delete">
                    <button
                      onClick={() => (edit ? setEditId() : deleteData(x.id))}
                      type="button"
                    >
                      {edit ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="#fff"
                        >
                          <path d="M0 0h24v24H0V0z" fill="none" />
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          fill="#fff"
                        >
                          <path d="M0 0h24v24H0V0z" fill="none" />
                          <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Topics;
