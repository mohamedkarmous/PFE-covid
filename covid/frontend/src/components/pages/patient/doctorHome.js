import Navbar from "../../layout/Navbar";
import SideBar from "../../layout/SideBar";
import Dashboard from "./Dashboard";
import Footer from "../../layout/Footer";
export default function doctorHome() {
  return (
    <div>
      <SideBar />
      <Dashboard />
      <Footer />
    </div>
  );
}
