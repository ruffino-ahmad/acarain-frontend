import DashboardLayout from "@/components/layouts/DashboardLayout";
import Dashboard from "@/components/views/admin/Dashboard";

const AdminDashboardPage = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      description="dashboard Admin"
      type="admin"
    >
      <Dashboard />
    </DashboardLayout>
  );
};

export default AdminDashboardPage;
