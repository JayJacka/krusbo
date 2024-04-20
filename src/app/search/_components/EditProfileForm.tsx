"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import AvatarRandom from "~/app/_components/AvatarRandom";
import { Button } from "~/components/ui/button";
import { DialogClose } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { api } from "~/trpc/react";

export default function EditProfileForm() {
  const userData = api.auth.me.useQuery();
  const formSchema = z.object({
    avatar: z.string(),
    nickname: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });
  const updateUser = api.auth.updateUser.useMutation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: userData.data?.avatar || "",
      nickname: userData.data?.nickname || "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data);
    const props = {
      avatar: data.avatar,
      nickname: data.nickname,
    };
    if (props.avatar === "" || props.nickname === "") {
      return;
    }
    try {
      updateUser.mutateAsync(props);
    } catch (e) {
      console.log(e);
    }
    window.location.reload();
  }

  function handleAvatar(avatar: string) {
    form.setValue("avatar", avatar);
  }
  return (
    <div className="flex h-full w-full flex-col justify-center gap-3">
      <div className="h3 flex w-full justify-center text-yellow">
        Edit Profile
      </div>
      <div className="flex w-full justify-center">
        <AvatarRandom
          setAvatar={handleAvatar}
          initialAvatar={userData.data?.avatar}
          size={90}
        />
      </div>
      <Form {...form}>
        <div className="flex w-full flex-col items-center gap-3">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center gap-3"
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
            <div className="flex w-full flex-row justify-end gap-3">
              <DialogClose asChild>
                <button className="h5 h-[40px] w-[80px] rounded-2xl border border-white text-white">
                  Cancel
                </button>
              </DialogClose>
              <Button
                type="submit"
                className="h5 h-[40px] w-[80px] rounded-2xl bg-yellow text-black"
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </Form>
    </div>
  );
}
