// src/components/App.jsx
import "bootstrap/dist/css/bootstrap.min.css"
import { Route, Routes } from "react-router-dom"
import CalendarPage from "./pages/CalendarPage"
import { useEffect, useState } from "react"
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddEventModal from "./components/AddEventModal";

// Firestore 관련 도구들 임포트
// 1. Firestore 조작에 필요한 기능들 가져오기
import {
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

import { db } from "./service/firebase";

// DB 객체 생성 및 컬렉션 이름 설정
const COLLECTION = "schedules"; 

function App() {

  // Firestore로부터 실시간으로 데이터를 받을 것이므로 빈 배열로 시작
  const [events, setEvents] = useState([])

  // 모달 열림|닫힘 상태 처리
  const [isModalOpen, setIsModalOpen] = useState(false) 

  // 새로 입력할 일정의 초기값
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    memo: "",
    color: ""
  })

  // ✅ 1) Firestore에서 불러오기(실시간 구독) - useEffect
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
          memo: data.SCHEDULE_CONTENT, // 기존 UI의 memo와 매칭
          color: data.COLOR,
        };
      });
      setEvents(rows); // 실시간으로 받은 데이터를 상태에 저장
    });
    return () => unsub(); // 구독 해제
  }, []);

  // 날짜 클릭 시 모달창 열기
  const handleDateClick = (info) => {
    setNewEvent({ 
      ...newEvent, 
      title: "",
      start: info.dateStr + "T09:00",  
      end: info.dateStr + "T09:00",
      memo: "", // 메모도 초기화
      color: "#c7daf8" // 기본 색상 설정
    });
    setIsModalOpen(true); 
  };

  // 모달창 닫기
  const handleClose = () =>{
    setIsModalOpen(false); 
    setSelectedEventId(null);
    setNewEvent({
      title: "",
      start: "",
      end: "",
      memo: "",
      color: "#c7daf8"
    });
  }

  // 저장 버튼 클릭 시 실행 함수 (async 추가)
  const handleSave = async () => {
    if (!newEvent.title) 
      return alert("제목을 꼭 입력해주세요!");
    
    // 1. 데이터 수정: selectedEventId가 있을 때 (updateDoc 사용)
    if (selectedEventId) {
      await updateDoc(doc(db, COLLECTION, selectedEventId), {
        SCHEDULE_TITLE: newEvent.title,
        SCHEDULE_START: newEvent.start,
        SCHEDULE_END: newEvent.end,
        SCHEDULE_CONTENT: newEvent.memo,
        COLOR: newEvent.color,
        updatedAt: serverTimestamp(),
      });
      alert("일정이 수정되었습니다.");
    }

    // 2. 신규 등록 : selectedEventId=null일 때 (addDoc 사용)
    else {
      await addDoc(collection(db, COLLECTION), {
        SCHEDULE_TITLE: newEvent.title,
        SCHEDULE_START: newEvent.start,
        SCHEDULE_END: newEvent.end,
        SCHEDULE_STATUS: "", // 필요 시 category 추가
        SCHEDULE_CONTENT: newEvent.memo,
        COLOR: newEvent.color || "#c7daf8",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      alert("일정이 저장되었습니다!");
    }
    handleClose();
  };

  const [selectedEventId, setSelectedEventId] = useState(null);

  const handleEventClick = (clickInfo) => {
    const clickedEvent = events.find((e) => e.id === clickInfo.event.id);
    if (clickedEvent) {
      setNewEvent({ 
        title: clickedEvent.title,
        start: clickedEvent.start,
        end: clickedEvent.end || clickedEvent.start,
        memo: clickedEvent.memo || "", 
        color: clickedEvent.color,
      });
      setSelectedEventId(clickedEvent.id);
      setIsModalOpen(true);
    }
  };

  // 이벤트 삭제 함수 (deleteDoc 사용)
  const handleDelete = async () => {
    if(window.confirm("일정을 삭제하시겠습니까?")){
      await deleteDoc(doc(db, COLLECTION, selectedEventId));
      alert("일정이 삭제되었습니다.");
      handleClose();
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      <main className="flex-fill container">
        <div className="container py-4">
          <CalendarPage events={events} onDateClick={handleDateClick} onEventClick={handleEventClick} />
          <AddEventModal 
            isOpen={isModalOpen} 
            onClose={handleClose} 
            newEvent={newEvent}
            setNewEvent={setNewEvent}
            onSave={handleSave}
            isEditMode={!!selectedEventId}
            onDelete={handleDelete}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App