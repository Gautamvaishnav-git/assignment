import { Task } from "@/interface/task";
import { Checkbox } from "./ui/checkbox";
import { Draggable } from "react-beautiful-dnd";

interface ListItemProps {
  task: Task;
  index: number;
}

const ListItem: React.FC<ListItemProps> = ({ task, index }) => {
  return (
    <Draggable draggableId={index.toString()} index={index}>
      {(provided) => (
        <label
          ref={provided.innerRef}
          htmlFor={task.id.toString()}
          className="w-full text-left p-2 bg-primary-foreground rounded items-center flex gap-2"
          key={task.id}
        >
          <Checkbox id={task.id.toString()} />
          <p>{task.title}</p>
        </label>
      )}
    </Draggable>
  );
};

export default ListItem;
