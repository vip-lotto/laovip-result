import { useState } from "react";
import { supabase } from "../lib/supabase";
import "./Admin.css";

function Admin() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("admin_login") === "true"
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [form, setForm] = useState({
  draw_date: "",
  draw_time: "",
  start_time: "",
  stop_time: "",
  number5: "",
});
  function login() {
    if (username === "admin" && password === "123456") {
      localStorage.setItem("admin_login", "true");
      setLoggedIn(true);
    } else {
      alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  }

  function logout() {
    localStorage.removeItem("admin_login");
    window.location.reload();
  }

  async function saveResult() {

  if (form.number5.length !== 5) {
    alert("กรุณากรอกเลข 5 หลัก");
    return;
  }

  const { error } = await supabase
    .from("results")
    .insert([{
      draw_date: form.draw_date,
      draw_time: form.draw_time,
      start_time: form.start_time,
      stop_time: form.stop_time,
      number5: form.number5
    }]);

    if (error) {
      alert(error.message);
      return;
    }

    alert("บันทึกผลหวยสำเร็จ");

    setForm({
  draw_date: "",
  draw_time: "",
  start_time: "",
  stop_time: "",
  number5: "",
});
  }

  if (!loggedIn) {
    return (
      <div className="admin-panel">
        <h1 className="admin-title">
          ADMIN LOGIN
        </h1>

        <input
          className="admin-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          className="admin-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button
          className="admin-btn save-btn"
          onClick={login}
        >
          🔐 Login
        </button>
      </div>
    );
  }

  return (
    <div className="admin-panel">

      <h1 className="admin-title">
        ADMIN LAO-VIP
      </h1>

      <label>วันที่ออกผล</label>

      <input
        className="admin-input"
        type="date"
        value={form.draw_date}
        onChange={(e) =>
          setForm({
            ...form,
            draw_date: e.target.value,
          })
        }
      />

      <label>เวลาออกผล</label>

      <input
        className="admin-input"
        type="time"
        value={form.draw_time}
        onChange={(e) =>
          setForm({
            ...form,
            draw_time: e.target.value,
          })
        }
      />

      <label>เวลาเริ่มหมุน</label>

      <input
        className="admin-input"
        type="datetime-local"
        value={form.start_time}
        onChange={(e) =>
          setForm({
            ...form,
            start_time: e.target.value,
          })
        }
      />

      <label>เวลาหยุดหมุน</label>

      <input
        className="admin-input"
        type="datetime-local"
        value={form.stop_time}
        onChange={(e) =>
          setForm({
            ...form,
            stop_time: e.target.value,
          })
        }
      />

      
      <input
  className="admin-input"
  placeholder="เลข 5 หลัก"
  maxLength={5}
  value={form.number5}
  onChange={(e) =>
    setForm({
      ...form,
      number5: e.target.value.replace(/\D/g, ""),
    })
  }
/>
      

      <button
        className="admin-btn save-btn"
        onClick={saveResult}
      >
        💾 บันทึกผลหวย
      </button>

      <button
        className="admin-btn logout-btn"
        onClick={logout}
      >
        🚪 ออกจากระบบ
      </button>

    </div>
  );
}

export default Admin;

