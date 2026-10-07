import DashboardLayout from "@/components/layouts/DashboardLayout";
import Dashboard from "@/components/views/member/Dashboard";

const MemberDashboardPage = () => {
  return (
    <DashboardLayout
      title="Dashboard"
      description="dashboard member"
      type="member"
    >
      <Dashboard />
    </DashboardLayout>
  );
};

export default MemberDashboardPage;
