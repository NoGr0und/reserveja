import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Bell } from "lucide-react";

export function Notificationbt() {
  return (
    <>
      {" "}
      <div className="left-0 flex w-full justify-end bg-gray-950 p-6">
        <Button className="bg-blue-400 text-white">
          <Bell />
        </Button>
      </div>
      <Separator />
    </>
  );
}
