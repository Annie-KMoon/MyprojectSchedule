const Header = () => {
return (
    <header className="py-3 mb-4 border-bottom bg-primary shadow-sm">
        <div className="container d-flex justify-content-between align-items-center">
            <span className="fs-4 fw-bold text-white">🗓️ MY PLANNER</span>
                <ul className="nav nav-pills">
                <li className="nav-item">
                    <a href="#" className="nav-link text-white fw-semibold">Home</a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white-50">Schedule</a>
                </li>
                <li className="nav-item">
                    <a href="#" className="nav-link text-white-50">로그인</a>
                </li>
                </ul>
        </div>
    </header>
);
};

export default Header;