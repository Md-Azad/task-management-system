import { useDraggable } from "@dnd-kit/core";
import { useRef, useState } from "react";

import { CiEdit } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import io from "socket.io-client";
const socket = io("https://task-management-system-server-1.onrender.com");
const TaskCard = ({ task }) => {
  const modalRef = useRef(null);
  const [editingTask, setEditingTask] = useState(null);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

  const handleEditTask = (e) => {
    e.preventDefault();
    if (!editingTask) return; // Ensure a task is selected

    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;

    // Emit updated task data
    socket.emit("editTask", {
      _id: editingTask._id,
      title,
      description,
      email: editingTask.email,
    });

    // Close modal
    if (modalRef.current) {
      modalRef.current.close();
    }

    // Clear editingTask state
    setEditingTask(null);
    form.reset();
  };
  const handleDeleteTask = (_id) => {
    socket.emit("deleteTask", _id);
    console.log("deleted clicked");
  };

  return (
    <section className="relative">
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        className="cursor-grab bg-white mx-2 my-2 flex items-center justify-between rounded-lg p-4"
        style={style}
      >
        <div className="">
          <h1 className="font-bold text-xl">{task?.title}</h1>
          <p className="text-gray-400">{task.description}</p>
        </div>

        {/* Ensure buttons are clickable */}
      </div>
      <div className="flex items-center justify-center gap-4 absolute top-4 right-4">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Ensure it doesn't interfere with drag
            setEditingTask(task); // Store the correct task for editing
            modalRef.current.showModal(); // Open the modal
          }}
          className="btn bg-yellow-400"
          data-no-dnd="true"
          style={{ pointerEvents: "auto" }}
        >
          <CiEdit className="text-2xl" />
        </button>
        <button
          onClick={() => handleDeleteTask(task._id)}
          className="btn btn-error"
          data-no-dnd="true"
        >
          <MdDeleteOutline className="text-white text-2xl" />
        </button>
      </div>

      <dialog ref={modalRef} id="editModal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form onSubmit={(e) => handleEditTask(e)} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Title here"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <input
                type="text"
                name="description"
                placeholder="Description"
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control mt-6">
              <input className="btn btn-primary" type="submit" value="Submit" />
            </div>
          </form>
        </div>
      </dialog>
    </section>
  );
};

export default TaskCard;
