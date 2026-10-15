import DashboardLayout from "@/components/layouts/DashboardLayout";
import DetailCategory from "@/components/views/Admin/DetailCategory";

const AdminDetailCategoryPage = () => {
  return (
    <DashboardLayout
      title="Category"
      description="Manage category details, including viewing and editing category information."
      type="admin"
    >
      <DetailCategory />
    </DashboardLayout>
  );
};

export default AdminDetailCategoryPage;
