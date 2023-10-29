import CreateList from "@/components/create-list";
import ErrorComponent from "@/components/error";
import List from "@/components/list";
import { ListType } from "@/interface/task";
import { CONSTANTS } from "@/lib/constants";
import queryClient from "@/lib/query-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { DragDropContext, type DropResult } from "react-beautiful-dnd";
import { toast } from "sonner";

type MoveTaskParams = { listID: number; taskID: number };

const ListPage = () => {
  const [lists, setLists] = useState<ListType[]>();

  const { data, ...fetchListResponse } = useQuery({
    queryKey: [CONSTANTS.QUERY_KYE.LITS],
    queryFn: async () => {
      const fetchLists = new URL("/api/v1/lists", import.meta.env.VITE_API_URI);
      const response = await axios.get<ListType[]>(fetchLists.toString(), {
        headers: {
          Authorization: sessionStorage.getItem("token"),
        },
      });
      return response.data;
    },
    refetchOnWindowFocus: false,
  });

  const { mutate: moveTask, ...moveResponse } = useMutation({
    mutationFn: async ({
      from,
      to,
    }: {
      from: MoveTaskParams;
      to: MoveTaskParams;
    }) => {
      const url = new URL(
        "/api/v1/lists/task/move",
        import.meta.env.VITE_API_URI
      );
      const response = await axios.patch(
        url.toString(),
        { data: { from, to } },
        { headers: { Authorization: sessionStorage.getItem("token") } }
      );
      queryClient.invalidateQueries({ queryKey: [CONSTANTS.QUERY_KYE.LITS] });
      return response.data;
    },
  });

  useEffect(() => {
    setLists(data);
    if (fetchListResponse.isPending) {
      toast.loading("Fetching lists...");
    }
    if (fetchListResponse.isError) {
      toast.error("Error fetching lists.");
    }
    if (fetchListResponse.isSuccess) {
      toast.success("Lists fetched successfully.");
    }
  }, [
    data,
    fetchListResponse.isError,
    fetchListResponse.isPending,
    fetchListResponse.isSuccess,
  ]);

  const handleDragAndDrop = (
    result: DropResult
    // provided: ResponderProvided
  ) => {
    const from: MoveTaskParams = {
      listID: +result.source.droppableId,
      taskID: result.source.index,
    };
    if (!result.destination?.droppableId) return;

    const to: MoveTaskParams = {
      listID: +result.destination.droppableId,
      taskID: result.destination.index,
    };

    moveTask({ from, to });

    if (moveResponse.isError) {
      toast.error("Error moving task.");
    }
    if (moveResponse.isPending) {
      toast.loading("Moving task...");
    }
    if (moveResponse.isSuccess) {
      toast.success("Task moved successfully.");
    }

    if (!to.listID) return;
  };

  if (fetchListResponse.isError)
    return (
      <ErrorComponent
        error={fetchListResponse.error}
        fallbackError="Error fetching lists."
        retry={fetchListResponse.refetch}
      />
    );

  return (
    <div className="pt-8 flex flex-col items-start">
      <div className="w-1/4 flex pb-4 self-end">
        <CreateList />
      </div>
      <div className="flex flex-wrap gap-8">
        <DragDropContext onDragEnd={handleDragAndDrop}>
          {lists &&
            lists?.map((list) => {
              return (
                <List
                  listTitle={list.listName}
                  tasks={list.tasks}
                  droppableId={list.listID.toString()}
                  key={list.listID}
                  listID={list.listID}
                />
              );
            })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default ListPage;
