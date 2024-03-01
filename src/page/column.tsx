import { User } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "picture_url",
    header: () => null,
    cell(props) {
      const onImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
        event.currentTarget.src = "https://avatar.iran.liara.run/public/5";
      };
      return (
        <div className="avatar">
          <div className="w-12 rounded-full">
            <img
              src={props.row.original.picture_url}
              onError={onImageError}
              alt={props.row.original.display_name}
            />
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "display_name",
    header: "ชื่อผู้ใช้งาน",
  },
  {
    accessorKey: "datetime",
    header: "วันที่เข้ามาล่าสุด",
    cell(props) {
      return new Date(props.row.original.datetime).toLocaleString("th-TH", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    },
  },
];
