import AuthLayout from "@/components/layouts/AuthLayout";
import Activation from "@/components/views/Auth/Activation";
import authServices from "@/services/auth.service";

interface ActivationPageProps {
  status: "success" | "failed";
}

const ActivationPage = (props: ActivationPageProps) => {
  return (
    <AuthLayout title="Acarain | Activation">
      <Activation {...props} />
    </AuthLayout>
  );
};

export async function getServerSideProps(context: {
  query: { activationCode: string };
}) {
  try {
    const result = await authServices.activation({
      activationCode: context.query.activationCode,
    });
    if (result.data.data) {
      return {
        props: {
          status: "success",
        },
      };
    } else {
      return {
        props: {
          status: "failed",
        },
      };
    }
  } catch (error) {
    return {
      props: {
        status: "failed",
      },
    };
  }
}

export default ActivationPage;
