import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import EditProfileForm from "./EditProfileForm";
import EditProfileIcon from "./EditProfileIcon";

export default function EditProfileDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <EditProfileIcon />
      </DialogTrigger>
      <DialogContent className="flex h-[326px] w-[555px] flex-col items-center justify-between gap-3 border-none bg-secondary p-6">
        <EditProfileForm />
      </DialogContent>
    </Dialog>
  );
}
