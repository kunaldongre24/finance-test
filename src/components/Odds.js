import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../style/odds.css";
import axios from "axios";
function App() {
  const { matchId } = useParams();
  const [matchOdds, setMatchOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  async function getOddsList() {
    try {
      const response = await axios.get(
        `http://172.105.35.224:3000/getbm2?eventId=${matchId}`
      );
      console.log(response.data);
      setMatchOdds(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getOddsList();
  }, []);
  if (loading) {
    return <div></div>;
  }
  return (
    <div className="body-content no-padding">
      <div className="scoreboard">
        <div className="score">
          <div className="score-cnt">
            <div>England - 0/0(0.0)</div>
            <div>India - 0/0(0.0)</div>
          </div>
        </div>
        <div className="live-run"></div>
        <div className="refresh-btn"></div>
      </div>
      <div className="pr-box">
        <div className="prbox-header">
          Market : Min : 100.0 | Max : 200000.0
        </div>
        <div className="prbox-body">
          <table>
            <thead>
              <tr>
                <th>RUNNER</th>
                <th>LAGAI</th>
                <th>KHAI</th>
                <th>POSITION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alfreds Futterkiste</td>
                <td>88.00</td>
                <td>90.00</td>
                <td>0.0</td>
              </tr>
              <tr>
                <td>Centro comercial Moctezuma</td>
                <td>0.00</td>
                <td>0.00</td>
                <td>0.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="pr-box">
        <div className="prbox-header">
          Market : Min : 100.0 | Max : 200000.0
        </div>
        <div className="prbox-body g-toss">
          <table>
            <thead>
              <tr>
                <th>RUNNER</th>
                <th>LAGAI</th>
                <th>KHAI</th>
                <th>POSITION</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Alfreds Futterkiste</td>
                <td>00.95</td>
                <td></td>
                <td>0.0</td>
              </tr>
              <tr>
                <td>Centro comercial Moctezuma</td>
                <td>00.95</td>
                <td></td>
                <td>0.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="pr-box">
        <div className="prbox-header">
          Market : Min : 100.0 | Max : 200000.0
        </div>
        <div className="prbox-body odds-table">
          <table>
            <thead>
              <tr>
                <th>SESSION</th>
                <th>NO</th>
                <th style={{ background: "#e9e9e9", color: "#444" }}>YES</th>
              </tr>
            </thead>
            <tbody>
              {matchOdds.t3
                .sort((a, b) => {
                  return a.sid - b.sid;
                })
                .map((odd) => {
                  const yRate = (
                    Math.round((odd.bs1 / 100) * 100) / 100
                  ).toFixed(2);
                  const nRate = (
                    Math.round((odd.ls1 / 100) * 100) / 100
                  ).toFixed(2);
                  const lay = odd.l1;
                  const back = odd.b1;
                  return (
                    <tr>
                      <td>{odd.nat}</td>
                      <td class="pd-10">
                        <div class="bold-num">{parseFloat(lay)}</div>
                        <div className="small">{nRate}</div>
                      </td>
                      <td class="pd-10 or-clr">
                        <div class="bold-num">{parseFloat(back)}</div>
                        <div className="small">{yRate}</div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
