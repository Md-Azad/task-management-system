import { useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";

import io from "socket.io-client";
import Culumns from "./Culumns";
import { DndContext } from "@dnd-kit/core";

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

  const handeAddTask = (e) => {
    e.preventDefault();
    const form = e.target;
    const title = form.title.value;
    const description = form.description.value;
    const today = new Date();

    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;

    const newTask = {
      id: nanoid(),
      title,
      description,
      status: "TODO",
      date: formattedDate,
    };

    // Emit task data to WebSocket server
    socket.emit("addTask", newTask);
    if (modalRef.current) {
      modalRef.current.close();
    }

    // Clear form
    form.reset();
  };
  useEffect(() => {
    socket.on("tasksUpdated", (updatedTasks) => {
      setTasks(updatedTasks);
    });

    return () => {
      socket.off("tasksUpdated");
    };
  }, []);

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id;
    const newStatus = over.id;
    console.log(taskId, newStatus);
    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
    const updatedTask = tasks.find((task) => task.id === taskId);
    if (updatedTask) {
      socket.emit("updateTask", { ...updatedTask, status: newStatus });
    }
  }

  return (
    <section className="px-12 my-12 ">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DndContext onDragEnd={handleDragEnd}>
          {CULUMNS.map((culumn) => (
            <Culumns
              key={culumn.id}
              culumn={culumn}
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
