import { closestCorners, DndContext } from "@dnd-kit/core";

import TestColumn from "./TestColumn";
import { arrayMove } from "@dnd-kit/sortable";
import { useState } from "react";

const Test = () => {
  const data = [
    { id: 1, title: "task1" },
    { id: 2, title: "task2" },
    { id: 3, title: "task3" },
  ];
  const [tasks, setTasks] = useState(data);

  const getTaskPos = (id) => tasks.findIndex((task) => task.id === id);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id === over.id) return;

    setTasks((tasks) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);
      return arrayMove(tasks, originalPos, newPos);
    });
  };

  console.log(tasks);
  return (
    <div
      onDragEnd={handleDragEnd}
      className="border-2 border-red-700 w-1/2 mx-auto"
    >
      <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCorners}>
        <TestColumn tasks={tasks} />
      </DndContext>
    </div>
  );
};

export default Test;
