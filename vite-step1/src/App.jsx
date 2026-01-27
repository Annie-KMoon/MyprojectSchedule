// src/components/App.jsx
import "bootstrap/dist/css/bootstrap.min.css"
import { Route, Routes } from "react-router-dom"
import CalendarPage from "./pages/CalendarPage"
import { useEffect,useState } from "react"
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddEventModal from "./components/AddEventModal";
import { initializeApp } from "firebase/app";
import {
getFirestore,
collection,
addDoc,
doc,
updateDoc,
deleteDoc,
onSnapshot,
query,
orderBy,
serverTimestamp,
} from "firebase/firestore";
import app from "../../service/firebase";

function App() {

  //더미데이터로 출력 확인(가이드라인 코드 참고)
  const [events, setEvents] = useState([
/*     {
    id: "1", 
    title: "1주차: 달력 출력",
    start: "2026-01-14T10:00:00",
    end: "2026-01-14T11:00:00",
    memo: "줌 링크...",
    color: "#3b82f6" 
    },
    {
    id: "2", 
    title: "2주차: CRUD",
    start: "2026-01-23",
    end: "2026-01-24",
    memo: "줌 링크...",
    color: "#33a588" 
    },
        {
    id: "3", 
    title: "3주차: CRUD",
    start: "2026-01-27",
    end: "2026-01-28",
    memo: "줌 링크...",
    color: "#f6a53b" 
    }
  ]) */
//모달 열림|닫힘 상태 처리
const [isModalOpen, setIsModalOpen] = useState(false) 

//새로 입력할 일정의 초기값(데이터 모델 설계 참고)
const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    memo: "",
    color: ""
})
// 날짜 클릭 시 모달창 열기
  const handleDateClick = (info) => {
    // 클릭한 날짜를 시작/종료 시간의 기본값으로 세팅
    setNewEvent({ 
      ...newEvent, 
      title: "",
      start: info.dateStr + "T09:00",  
      end: info.dateStr + "T09:00" 
    });
    setIsModalOpen(true); // 모달 열기 
  };

// 모달창 닫기
  const handleClose = () =>{
    setIsModalOpen(false); // 모달창 닫기
    setSelectedEventId(null);
    setNewEvent({// 신규 이벤트 배열 초기화
    title: "",
    start: "",
    end: "",
    memo: "",
    color: "#c7daf8"
    });
  }

 // 저장 버튼 클릭 시 실행 함수
  const handleSave = () => {
    //빈 일정이 저장되지 않도록 입력 검증 if문
    if (!newEvent.title) 
      return alert("제목을 꼭 입력해주세요!"); //alert
    
    //1. 데이터 수정: selectedEventId가 있을 때
    if (selectedEventId) {
      const updatedEvents = events.map ((e) =>
        e.id ===selectedEventId ? { ...newEvent, id: selectedEventId} : e
      );
      setEvents(updatedEvents);
      alert("일정이 수정되었습니다.");
    }

    //2. 신규 등록 : selectedEventId=null일 때
    else{
      const saveEvent = {
      ...newEvent,
      id: crypto.randomUUID() // 수정/삭제를 위한 고유 ID 부여
    };
    setEvents([...events, saveEvent]); // 배열 업데이트 
    alert("일정이 저장되었습니다!"); //alert창으로 저장 피드백
  }
  //모달창 닫고 상태 초기화
  handleClose();
  };

//생성된 이벤트 클릭시 상세 일정 보기
// 선택된 이벤트 아이디 선언
const [selectedEventId, setSelectedEventId] = useState(null);
// 일정을 클릭했을 때 실행될 함수 구현
const handleEventClick = (clickInfo) => {//clickinfo: 클릭된 일정 정보
  const clickedEvent = events.find((e) => e.id === clickInfo.event.id);
  if (clickedEvent) {//선택된 이벤트가 있다면
    setNewEvent({ //새로운 일정 입력 폼에 클릭한 일정 정보를 채워넣기
      title: clickedEvent.title,
      start: clickedEvent.start,
      end: clickedEvent.end || clickedEvent.start, // 종료일 없으면 시작일로(or)
      memo: clickedEvent.memo || "", //메모내용 없을 때 공란(or)
      color: clickedEvent.color,
    });
    //현재 어떤 이벤트를 수정 중인지 Id를 저장해두기
    setSelectedEventId(clickedEvent.id);
    //세팅된 데이터를 모달창을 띄워 보여주기
    setIsModalOpen(true);
  }
};

//이벤트 삭제 함수
const handleDelete= () =>{
  if(window.confirm("일정을 삭제하시겠습니까?")){
    //filter메서드를 사용하여 selectedEventId를 제외한 나머지 배열로 새로운 배열을 만든다.
    const filteredEvents = events.filter((e)=>e.id !==selectedEventId);
    setEvents(filteredEvents);
    alert("일정이 삭제되었습니다.");
    //모달창 닫고 상태 초기화
    handleClose();
  }
};

  return (
<div className="d-flex flex-column min-vh-100">
      {/* 상단 헤더 */}
      <Header />
      {/* 중앙 메인 콘텐츠 (달력) */}
      <main className="flex-fill container">
        <div className="container py-4">
              {/* 달력 페이지 호출 (events와 클릭 함수 전달) */}
              <CalendarPage events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />
              {/* 모달 컴포넌트 배치 */}
              <AddEventModal 
                isOpen={isModalOpen} 
                onClose={handleClose} 
                newEvent={newEvent}
                setNewEvent={setNewEvent}
                onSave ={handleSave}
                isEditMode = {!!selectedEventId}//selectedEventId가 존재하면 true, 없으면 false(boolean)
                onDelete = {handleDelete}
              />
            </div>
      </main>
      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};
 
export default App




/* 
const db = getFirestore(app);
const COLLECTION = "schedules"; // 🔥 localStorage KEY 대신 Firestore 컬렉션 이름
const [events, setEvents] = useState([]);
// ✅ 1) Firestore에서 불러오기(실시간 구독)
useEffect(() => {
const q = query(collection(db, COLLECTION), orderBy("SCHEDULE_START", "asc"));
const unsub = onSnapshot(q, (snap) => {
const rows = snap.docs.map((d) => {
const data = d.data();
return {
id: d.id, // Firestore 문서 id
title: data.SCHEDULE_TITLE,
start: data.SCHEDULE_START,
end: data.SCHEDULE_END,
category: data.SCHEDULE_STATUS,
content: data.SCHEDULE_CONTENT,
color: data.COLOR,
};
});
setEvents(rows); // ✅ localStorage setEvents(JSON.parse(saved)) 역할
});
return () => unsub(); // ✅ 구독 해제
}, []);
// ✅ 2) Firestore에 저장(생성)
const createEvent = async (event) => {
// localStorage의 setItem 역할이 아니라 "DB에 INSERT" 개념
await addDoc(collection(db, COLLECTION), {
SCHEDULE_TITLE: event.title,
SCHEDULE_START: event.start, // ISO 문자열 추천
SCHEDULE_END: event.end,
SCHEDULE_STATUS: event.category || "",
SCHEDULE_CONTENT: event.content || "",
COLOR: event.color || "#c7daf8",
createdAt: serverTimestamp(),
updatedAt: serverTimestamp(),
});
};
// ✅ 3) Firestore 수정(UPDATE)
const updateEvent = async (id, patch) => {
await updateDoc(doc(db, COLLECTION, id), {
...(patch.title !== undefined && { SCHEDULE_TITLE: patch.title }),
...(patch.start !== undefined && { SCHEDULE_START: patch.start }),
...(patch.end !== undefined && { SCHEDULE_END: patch.end }),
...(patch.category !== undefined && { SCHEDULE_STATUS: patch.category }),
...(patch.content !== undefined && { SCHEDULE_CONTENT: patch.content }),
...(patch.color !== undefined && { COLOR: patch.color }),
updatedAt: serverTimestamp(),
});
};
// ✅ 4) Firestore 삭제(DELETE)
const deleteEventById = async (id) => {
await deleteDoc(doc(db, COLLECTION, id));
};
 */