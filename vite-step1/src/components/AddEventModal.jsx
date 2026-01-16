import React from 'react';

// 부모(App.jsx)로부터 필요한 데이터와 함수를 전달받습니다 (Props)
const AddEventModal = ({ isOpen, onClose, onSave, newEvent, setNewEvent }) => {
// 1. 모달이 닫혀있으면(false) 아무것도 렌더링하지 않습니다.
if (!isOpen) return null;

return (
// 부트스트랩 클래스를 사용하여 배경을 어둡게 하고 모달을 중앙에 배치합니다.
<div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow border-0">
        
          {/* 헤더 영역 */}
        <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">🗓️ 새 일정 등록</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
        </div>

          {/* 바디 영역: 입력 필드 구성 [cite: 8, 145] */}
        <div className="modal-body p-4">
            <div className="mb-3">
            <label className="form-label fw-bold">제목</label>
            <input 
                type="text" 
                className="form-control" 
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="일정 제목을 입력하세요"
            />
            </div>
            
        <div className="row mb-3">
            <div className="col">
                <label className="form-label fw-bold">시작</label>
                <input 
                type="datetime-local" 
                className="form-control" 
                value={newEvent.start}
                onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                />
        </div>
            <div className="col">
                <label className="form-label fw-bold">종료</label>
                <input 
                type="datetime-local" 
                className="form-control" 
                value={newEvent.end}
                onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                />
            </div>
        </div>

            <div className="mb-3">
            <label className="form-label fw-bold">메모</label>
            <textarea 
                className="form-control" 
                rows="3"
                value={newEvent.memo}
                onChange={(e) => setNewEvent({ ...newEvent, memo: e.target.value })}
                placeholder="메모를 입력하세요"
            ></textarea>
            </div>

            <div>
            <label className="form-label fw-bold">색상</label>
            <input 
                type="color" 
                className="form-control form-control-color w-100" 
                value={newEvent.color}
                onChange={(e) => setNewEvent({ ...newEvent, color: e.target.value })}
            />
            </div>
        </div>

          {/* 푸터 영역: 저장/취소 버튼 [cite: 163] */}
            <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary" onClick={onClose}>취소</button>
                <button type="button" className="btn btn-primary px-4" onClick={onSave}>저장하기</button>
            </div>
        </div>
    </div>
</div>
);
};

export default AddEventModal;