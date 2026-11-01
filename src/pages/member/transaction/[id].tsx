import DashboardLayout from "@/components/layouts/DashboardLayout";
import DetailTransaction from "@/components/views/Member/DetailTransaction";

const MemberDetailTransactionPage = () => {
  return (
    <DashboardLayout
      title="Detail Transaction"
      description="Detail of transaction member"
      type="member"
    >
      <DetailTransaction />
    </DashboardLayout>
  );
};

export default MemberDetailTransactionPage;
