// src/components/App.jsx
import "bootstrap/dist/css/bootstrap.min.css"
import { Route, Routes } from "react-router-dom"
import CalendarPage from "./pages/CalendarPage"
import { useState } from "react"
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddEventModal from "./components/AddEventModal";

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
    } */
  ])
//모달 열림|닫힘 상태 처리
const [isModalOpen, setIsModalOpen] = useState(false) 

//새로 입력할 일정의 초기값(데이터 모델 설계 참고)
const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
    memo: "",
    color: "#c7daf8"
})
// 날짜 클릭 시 모달창 열기
  const handleDateClick = (info) => {
    // 클릭한 날짜를 시작/종료 시간의 기본값으로 세팅
    setNewEvent({ 
      ...newEvent, 
      start: info.dateStr + "T09:00",  
      end: info.dateStr + "T09:00" 
    });
    setIsModalOpen(true); // 모달 열기 
  };

 // 저장 버튼 클릭 시 실행
  const handleSave = () => {
    //빈 일정이 저장되지 않도록 입력 검증 if문 추가
    if (!newEvent.title) 
      return alert("제목을 꼭 입력해주세요!"); //alert창 추가
    
    //데이터 생성
    const saveEvent = {
      ...newEvent,
      id: crypto.randomUUID() // 수정/삭제를 위한 고유 ID 부여 
    };

    setEvents([...events, saveEvent]); // 배열 업데이트
    setIsModalOpen(false); // 모달창 닫기
    setNewEvent({//새일정 등록시 신규 이벤트 배열 초기화
    title: "",
    start: "",
    end: "",
    memo: "",
    color: "#c7daf8"
    });
    alert("일정이 저장되었습니다!"); //alert창으로 저장 피드백
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
      end: clickedEvent.end || clickedEvent.start, // 종료일 없으면 시작일로
      memo: clickedEvent.memo || "", //메모내용 없을 때 공란
      color: clickedEvent.color,
    });
    //현재 어떤 이벤트를 수정 중인지 Id를 저장해두기
    setSelectedEventId(clickedEvent.id);
    //세팅된 데이터를 모달창을 띄워 보여주기
    setIsModalOpen(true);
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
                onClose={() => setIsModalOpen(false)} 
                newEvent={newEvent}
                setNewEvent={setNewEvent}
                onSave ={handleSave}
              />
            </div>
      </main>
      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};

export default App