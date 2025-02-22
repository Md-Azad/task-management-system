import { useDraggable } from "@dnd-kit/core";
import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";

const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab bg-white mx-2 my-2 flex items-center justify-between rounded-lg p-4"
      style={style}
    >
      <div>
        <h1 className="font-bold text-xl">{task?.title}</h1>
        <p className="text-gray-400">{task.description}</p>
      </div>
      <div className=" flex items-center justify-center gap-4">
        <button className="btn bg-yellow-400 ">
          <CiEdit className=" text-2xl " />
        </button>
        <button className="btn btn-error">
          <MdDeleteOutline className=" text-white text-2xl" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
