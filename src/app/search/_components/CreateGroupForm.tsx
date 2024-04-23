"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { DialogClose } from "~/components/ui/dialog";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { socket } from "~/socket";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

type CreateGroupFormProps = {
  closeDialog: () => void;
};
export default function CreateGroupForm({ closeDialog }: CreateGroupFormProps) {
    const router = useRouter()
  const formSchema = z.object({
    groupName: z.string(),
  });

  const userData = api.auth.me.useQuery();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      groupName: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    socket.emit("create room", data.groupName, userData.data?.id);
        console.log("submit")
        router.push(`/songguessr/${data.groupName}`)
    closeDialog();
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="h3 self-center text-yellow">Create Group Chat</div>
      <Form {...form}>
        <div className="flex w-full flex-col items-center gap-3">
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center gap-2 space-y-6"
          >
            <div className="flex w-full flex-col items-start justify-start gap-2">
              <div className="h4 w-full text-white">Group Name</div>
              <FormField
                control={form.control}
                name="groupName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl className="w-full">
                      <Input
                        className="h-[54px] w-full rounded-xl bg-primary px-3 py-2 text-white opacity-80"
                        type="text"
                        placeholder="Enter your group name here"
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
