import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import CreateGroupForm from "./CreateGroupForm";
import { useState } from "react";

export default function CreateGroupDialog() {
  const [open, setOpen] = useState(false);

  function closeDialog() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex flex-row items-center justify-center gap-3 rounded-xl bg-yellow px-4 py-2">
        <FontAwesomeIcon
          icon={faPlusCircle}
          className="text-[24px] text-primary"
        />
        <div className="h6 lg:h4 text-primary">Create Your Group</div>
      </DialogTrigger>
      <DialogContent className="flex h-[256px] w-[512px] flex-col items-center justify-between gap-3 border-none bg-secondary p-6">
        <CreateGroupForm closeDialog={closeDialog} />
      </DialogContent>
    </Dialog>
  );
}
