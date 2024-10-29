import { useState } from 'react';
import axios from 'axios';

const TodoForm = ({ fetchTodos }) => {
    const [text, setText] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text) return;

        try {
            const token = localStorage.getItem('token');
            await axios.post('https://dcinfotech-task-6-7-backend.onrender.com/todos', { text }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchTodos();
            setText('');
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input className='TodoForm'
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Add a new to-do"
            />
            <button className='todo-btn' type="submit">Add</button>
        </form>
    );
};

export default TodoForm;
