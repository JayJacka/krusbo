import { faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import EditProfileForm from "./EditProfileForm";

export default function EditProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative">
          <img
            alt="profile"
            src="https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Boots"
            height={50}
            width={50}
          />
          <div className="absolute left-9 top-8 flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <FontAwesomeIcon
              icon={faPen}
              width={16}
              height={16}
              color="black"
            />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="flex h-[326px] w-[555px] flex-col items-center justify-between gap-3 border-none bg-secondary p-6">
        <EditProfileForm />
      </DialogContent>
    </Dialog>
  );
}
