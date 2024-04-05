import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
  } from "~/components/ui/dialog";

export default function CreateGroupDialog() {
  return (
    <Dialog>
      <DialogTrigger className="flex flex-row items-center justify-center gap-3 rounded-xl bg-button-yellow px-4 py-2">
        <FontAwesomeIcon
          icon={faPlusCircle}
          width={24}
          height={24}
          className="text-primary"
        />
        <div className="h3 font-bold text-primary">Create Your Group</div>
      </DialogTrigger>
      <DialogContent className="bg-secondary flex h-[256px] w-[512px] flex-col items-center justify-between gap-3 border-none p-6">
        <div className="h2 font-bold text-button-yellow">Create Group Chat</div>
        <div className="flex w-full flex-col items-start justify-start gap-2">
          <div className="h4 font-bold text-white">Group Name</div>
          <input
            className="h-[54px] w-full rounded-xl bg-primary px-3 py-2 text-grey opacity-80"
            type=""
            placeholder="Enter your group name here"
          />
        </div>
        <div className="flex w-full flex-row justify-end gap-3">
          <DialogClose asChild>
            <button className="h5 h-[40px] w-[80px] rounded-2xl border border-white font-bold text-white">
              Cancel
            </button>
          </DialogClose>
          <button className="h5 h-[40px] w-[80px] rounded-2xl bg-button-yellow font-bold text-black">
            Submit
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
