import React from 'react';

// 부모(App.jsx)로부터 필요한 데이터와 함수를 전달받기(props)
const AddEventModal = ({isOpen, onClose, newEvent, onSave, setNewEvent, isEditMode, onDelete})=>{
    //1. 모달이 닫혀있으면(false) 아무것도 렌더링 하지 않는다.
    if(!isOpen) return null;

return(
    //부트스트랩을 사용해 모달을 중앙 배치
<div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
    <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow border-0">

 {/* 헤더 영역 */}
        <div className="modal-header bg-primary text-white">
            <h6 className="modal-title">
                {isEditMode ? "🗓️ 일정 수정하기" : "🗓️ 새 일정 등록"}
            </h6>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
        </div>
            {/* 바디 영역: 데이터(제목, 시작, 종료, 메모, 색상) 입력 */}
            <div className="modal-body p-4">
                <div className="mb-3">
                    <label className="form-label fw-bold">제 목</label>
                    <input 
                        type="text" 
                        className="form-control"
                        value={newEvent.title} 
                        placeholder="일정 제목을 입력하세요"
                        onChange={(e)=> setNewEvent({...newEvent, title:e.target.value})}
                    />
                </div>
                        
                <div className="row mb-3">
                <div className="col">
                    <label className="form-label fw-bold">시 작</label>
                    <input 
                        type="datetime-local" 
                        className="form-control" 
                        value={newEvent.start}
                        onChange={(e)=>setNewEvent({...newEvent,start:e.target.value})}
                    />
                </div>
                <div className="col">
                    <label className="form-label fw-bold">종 료</label>
                    <input 
                    type="datetime-local" 
                    className="form-control"
                    value={newEvent.end} 
                    onChange={(e)=>setNewEvent({...newEvent, end:e.target.value})}
                    />
                </div>
                </div>
                <div className="mb-3">
                <label className="form-label fw-bold">메 모</label>
                <textarea 
                    className="form-control" 
                    rows="3"
                    value={newEvent.memo}
                    placeholder="메모를 입력하세요"
                    onChange={(e)=>setNewEvent({...newEvent, memo:e.target.value})}
                ></textarea>
                </div>

                <div>
                <label className="form-label fw-bold">색 상</label>
                <input 
                    type="color" 
                    className="form-control form-control-color w-100" 
                    value={newEvent.color}
                    onChange={(e)=>setNewEvent({...newEvent, color:e.target.value})}
                />
                </div>
            </div>
{/* 푸터 영역: 저장/취소 버튼*/}
            <div className="modal-footer border-0">
                {/* 수정모드일 때만 삭제버튼 노출 */}
                <div>
                    {isEditMode && (
                        <button type="button" className="btn btn-danger px-4" onClick={onDelete}>DELETE</button>
                    )}
                </div>
                {/* 취소 및 저장 버튼 */}
                <div>
                    <button type="button" className="btn btn-secondary px-4 me-2" onClick={onClose}>CANCLE</button>
                    <button type="button" className="btn btn-primary px-4" onClick={onSave}>SAVE</button>
                </div>
            </div>
        </div>
    </div>
</div>


)
}

export default AddEventModal;