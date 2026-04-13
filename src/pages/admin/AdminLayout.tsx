import { Outlet } from "react-router-dom";
import AdminSidebar from "@/components/admin/AdminSidebar";

const AdminLayout = () => (
  <div className="flex min-h-screen bg-background">
    <AdminSidebar />
    <div className="flex-1 p-4 lg:p-8 overflow-auto">
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
