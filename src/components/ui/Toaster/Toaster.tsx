import { ReactNode } from "react";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";

const iconList: { [key: string]: ReactNode } = {
  success: <CiCircleCheck className="text-success-500 text-3xl" />,
  error: <CiCircleRemove className="text-danger-500 text-3xl" />,
};

interface ToasterProps {
  type: string;
  message: string;
}

const Toaster = (props: ToasterProps) => {
  const { type, message } = props;
  return (
    <div
      role="alert"
      aria-labelledby="toaster-label"
      className="fixed right-8 top-8 z-50 max-w-xs rounded-xl border border-gray-200 bg-white shadow-sm"
    >
      <div className="flex items-center gap-2 p-4">
        {iconList[type]}
        <p id="toaster-label" className="text-sm text-gray-700">
          {message}
        </p>
      </div>
    </div>
  );
};

export default Toaster;
