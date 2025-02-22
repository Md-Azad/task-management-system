import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import { IoMdAddCircleOutline } from "react-icons/io";

const Culumns = ({ culumn, tasks, showMod }) => {
  const { setNodeRef } = useDroppable({
    id: culumn.id,
  });
  return (
    <div className="bg-gray-400 rounded-lg">
      <div className="mx-4 mt-2 flex justify-between h-10">
        <h1 className="text-2xl font-bold ">{culumn.title}</h1>
        {culumn.id === "TODO" && (
          <button onClick={showMod} className="btn">
            <IoMdAddCircleOutline className="text-2xl" />
          </button>
        )}
      </div>

      <div ref={setNodeRef} className="space-y-3 p-4">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task}></TaskCard>
        ))}
      </div>
    </div>
  );
};

export default Culumns;
