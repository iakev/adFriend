import React from "react";

const TodoWidget = ({ data, onUpdate }) => {
  if (!data) return <div data-testid="todo-widget">Loading tasks...</div>;

  return (
    <div data-testid="todo-widget" className="todo-widget">
      <h3>Tasks ({data.items.length})</h3>
      <ul>
        {data.items.map((task, index) => (
          <li key={index} className={task.completed ? "completed" : ""}>
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoWidget;
