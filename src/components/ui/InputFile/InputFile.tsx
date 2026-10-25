import { cn } from "@/utils/cn";
import { Button, Spinner } from "@heroui/react";
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
} from "react";
import { CiSaveUp2, CiTrash } from "react-icons/ci";

interface InputFileProps {
  className?: string;
  isDropable?: boolean;
  name: string;
  onUpload?: (files: FileList) => void;
  onDelete?: () => void;
  isUploading?: boolean;
  isDeleting?: boolean;
  preview?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  label?: ReactNode;
  previewClassName?: string;
}

const ACCEPTED_TYPES = "image/jpeg,image/png,image/webp";

const InputFile = (props: InputFileProps) => {
  const {
    className,
    isDropable = false,
    name,
    isInvalid,
    errorMessage,
    isUploading,
    isDeleting,
    preview,
    onUpload,
    onDelete,
    label,
    previewClassName,
  } = props;
  const drop = useRef<HTMLDivElement>(null);
  const inputId = `dropzone-file-${useId()}`;
  const isLocked =
    Boolean(preview) || Boolean(isUploading) || Boolean(isDeleting);

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      if (isDropable) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    [isDropable]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isLocked) return;
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        onUpload?.(files);
      }
    },
    [isLocked, onUpload]
  );

  useEffect(() => {
    const el = drop.current;
    if (!el || !isDropable) return;

    el.addEventListener("dragover", handleDragOver);
    el.addEventListener("drop", handleDrop);

    return () => {
      el.removeEventListener("dragover", handleDragOver);
      el.removeEventListener("drop", handleDrop);
    };
  }, [isDropable, handleDragOver, handleDrop]);

  const handleOnUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      onUpload?.(files);
    }
    e.currentTarget.value = "";
  };

  return (
    <div>
      {label}
      <div
        ref={drop}
        className={cn(
          "relative flex min-h-24 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50",
          isDropable && !preview && "cursor-pointer hover:bg-gray-100",
          className,
          {
            "border-danger-500": isInvalid,
          }
        )}
      >
        {preview && (
          <div className="flex flex-col items-center justify-center p-5">
            <img
              src={preview}
              alt="preview"
              className={cn(
                "mb-2 rounded-md",
                previewClassName ?? "max-h-40 max-w-full object-contain"
              )}
            />
            <Button
              isIconOnly
              type="button"
              aria-label="Remove image"
              onPress={onDelete}
              isDisabled={isDeleting}
              className="bg-danger-100 absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded"
            >
              {isDeleting ? (
                <Spinner size="sm" color="danger" />
              ) : (
                <CiTrash className="text-danger-500 h-5 w-5" />
              )}
            </Button>
          </div>
        )}

        {!preview && !isUploading && (
          <label
            htmlFor={inputId}
            className="flex w-full cursor-pointer flex-col items-center justify-center p-5"
          >
            <CiSaveUp2 className="mb-2 h-10 w-10 text-gray-400" />
            <p className="text-center text-sm font-semibold text-gray-500">
              {isDropable
                ? "Drag and drop an image here or click to select a file"
                : "Click to select a file"}
            </p>
          </label>
        )}

        {isUploading && (
          <div className="flex flex-col items-center justify-center p-5">
            <Spinner color="danger" />
          </div>
        )}

        <input
          name={name}
          type="file"
          className="hidden"
          accept={ACCEPTED_TYPES}
          id={inputId}
          onChange={handleOnUpload}
          disabled={isLocked}
        />
      </div>
      {isInvalid && (
        <p className="text-danger-500 p-1 text-xs">{errorMessage}</p>
      )}
    </div>
  );
};

export default InputFile;
