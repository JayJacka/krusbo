"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AvatarRandom from "~/app/_components/AvatarRandom";
import { DialogClose } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
export default function EditProfileForm() {
  const formSchema = z.object({
    avatar: z.string(),
    nickname: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      nickname: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
  }

  function handleAvatar(avatar: string) {
    form.setValue("avatar", avatar);
  }
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3">
      <div className="h3 flex w-full justify-center text-yellow">
        Edit Profile
      </div>
      <Form {...form}>
        <div className="flex w-full flex-col items-center gap-3">
          <AvatarRandom setAvatar={handleAvatar} size={90} />
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center gap-1 space-y-6"
          >
            <div className="flex w-full flex-col items-start justify-start gap-2">
              <div className="h4 w-full text-white">Nickname</div>
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl className="w-full">
                      <Input
                        className="h-[54px] w-full rounded-xl bg-primary px-3 py-2 text-white opacity-80"
                        type="text"
                        placeholder="Enter your nickname"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </div>
        <div className="flex w-full flex-row justify-end gap-3">
          <DialogClose asChild>
            <button className="h5 h-[40px] w-[80px] rounded-2xl border border-white text-white">
              Cancel
            </button>
          </DialogClose>
          <button
            type="submit"
            className="h5 h-[40px] w-[80px] rounded-2xl bg-yellow text-black"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}
