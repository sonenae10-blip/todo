import { useState } from "react";

function Home() {
    return (
        <div>
            <h2>Home</h2>
            <p>홈페이지입니다.</p>
        </div>
    );
}

function Products() {
    return (
        <div>
            <h2>Products</h2>
            <p>상품 페이지입니다.</p>
        </div>
    );
}

function Contact() {
    return (
        <div>
            <h2>Contact</h2>
            <p>연락처 페이지입니다.</p>
        </div>
    );
}

function App() {
    const [currentPage, setCurrentPage] = useState("home");

    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return <Home />;
            case "products":
                return <Products />;
            case "contact":
                return <Contact />;
            default:
                return <Home />;
        }
    };

    const getButtonStyle = (page) => ({
        backgroundColor: currentPage === page ? "#000" : "#fff",
        color: currentPage === page ? "#fff" : "lightblue",
    });

    return (
        <>
            <nav style={{ marginBottom: "20px" }}>
                <button style={getButtonStyle("home")} onClick={() => setCurrentPage("home")}>
                    Home
                </button>
                <button style={getButtonStyle("products")} onClick={() => setCurrentPage("products")}>
                    Products
                </button>
                <button style={getButtonStyle("contact")} onClick={() => setCurrentPage("contact")}>
                    Contact
                </button>
            </nav>

            {/* 여기에 선택된 메뉴에 맞는 컴포넌트 렌더링 */}
            {renderPage()}
        </>
    );
}

export default App;