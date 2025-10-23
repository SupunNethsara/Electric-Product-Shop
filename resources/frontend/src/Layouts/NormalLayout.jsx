import Navbar from "../UserInterFaceComponents/Common/Navbar.jsx";

const NormalLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>{children}</main>
        </div>
    );
};

export default NormalLayout;
