const pad = (value: number) => String(value).padStart(2, "0");

const toDateTimeLocal = (value?: string | Date | null): string => {
  if (!value) return "";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return "-";

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const convertTime = (isoDate: string): string => {
  const dataObject = new Date(isoDate);

  const date = dataObject.toLocaleString("id-ID", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  });

  return `${date} WIB`;
};
export { formatDateTime, toDateTimeLocal, convertTime };
