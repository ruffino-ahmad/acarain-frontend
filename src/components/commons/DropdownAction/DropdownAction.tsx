import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { CiMenuKebab } from "react-icons/ci";

interface DropDownActionProps {
  onPressButtonDetail: () => void;
  onPressButtonDelete: () => void;
}

const DropDownAction = (props: DropDownActionProps) => {
  const { onPressButtonDetail, onPressButtonDelete } = props;
  return (
    <Dropdown>
      <DropdownTrigger>
        <Button isIconOnly size="sm" variant="light">
          <CiMenuKebab className="text-default-700" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="detail-event-button" onPress={onPressButtonDetail}>
          Detail
        </DropdownItem>
        <DropdownItem
          key="delete-event"
          className="text-danger-500"
          onPress={onPressButtonDelete}
        >
          Delete
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export default DropDownAction;
