import DashboardLayout from "@/components/layouts/DashboardLayout";
import DetailBanner from "@/components/views/Admin/DetailBaner";

const AdminDetailBannerPage = () => {
  return (
    <DashboardLayout
      title="Banner"
      description="Manage banner details, including viewing and editing banner information."
      type="admin"
    >
      <DetailBanner />
    </DashboardLayout>
  );
};

export default AdminDetailBannerPage;
