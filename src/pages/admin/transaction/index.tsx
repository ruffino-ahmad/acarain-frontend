import DashboardLayout from "@/components/layouts/DashboardLayout";
import Transaction from "@/components/views/Admin/Transaction";

const AdminTransactionPage = () => {
  return (
    <DashboardLayout
      title="Transaction"
      description="List of transaction admin"
      type="admin"
    >
      <Transaction />
    </DashboardLayout>
  );
};

export default AdminTransactionPage;
