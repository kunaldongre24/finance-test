//Kunal Dongre

import React, { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  deleteDoc,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { db } from "../config/firebase";
import Spinner from "./Spinner";
import ArticleIcon from "@mui/icons-material/Article";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
function AvailableTests() {
  const [tests, setTests] = useState([]);
  const [did, setDid] = useState();
  const [loading, setLoading] = useState(true);
  const [testMenu, setTestMenu] = useState(0);
  const [renameId, setRenameId] = useState(0);
  const [deleteId, setDeleteId] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const month = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ];
  useEffect(() => {
    fetchTests();
  }, []);
  useEffect(() => {
    if (document.getElementById(testMenu + "tm")) {
      document.addEventListener("mouseup", function (e) {
        var container = document.getElementById(testMenu + "tm");
        if (container && !container.contains(e.target)) {
          setTestMenu(0);
        }
      });
    }
  }, [testMenu]);
  const updateName = (id) => {
    setRenaming(true);
    const name = document.getElementById(`id${id}`).value;
    const itemRef = doc(db, "tests", id);
    setDoc(itemRef, {
      name: name,
      last_update: Date.now(),
    });
    fetchTests();
    setRenameId(0);
  };

  const DeleteTest = async (id) => {
    setDeleting(true);
    let request = await deleteDoc(doc(db, "tests", id));
    const myCollection = collection(db, "questions");
    const mycollectionQuery = query(myCollection, where("test_id", "==", did));
    onSnapshot(mycollectionQuery, (myCollectionSnapshot) => {
      myCollectionSnapshot.forEach((doc) => {
        deleteDoc(doc(db, doc.ref));
      });
    });
    const options = collection(db, "options");
    const optionsQuery = query(options, where("test_id", "==", did));
    onSnapshot(optionsQuery, (optionsSnapshot) => {
      optionsSnapshot.forEach((doc) => {
        deleteDoc(doc(db, doc.ref));
      });
    });

    fetchTests();
    setDeleteId(0);
  };
  const fetchTests = async () => {
    const data = await getDocs(collection(db, "tests"));
    setTests(data.docs.map((doc) => ({ ...doc.data(), oid: doc.id })));
    setLoading(false);
    setRenaming(false);
    setDeleting(false);
    setShowRenameModal(false);
    setShowFileModal(false);
  };
  console.log(tests);
  if (loading) {
    return (
      <div className="centerSpin">
        <Spinner color="#222" />
      </div>
    );
  }
  return (
    <div className="pd-152 wt-bg">
      {showRenameModal ? (
        <div className="file-upload-modal" id="file-modal-body">
          <div className="file-modal-box">
            <div className="modal-box-header">Rename Test</div>
            <div className="modal-body">
              Please enter the new name for the test:
              <input
                id={`id${renameId}`}
                defaultValue={tests
                  .filter((x) => x.id === renameId)
                  .map((x) => x.name)}
                type="text"
                style={{
                  height: 35,
                  width: "100%",
                  marginTop: 10,
                  outline: "none",
                  border: "1px solid #0982fa",
                  cursor: "text",
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              />
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="upload-button"
                  style={{
                    width: 100,
                    background: "#fff",
                    border: "1px solid #0982fa",
                    marginRight: 10,
                    color: "#0982fa",
                  }}
                  onClick={(e) => {
                    setShowRenameModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="upload-button"
                  style={{ width: 100 }}
                  onClick={(e) => {
                    updateName(renameId);
                  }}
                >
                  {renaming ? <Spinner /> : "Rename"}{" "}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showFileModal ? (
        <div className="file-upload-modal" id="file-modal-body">
          <div className="file-modal-box">
            <div className="modal-box-header">Delete Test</div>
            <div className="modal-body">
              Are you sure you want to delete the Test?
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  className="upload-button"
                  style={{
                    width: 100,
                    background: "#fff",
                    border: "1px solid #0982fa",
                    marginRight: 10,
                    color: "#0982fa",
                  }}
                  onClick={(e) => {
                    setShowFileModal(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="upload-button"
                  style={{ width: 100, background: "#ff5c5c" }}
                  onClick={(e) => {
                    DeleteTest(deleteId);
                  }}
                >
                  {deleting ? <Spinner /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
      <div>All Tests</div>
      <div className="test-list">
        {tests
          .sort(function (a, b) {
            return b.last_update - a.last_update;
          })
          .map((test) => (
            <div key={test.id} className="ind-test">
              <div
                id={`${testMenu}tm`}
                className="test-menu"
                style={
                  testMenu === test.oid
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                <button
                  className="list-t tr-btn"
                  onClick={() => {
                    setRenameId(test.oid);
                    setShowRenameModal(true);
                    setTestMenu(0);
                  }}
                >
                  {" "}
                  <ModeEditIcon
                    style={{
                      marginRight: 15,
                      fontSize: 20,
                    }}
                  />
                  <span>Rename</span>
                </button>
                <button
                  className="list-t tr-btn"
                  onClick={() => {
                    setDid(test.id);
                    setDeleteId(test.oid);
                    setShowFileModal(true);
                    setTestMenu(0);
                  }}
                >
                  <DeleteOutlineIcon
                    style={{
                      marginRight: 15,
                      fontSize: 20,
                    }}
                  />
                  <span>Delete</span>
                </button>
              </div>
              <div className="headlist">
                {test.name ? test.name : "Untitled Test"}
                <button
                  className="tr-btn"
                  onClick={() => setTestMenu(test.oid)}
                >
                  <MoreHorizIcon
                    className="moreicon"
                    style={{
                      fontSize: 20,
                    }}
                  />
                </button>
              </div>
              <div className="flex-name">
                <ArticleIcon style={{ color: "#885BCE", marginRight: 5 }} />
                <div>
                  Updated{" "}
                  {new Date(test.last_update).getDate() +
                    " " +
                    month[new Date(test.last_update).getMonth()] +
                    " " +
                    new Date(test.last_update).getFullYear()}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export default AvailableTests;
