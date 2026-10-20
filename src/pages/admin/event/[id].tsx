import DashboardLayout from "@/components/layouts/DashboardLayout";
import DetailEvent from "@/components/views/Admin/DetailEvent";

const AdminDetailEventPage = () => {
  return (
    <DashboardLayout
      title="Event"
      description="Manage event details, including viewing and editing event information."
      type="admin"
    >
      <DetailEvent />
    </DashboardLayout>
  );
};

export default AdminDetailEventPage;
