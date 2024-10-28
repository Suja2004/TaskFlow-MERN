import TodoItem from './TodoItem';

const TodoList = ({ todos, fetchTodos }) => {
    return (
        <div className="TodoList">
            {todos.slice().reverse().map((todo) => (
                <TodoItem key={todo._id} todo={todo} fetchTodos={fetchTodos} />
            ))}

        </div>
    );
};

export default TodoList;
