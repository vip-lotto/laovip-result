import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

import banner from "./assets/ad1.jpg";
import ad2 from "./assets/ad2.png";
import ad3 from "./assets/ad3.png";
import ad4 from "./assets/ad4.png";
import ad5 from "./assets/ad5.png";

import "./App.css";

const laoMonths = [
  "ມັງກອນ",
  "ກຸມພາ",
  "ມີນາ",
  "ເມສາ",
  "ພຶດສະພາ",
  "ມິຖຸນາ",
  "ກໍລະກົດ",
  "ສິງຫາ",
  "ກັນຍາ",
  "ຕຸລາ",
  "ພະຈິກ",
  "ທັນວາ"
];

function formatLaoDate(dateString) {
  if (!dateString) return "";

  const [year, month, day] = dateString.split("-");

  return `${parseInt(day)} ${laoMonths[parseInt(month) - 1]} ${year}`;
}


function App() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [displayNumber, setDisplayNumber] = useState("00000");
  const [showTable, setShowTable] = useState(true);

  useEffect(() => {
    loadData();

    const refresh = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(refresh);
  }, []);

  useEffect(() => {
    if (!result) return;

    const now = new Date();

    const startTime = result.start_time
      ? new Date(result.start_time)
      : null;

    const stopTime = result.stop_time
      ? new Date(result.stop_time)
      : null;

    if (
      startTime &&
      stopTime &&
      now >= startTime &&
      now < stopTime
    ) {
      const spin = setInterval(() => {
        let random = "";

        for (let i = 0; i < 5; i++) {
          random += Math.floor(Math.random() * 10);
        }

        setDisplayNumber(random);
      }, 80);

      return () => clearInterval(spin);
    }

    if (!startTime || !stopTime) {
  setDisplayNumber("00000");
  return;
}

if (now < startTime) {
  setDisplayNumber("00000");
  return;
}

if (now >= stopTime) {

  setDisplayNumber(result.number5);

  

  return;
}
  }, [result]);

  async function loadData() {
    const { data } = await supabase
      .from("results")
      .select("*")
      .order("updated_at", { ascending: false });

    if (data && data.length > 0) {
  setResult(data[0]);

  const now = new Date();

  const finishedResults = data.filter((item) => {
  if (!item.stop_time) return false;

  const stopTime = new Date(item.stop_time);

  const tomorrow = new Date(stopTime);
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  return now >= tomorrow;
});

finishedResults.sort((a, b) => {
  const dateA = new Date(`${a.draw_date} ${a.draw_time}`);
  const dateB = new Date(`${b.draw_date} ${b.draw_time}`);

  return dateB - dateA;
});

setHistory(finishedResults.slice(0, 10));
  }
}

  let number5 = "00000";
let number4 = "0000";
let number3 = "000";
let top2 = "00";
let bottom2 = "00";

if (result) {
  const now = new Date();
  const stopTime = result.stop_time
    ? new Date(result.stop_time)
    : null;

  if (stopTime && now >= stopTime) {
    number5 = result.number5;
    number4 = result.number5.slice(-4);
    number3 = result.number5.slice(-3);
    top2 = result.number5.slice(-2);
    bottom2 = result.number5.slice(0, 2);
  }
}

  return (
    <div className="page">

      <img
        src={banner}
        alt=""
        className="banner"
      />

      <div className="main">

        <div className="content">

          {result && (
            <>
              <div className="top-box">

                
                  <h2>
  ງວດປະຈຳວັນທີ່ {formatLaoDate(result.draw_date)}

                </h2>

                <div className="big-number">
                  {displayNumber}
                </div>

                <h3>
                  ອອກຜົນລາງວັນ {result.draw_time}
                </h3>

              </div>

              {showTable && (
<table className="result-table">
  <tbody>

                  <tr>
  <td>ເລກ 5 ໂຕ</td>
  <td>{number5}</td>
</tr>

<tr>
  <td>ເລກ 4 ໂຕ</td>
  <td>{number4}</td>
</tr>

<tr>
  <td>ເລກ 3 ໂຕ</td>
  <td>{number3}</td>
</tr>

<tr>
  <td>ເລກ 2 ໂຕເທິ່ງ</td>
  <td>{top2}</td>
</tr>

<tr>
  <td>ເລກ 2 ຕົວລຸ່ມ</td>
  <td>{bottom2}</td>
</tr>

                </tbody>
              </table>
              )}
            </>
          )}

          <h2 className="history-title">
            ຜົນການອອກເລກລາງວັນ
          </h2>

          <table className="history-table">

            <thead>
  <tr>
    <th>ງວດວັນທີ່</th>
    <th>ເລກ 5 ໂຕ</th>
    <th>ເລກ 4 ໂຕ</th>
    <th>ເລກ 3 ໂຕ</th>
    <th>ເລກ 2 ໂຕເທິ່ງ</th>
    <th>ເລກ 2 ຕົວລຸ່ມ</th>
  </tr>
</thead>

            <tbody>

              {history.map((item) => (
          <tr key={item.id}>
  <td>{formatLaoDate(item.draw_date)}</td>
  <td>{item.number5}</td>
  <td>{item.number5?.slice(-4)}</td>
  <td>{item.number5?.slice(-3)}</td>
  <td>{item.number5?.slice(-2)}</td>
  <td>{item.number5?.slice(0, 2)}</td>
</tr>
              ))}

            </tbody>

          </table>

        </div>

        <div className="sidebar">

          <img src={ad2} alt="" />
          <img src={ad3} alt="" />
          <img src={ad4} alt="" />
          <img src={ad5} alt="" />

        </div>

      </div>

      <footer>
        Copyright 2026 © ລາວວີໄອພີ (Lao VIP) 26.06.01 LV.06
      </footer>

    </div>
  );
}

export default App;