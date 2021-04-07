import Navbar from "../../layout/Navbar";
import SideBar from "../../layout/SideBar";
import AdminDashboard from "./AdminDashboard";
import Footer from "../../layout/Footer";
function adminHome() {
  return (
    <div>
      <Navbar />
      <SideBar />
      <AdminDashboard />
      <Footer />
    </div>
  );
}

export default adminHome;
