import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/interface/task";
import { CONSTANTS } from "@/lib/constants";
import queryClient from "@/lib/query-client";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { DeleteIcon, Plus } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export interface ListProps {
  listTitle: string;
  tasks: Task[];
  droppableId: string;
  listID: number;
}

const List: React.FC<ListProps> = ({
  tasks,
  listTitle,
  droppableId,
  listID,
}) => {
  const [task, setTask] = useState<string>("");

  const { mutate: createTask, ...taskResponse } = useMutation({
    mutationFn: async (listID: number) => {
      const url = new URL(
        "/api/v1/lists/" + listID + "/task",
        import.meta.env.VITE_API_URI
      );
      const response = await axios.post<
        unknown,
        AxiosResponse,
        { data: Omit<Task, "taskID"> }
      >(
        url.toString(),
        { data: { taskName: task, status: "OPEN" } },
        { headers: { Authorization: sessionStorage.getItem("token") } }
      );
      queryClient.invalidateQueries({ queryKey: [CONSTANTS.QUERY_KYE.LITS] });
      return response.data;
    },
  });

  const { mutate: updateStatus, ...updateStatusResponse } = useMutation({
    mutationFn: async ({
      taskID,
      status,
    }: {
      taskID: number;
      status: Task["status"];
    }) => {
      const url = new URL(
        "/api/v1/lists/task/" + taskID,
        import.meta.env.VITE_API_URI
      );
      const response = await axios.patch(
        url.toString(),
        { data: { status } },
        { headers: { Authorization: sessionStorage.getItem("token") } }
      );
      queryClient.invalidateQueries({ queryKey: [CONSTANTS.QUERY_KYE.LITS] });
      return response.data;
    },
  });

  const { mutate: deleteTask, ...deleteResponse } = useMutation({
    mutationFn: async (taskID: number) => {
      const url = new URL(
        "/api/v1/lists/task/" + taskID,
        import.meta.env.VITE_API_URI
      );
      const response = await axios.delete(url.toString(), {
        headers: { Authorization: sessionStorage.getItem("token") },
      });
      queryClient.invalidateQueries({ queryKey: [CONSTANTS.QUERY_KYE.LITS] });
      return response.data;
    },
  });

  useEffect(() => {
    if (taskResponse.isError && !taskResponse.isPending) {
      toast.error("Error creating task.");
    }
    if (taskResponse.isSuccess && !taskResponse.isPending) {
      setTask("");
      toast.success("Task created successfully.");
    }
    if (taskResponse.isPending) {
      toast.loading("Creating task...");
    }
  }, [taskResponse.isError, taskResponse.isPending, taskResponse.isSuccess]);

  useEffect(() => {
    if (deleteResponse.isError && !deleteResponse.isPending) {
      toast.error("Error deleting task.");
    }
    if (deleteResponse.isSuccess && !deleteResponse.isPending) {
      toast.success("Task deleted successfully.");
    }
    if (deleteResponse.isPending) {
      toast.loading("Deleting task...");
    }
  }, [
    deleteResponse.isError,
    deleteResponse.isPending,
    deleteResponse.isSuccess,
  ]);

  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <div
          className="flex flex-col bg-primary-foreground rounded shadow min-w-[200px]"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
          <h1 className="text-xl py-2 bg-primary-foreground">{listTitle}</h1>
          <div className="flex flex-col bg-secondary p-2 gap-2">
            {tasks &&
              tasks.length > 0 &&
              tasks?.map((task) => (
                <Draggable
                  draggableId={listTitle + task?.taskID}
                  index={task.taskID}
                  key={task.taskID.toString()}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                      key={task.taskID}
                      className="relative"
                    >
                      <label
                        htmlFor={task.taskID.toString()}
                        className="w-full text-left p-2 bg-primary-foreground rounded items-center flex gap-2"
                        aria-disabled={updateStatusResponse.isPending}
                      >
                        <Checkbox
                          id={task.taskID.toString()}
                          checked={task.status === "DONE" ? true : false}
                          onCheckedChange={(checked) => {
                            console.log(checked);
                            updateStatus({
                              taskID: task.taskID,
                              status: checked ? "DONE" : "OPEN",
                            });
                          }}
                        />
                        <p>{task.taskName}</p>
                      </label>
                      <DeleteIcon
                        className="absolute right-2 z-50 hover:text-red-600 top-2 cursor-pointer"
                        onClick={() => {
                          deleteTask(task.taskID);
                        }}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            <div className="flex gap-2 items-center">
              <Input
                placeholder="Add a task"
                onChange={(e) => {
                  setTask(e.target.value);
                }}
                value={task}
              />
              <Button
                size={"icon"}
                className="w-10 h-8"
                disabled={taskResponse.isPending || task.trim() === ""}
                onClick={() => {
                  createTask(listID);
                }}
              >
                <Plus size={20} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default List;
