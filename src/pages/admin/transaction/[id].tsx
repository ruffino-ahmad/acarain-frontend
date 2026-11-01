import DashboardLayout from "@/components/layouts/DashboardLayout";
import DetailTransaction from "@/components/views/Admin/Transaction/DetailTransaction";

const AdminDetailTransactionPage = () => {
  return (
    <DashboardLayout
      title="Detail Transaction"
      description="Manage transaction details, including payment status and issued vouchers."
      type="admin"
    >
      <DetailTransaction />
    </DashboardLayout>
  );
};

export default AdminDetailTransactionPage;
