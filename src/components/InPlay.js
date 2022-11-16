import React, { useState, useEffect } from "react";
import "../style/inPlay.css";
import { Link } from "react-router-dom";
import axios from "axios";

function InPlay() {
  const [currentTab, setCurrentTab] = useState(0);
  const [matchList, setMatchList] = useState([]);
  const [matchInfo, setMatchInfo] = useState([]);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    var strTime = hours + ":" + minutes + " " + ampm;
    return strTime;
  }
  // {matchOdds.t3.map((odd) => {
  //   return (
  //     <tr>
  //       <td>{odd.nat}</td>
  //       <td>
  //         <div>{odd.l1}</div>
  //         <div className="small">{odd.ls1}</div>
  //       </td>
  //       <td>
  //         <div>{odd.b1}</div>
  //         <div className="small">{odd.bs1}</div>
  //       </td>
  //     </tr>
  //   );
  // })}
  async function getMatchData() {
    try {
      const response = await axios.get(
        "http://marketsarket.in:3000/getcricketmatches"
      );
      setMatchList(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getMatchData();
  }, []);
  String.prototype.allReplace = function (obj) {
    var retStr = this;
    for (var x in obj) {
      retStr = retStr.replace(new RegExp(x, "g"), obj[x]);
    }
    return retStr;
  };
  return (
    <div>
      <div className="body-content">
        <div id="tabs">
          <ul>
            <li class={`${currentTab === 0 ? "ui-tabs-active" : null}`}>
              <a onClick={() => setCurrentTab(0)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40">
                  <path d="m24.417 23.708-4.334 4.334q-.458.458-1.104.458-.646 0-1.104-.458L3.792 13.958q-.459-.458-.459-1.02 0-.563.459-1.021l4.333-4.334q.417-.458 1.083-.541.667-.084 1.125.375L24.417 21.5q.458.458.458 1.125t-.458 1.083ZM19 25.25l2.625-2.625L9.292 10.292l-2.625 2.625Zm11.125 10.292-6.25-6.25 2-2 6.292 6.291q.416.417.395.979-.02.563-.437 1.021-.375.375-.979.375t-1.021-.416Zm1-21.084q-2.333 0-3.937-1.625-1.605-1.625-1.605-3.958t1.605-3.937q1.604-1.605 3.937-1.605 2.333 0 3.958 1.605 1.625 1.604 1.625 3.937 0 2.333-1.625 3.958t-3.958 1.625Zm0-2.791q1.167 0 1.979-.813.813-.812.813-1.979 0-1.125-.813-1.937-.812-.813-1.979-.813-1.125 0-1.937.813-.813.812-.813 1.937 0 1.167.813 1.979.812.813 1.937.813Zm0-2.792Zm-17 8.917Z" />
                </svg>
                <span>Cricket</span>
              </a>
            </li>
            <li class={`${currentTab === 1 ? "ui-tabs-active" : null}`}>
              <a onClick={() => setCurrentTab(1)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40">
                  <path d="M20 36.667q-3.417 0-6.458-1.313-3.042-1.312-5.313-3.583t-3.583-5.313Q3.333 23.417 3.333 20q0-3.458 1.313-6.479Q5.958 10.5 8.229 8.229t5.313-3.583Q16.583 3.333 20 3.333q3.458 0 6.479 1.313 3.021 1.312 5.292 3.583t3.583 5.292q1.313 3.021 1.313 6.479 0 3.417-1.313 6.458-1.312 3.042-3.583 5.313t-5.292 3.583Q23.458 36.667 20 36.667Zm8.458-20.625 2.667-.917.75-2.542q-1.417-2.125-3.417-3.645-2-1.521-4.5-2.313l-2.583 1.708v2.709Zm-16.916 0 7.083-5V8.333l-2.542-1.708q-2.5.792-4.521 2.313-2.02 1.52-3.395 3.645L9 15.125ZM9.458 29.208l2.334-.25 1.5-2.583-2.542-7.708L8 17.708l-1.875 1.5q0 2.917.687 5.313.688 2.396 2.646 4.687ZM20 33.875q1.125 0 2.229-.187 1.104-.188 2.271-.521l1.292-2.834-1.25-2.125h-9.084l-1.25 2.125 1.334 2.834q1.041.333 2.187.521 1.146.187 2.271.187Zm-4.208-8.458h8.291l2.459-7.292L20 13.458l-6.625 4.667Zm14.75 3.791q1.958-2.291 2.646-4.687.687-2.396.687-5.313L32 17.917l-2.708.75-2.542 7.708 1.458 2.583Z" />
                </svg>
                <span>Football</span>
              </a>
            </li>
            <li class={`${currentTab === 2 ? "ui-tabs-active" : null}`}>
              <a onClick={() => setCurrentTab(2)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="40" width="40">
                  <path d="m5.333 33.375-2-2 7.125-7.083q1.334-1.375 1.875-3.396.542-2.021.542-5.813 0-2.375 1.063-4.687Q15 8.083 17.083 6q3.709-3.708 8.146-4.208 4.438-.5 7.313 2.416 2.916 2.875 2.416 7.355-.5 4.479-4.208 8.145-2.083 2.084-4.396 3.125-2.312 1.042-4.687 1.042-3.834 0-5.855.5-2.02.5-3.395 1.875ZM17.208 19.5q2 2 5.438 1.479 3.437-.521 6.187-3.229 2.75-2.75 3.292-6.146.542-3.396-1.5-5.396-2-2.041-5.396-1.52-3.396.52-6.187 3.27-2.709 2.75-3.271 6.146-.563 3.396 1.437 5.396Zm13.25 18.833q-2.583 0-4.416-1.812-1.834-1.813-1.834-4.396t1.834-4.417q1.833-1.833 4.416-1.833 2.584 0 4.396 1.833 1.813 1.834 1.813 4.417 0 2.583-1.813 4.396-1.812 1.812-4.396 1.812Zm0-2.791q1.459 0 2.438-.98.979-.979.979-2.437 0-1.458-.979-2.458-.979-1-2.438-1-1.458 0-2.458 1-1 1-1 2.458 0 1.458 1 2.437 1 .98 2.458.98Zm0-3.417Z" />
                </svg>
                <span>Tennis</span>
              </a>
            </li>
          </ul>
          {currentTab === 0 ? (
            <div id="tabs-1">
              <div class="cnt-tab">
                {matchList
                  .filter((x) => x.back11 || x.lay11)
                  .map((x) => {
                    const matchName = x.eventName.split("/")[0];
                    const timestamp = new Date(
                      x.eventName
                        .split("/")[1]
                        .allReplace({ PM: " PM", AM: " AM" })
                    );
                    const day = timestamp.getDate();
                    const month = timestamp.getMonth();
                    const time = timestamp;
                    return (
                      <Link
                        to={`/odds/${x.gameId}`}
                        class="c-card"
                        key={x.gameId}
                      >
                        <div class="c-date">
                          <div class="c-day">{day > 9 ? day : `0${day}`}</div>
                          <div class="c-month">{months[month]}</div>
                          <div class="c-time">{formatAMPM(new Date(time))}</div>
                        </div>
                        <div class="c-main">
                          <p class="card-heading">{matchName}</p>
                          <p class="mt-7 card-text"></p>
                          <p class="card-text">Match Bets 0</p>
                          <p class="card-text">Session Bets 0</p>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default InPlay;
