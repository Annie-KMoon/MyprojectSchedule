const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// 📌 [임시 데이터베이스] 서버를 끄면 사라지지만, 테스트용으로 딱입니다!
let schedules = [
  { id: 1, title: "서버 연결 성공 기념 파티", start: "2026-01-28T18:00" },
];

// ✅ 1. 전체 일정 조회 (GET)
app.get("/api/schedules", (req, res) => {
  res.json(schedules);
});

// ✅ 2. 일정 추가 (POST)
app.post("/api/schedules", (req, res) => {
  const newSchedule = { id: Date.now(), ...req.body };
  schedules.push(newSchedule);
  res.status(201).json(newSchedule);
});

// ✅ 3. 일정 수정 (PUT)
app.put("/api/schedules/:id", (req, res) => {
  const { id } = req.params;
  schedules = schedules.map((s) => (s.id == id ? { ...s, ...req.body } : s));
  res.json({ message: "수정 완료" });
});

// ✅ 4. 일정 삭제 (DELETE)
app.delete("/api/schedules/:id", (req, res) => {
  const { id } = req.params;
  schedules = schedules.filter((s) => s.id != id);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 돌아가고 있어요!`);
});
