import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Toaster, toast } from "sonner";
import * as z from "zod";
import { Button } from "./ui/button";
import queryClient from "@/lib/query-client";
import { CONSTANTS } from "@/lib/constants";
import { useEffect } from "react";

const createListSchema = z
  .object({
    listName: z.string({ required_error: "Please enter a list name." }),
  })
  .refine(
    (data) => {
      return data.listName.trim().length !== 0;
    },
    { message: "Please enter a list name.", path: ["listName"] }
  );

type CreateListFormValues = z.infer<typeof createListSchema>;

const CreateList = () => {
  const {
    mutate: createList,
    isPending,
    isError,
    isSuccess,
  } = useMutation({
    mutationFn: async (listName: string) => {
      const url = new URL("/api/v1/lists", import.meta.env.VITE_API_URI);

      const res = await axios.post(
        url.toString(),
        { data: listName },
        {
          headers: {
            Authorization: `${sessionStorage.getItem("token")}`,
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: [CONSTANTS.QUERY_KYE.LITS] });
      return res;
    },
  });

  const form = useForm<CreateListFormValues>({
    resolver: zodResolver(createListSchema),
  });
  function onSubmit(values: z.infer<typeof createListSchema>) {
    createList(values.listName);
  }

  useEffect(() => {
    if (isPending) {
      toast.loading("Creating list...");
    }

    if (isError) {
      toast.error("Something went wrong");
    }

    if (isSuccess) {
      toast.success("List created!");
    }
  }, [isError, isPending, isSuccess]);

  return (
    <>
      <Toaster richColors closeButton />
      <Popover>
        <PopoverTrigger>
          <Button>Create List</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col items-start gap-2 p-4"
            >
              <FormField
                control={form.control}
                name="listName"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-start">
                    <FormLabel className="pb-2">List Name</FormLabel>
                    <FormControl>
                      <Input placeholder="list Name" {...field} />
                    </FormControl>
                    <FormMessage className="text-red-600" />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                Submit
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default CreateList;
