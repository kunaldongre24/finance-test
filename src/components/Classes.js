//Kunal Dongre
import React, { useState, useEffect } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";
import Spinner from "../components/Spinner";

function Classes() {
  const [classes, setClasses] = useState([]);
  const [edit, setEdit] = useState();
  const [loading, setLoading] = useState(true);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    fetchClasses();
    if (!document.getElementById("class").value) {
      document.addEventListener("DOMContentLoaded", function (event) {
        document.getElementById("button").disabled = true;
      });
    }
    return () => {
      setClasses([]);
      document.addEventListener("DOMContentLoaded", function (event) {
        document.getElementById("button").disabled = false;
      });
    };
  }, []);
  useEffect(() => {
    fetchClasses();
  }, []);
  const fetchClasses = async () => {
    const subjectData = await getDocs(collection(db, "classes"));
    setClasses(subjectData.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };
  const uploadData = (name) => {
    setLoader(true);
    addDoc(collection(db, "classes"), {
      name: name,
      created_on: Date.now(),
      last_update: Date.now(),
    }).catch((err) => console.error(err));
    document.getElementById("class").value = "";
    fetchClasses();
    setLoader(false);
  };
  const handleUpload = (e) => {
    e.preventDefault();
    const subjectName = e.target.class.value;
    if (!subjectName || subjectName === "") {
      return;
    } else {
      const res = uploadData(subjectName);
      if (res && !loader) {
        document.getElementById("class").value = "";
        fetchClasses();
      }
    }
  };
  const checkName = (e) => {
    const name = e.target.value;
    const input = document.getElementById("class");
    const button = document.getElementById("button");

    if (classes.filter((x) => x.name === name).length) {
      input.style.borderColor = "red";
      button.disabled = true;
    } else {
      input.style.borderColor = "#888";
      button.disabled = false;
    }
  };
  const deleteData = async (id) => {
    let request = await deleteDoc(doc(db, "classes", id));
    fetchClasses();
  };
  return (
    <div className="pd-15">
      <h2 className="heading">Create new class</h2>
      <form className="container-x" onSubmit={handleUpload}>
        <input
          type="text"
          placeholder={"Enter class name..."}
          className="input"
          autoComplete="off"
          name="class"
          id="class"
          onChange={checkName}
        />

        <button className="create" type="submit" id="button" disabled>
          Create New Class
        </button>
      </form>
      {loading ? (
        <Spinner color="#222" style={{ marginTop: 20 }} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Sr no.</th>
              <th>Class Name</th>
              <th colSpan={2} className="edit-head">
                Edit
              </th>
            </tr>
          </thead>
          <tbody>
            {classes.map((class_, i) => {
              return (
                <tr key={class_.id}>
                  <td className="serial">{i + 1}</td>
                  <td>{class_.name}</td>
                  <td className="edit">
                    <button type="button" onClick={() => setEdit(class_.id)}>
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
                    </button>
                  </td>
                  <td className="edit delete">
                    <button onClick={() => deleteData(class_.id)} type="button">
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

export default Classes;
