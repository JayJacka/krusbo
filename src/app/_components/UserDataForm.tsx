"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import AvatarRandom from "./AvatarRandom";
import { api } from "~/trpc/react";

export function UserDataForm() {
  const formSchema = z.object({
    avatar: z.string(),
    nickname: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });

  const createUser = api.auth.createUser.useMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      avatar: "",
      nickname: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const props = {
      avatar: data.avatar,
      nickname: data.nickname,
    };
    await createUser.mutateAsync(props);
  }

  function handleAvatar(avatar: string) {
    form.setValue("avatar", avatar);
  }

  return (
    <div>
      <Form {...form}>
        <div className="flex flex-col items-center gap-3">
          <AvatarRandom setAvatar={handleAvatar} />
          <h3 className="text-white">Pick your avatar and nickname</h3>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-1 space-y-6"
          >
            <FormField
              control={form.control}
              name="nickname"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-input"
                      placeholder="Enter your nickname"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="flex flex-row gap-2 rounded-xl bg-pink text-white"
            >
              <FontAwesomeIcon icon={faRocket} />
              Let's Get Started
            </Button>
          </form>
        </div>
      </Form>
    </div>
  );
}
