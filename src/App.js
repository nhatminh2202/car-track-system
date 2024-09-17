import LoginForm from "./layout/LoginForm";
import MainLayout from "./layout/MainLayout";
import { Routes, Route } from "react-router-dom";
import OrderLayout from "./layout/OrderLayout";
import ScheduleLayout from "./layout/ScheduleLayout";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/home" element={<MainLayout />} />
        <Route path="/orders" element={<OrderLayout />} />
        <Route path="/schedule" element={<ScheduleLayout />} />
      </Routes>
    </div>
  );
}

export default App
