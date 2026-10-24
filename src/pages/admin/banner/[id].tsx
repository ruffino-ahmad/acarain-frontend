import DashboardLayout from "@/components/layouts/DashboardLayout";
import DetailCategory from "@/components/views/Admin/DetailCategory";

const AdminDetailBannerPage = () => {
  return (
    <DashboardLayout
      title="Banner"
      description="Manage banner details, including viewing and editing banner information."
      type="admin"
    >
      <DetailCategory />
    </DashboardLayout>
  );
};

export default AdminDetailBannerPage;
