import DashboardLayout from "@/components/layouts/DashboardLayout";
import Event from "@/components/views/Admin/Event";

const AdminEventPage = () => {
  return (
    <DashboardLayout
      title="Event"
      description="List of all Events, create new events, and manage existing ones."
      type="admin"
    >
      <Event />
    </DashboardLayout>
  );
};

export default AdminEventPage;
