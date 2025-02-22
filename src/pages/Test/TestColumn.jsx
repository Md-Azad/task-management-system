import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TestCard from "./TestCard";

const TestColumn = ({ tasks }) => {
  return (
    <div>
      <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
        {tasks.map((task) => (
          <TestCard id={task._id} title={task.title} key={task._id} />
        ))}
      </SortableContext>
    </div>
  );
};

export default TestColumn;
