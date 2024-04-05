"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";
import AvatarRandom from "./AvatarRandom";

export function UserDataForm(){
  const formSchema = z.object({
    avatar: z.string(),
    nickname: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  })
	
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
      avatar: "",
		  nickname: "",
		},
	  })

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log(data)
  } 
  
  function handleAvatar(avatar: string) {
    form.setValue('avatar', avatar);
  }
  
  return <div> 
        <Form {...form}>
          <div className="flex flex-col gap-3 items-center">
            <AvatarRandom setAvatar={handleAvatar}/>
            <h3 className="text-white">Pick your avatar and nickname</h3>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col items-center gap-1">
                  <FormField
                      control={form.control}
                      name="nickname"
                      render={({field}) => (
                          <FormItem>
                              <FormControl>
                                  <Input className="bg-input" placeholder="Enter your nickname" {...field} />
                              </FormControl>
                          </FormItem>
                      )}
                      />
                  <Button type ="submit" className="bg-button-pink text-white rounded-xl flex flex-row gap-2">
                      <FontAwesomeIcon icon={faRocket}/>
                      Let Started
                  </Button>
              </form>
              </div>
            </Form>
          </div>

}