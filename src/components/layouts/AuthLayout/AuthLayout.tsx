import PageHead from "@/components/commons/PageHead";
import { ReactNode } from "react";

interface AuthLayoutProps {
  title?: string;
  children: ReactNode;
}

const AuthLayout = (props: AuthLayoutProps) => {
  const { title = "acarain", children } = props;
  return (
    <>
      <PageHead title={title} />
      <section className="max-w-screen-3xl 3xl:container p-6">
        {children}
      </section>
    </>
  );
};

export default AuthLayout;
