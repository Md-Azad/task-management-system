import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";

import io from "socket.io-client";
import Culumns from "./Culumns";
import { closestCorners, DndContext } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

const socket = io("http://localhost:3000");

const Taskboard = () => {
  const [tasks, setTasks] = useState([]);
  const modalRef = useRef(null);

  const CULUMNS = [
    { id: "TODO", title: "To-Do" },
    { id: "IN_PROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
  ];

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:3000/tasks");
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);
  useEffect(() => {
    // Listen for task updates from the server
    socket.on("tasksUpdated", (updatedTasks) => {
      console.log("Tasks Updated (From Server):", updatedTasks);
      setTasks(updatedTasks);
    });

    // Cleanup the event listener on component unmount
    return () => {
      socket.off("tasksUpdated");
    };
  }, []);

  const showMod = () => {
    document.getElementById("my_modal_3").showModal();
  };

  const handeAddTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title?.value;
    const description = form.description?.value;
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const newTask = {
      _id: nanoid(),
      title,
      description,
      status: "TODO",
      date: formattedDate,
      order: tasks.filter((task) => task.status === "TODO").length + 1,
    };

    // Emit task data to WebSocket server
    socket.emit("addTask", newTask);
    if (modalRef.current) {
      modalRef.current.close();
    }

    // Clear form
    form.reset();
  };

  //   working code
  //   function handleDragEnd(event) {
  //     const { active, over } = event;

  //     // if (!activeTask || !overTask) return;

  //     if (!over) return;
  //     const taskId = active.id;
  //     const newStatus = over.id;

  //     setTasks(() =>
  //       tasks.map((task) =>
  //         task.id === taskId ? { ...task, status: newStatus } : task
  //       )
  //     );
  //     const updatedTask = tasks.find((task) => task.id === taskId);
  //     if (updatedTask) {
  //       socket.emit("updateTask", { ...updatedTask, status: newStatus });
  //     }
  //   }

  //. working for moving vertically
  const handleDragEnd = (event) => {
    const { active, over } = event;

    console.log("Active ID (Dragged Task):", active.id);
    console.log("Over ID (Drop Target):", over?.id);

    if (!over) return;

    // Extract the ID of the drop target
    const overId = over.id.id || over.id; // Handle both object and string cases
    console.log("Over ID (Extracted):", overId);

    const activeTask = tasks.find((task) => task._id === active.id);
    console.log("Active Task:", activeTask);

    // Check if the drop target is a task or a column
    const overTask = tasks.find((task) => task.status === overId);
    const overColumn = CULUMNS.find((column) => column.id === overId);

    console.log("Over Task:", overTask);
    console.log("Over Column:", overColumn);

    if (!activeTask) return;

    // Scenario 1: Reordering within the same column
    if (overTask && activeTask.status === overTask.status) {
      console.log("Reordering within the same column");

      // Fetch tasks for the current column without sorting
      const columnTasks = tasks.filter(
        (task) => task.status === activeTask.status
      );

      console.log("Column Tasks (Before Reordering):", columnTasks);
      console.log("overid is here", overId);

      const oldIndex = columnTasks.findIndex((task) => task._id === active.id);
      const newIndex = columnTasks.findIndex((task) => task.status === overId);

      console.log("Old Index:", oldIndex);
      console.log("New Index:", newIndex);

      if (newIndex === -1) {
        console.error(
          "New Index is -1. overId does not match any task in columnTasks."
        );
        return;
      }

      // Reorder tasks
      const reorderedTasks = arrayMove(columnTasks, oldIndex, newIndex);
      console.log("Reordered task", reorderedTasks);

      // Update the order property for each task
      const updatedTasks = tasks.map((task) => {
        if (task.status === activeTask.status) {
          const updatedTask = reorderedTasks.find((t) => t._id === task._id);
          if (updatedTask) {
            const newOrder = reorderedTasks.indexOf(updatedTask) + 1;
            return { ...task, order: newOrder };
          }
        }
        return task;
      });

      console.log("Updated Tasks (After Reordering):", updatedTasks);

      setTasks(updatedTasks);
      socket.emit("updateTasksOrder", updatedTasks);
    }

    // Scenario 2: Moving between columns
    else if (overColumn) {
      console.log("Moving between columns");

      const updatedTasks = tasks.map((task) => {
        if (task._id === active.id) {
          return {
            ...task,
            status: overColumn.id, // Update the status to the new column
            order: tasks.filter((t) => t.status === overColumn.id).length + 1, // Set the order to the last position in the new column
          };
        }
        return task;
      });

      setTasks(updatedTasks);
      socket.emit("updateTaskStatus", {
        ...activeTask,
        status: overColumn.id,
        order: tasks.filter((t) => t.status === overColumn.id).length + 1,
      });
    }
  };

  return (
    <section className="px-12 my-12 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          {CULUMNS.map((culumn) => (
            <Culumns
              key={culumn.id}
              culumn={culumn}
              showMod={showMod}
              tasks={tasks.filter((task) => task.status === culumn.id)}
            ></Culumns>
          ))}
        </DndContext>
      </div>

      {/* modal */}
      {/* You can open the modal using document.getElementById('ID').showModal() method */}

      <dialog ref={modalRef} id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <form onSubmit={handeAddTask} className="card-body">
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
              <input className={`btn btn-primary `} type="submit" value="Add" />
            </div>
          </form>
        </div>
      </dialog>
    </section>
  );
};

export default Taskboard;
