import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const Culumns = ({ culumn, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: culumn.id,
  });
  return (
    <div className="bg-gray-400">
      <h1>{culumn.title}</h1>
      <div ref={setNodeRef} className="space-y-3 p-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task}></TaskCard>
        ))}
      </div>
    </div>
  );
};

export default Culumns;
