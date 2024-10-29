import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';

const TodoItem = ({ todo, fetchTodos }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(todo.text);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            const token = localStorage.getItem('token');
            await axios.delete(`https://dcinfotech-task-6-7-backend.onrender.com/todos/${todo._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todo:', error);
        } finally {
            setIsDeleting(false);
        }
    };
    const handleComplete = async () => {
        try {
            const token = localStorage.getItem('token');

            await axios.put(`https://dcinfotech-task-6-7-backend.onrender.com/todos/${todo._id}/complete`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            fetchTodos();

        } catch (error) {
            console.error('Error completing todo:', error);
        }
    };

    const handleEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log(token);
            await axios.put(`https://dcinfotech-task-6-7-backend.onrender.com/todos/${todo._id}`, { text: newText }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            fetchTodos();
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    return (
        <div className={`Todo ${isDeleting ? 'slide-out' : ''}`}>
            {isEditing ? (
                <div className='TodoEdit'>
                    <input className='TodoEdit'
                        type="text"
                        value={newText}
                        onChange={(e) => setNewText(e.target.value)}
                    />
                    <button className='save-btn' onClick={handleEdit}>Save</button>
                </div>
            ) : (
                <>
                    <span onClick={handleComplete} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                        {todo.text}
                    </span>
                    <div className="todo-buttons">
                        <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => setIsEditing(true)}
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                        />
                        <FontAwesomeIcon
                            className='del-btn'
                            icon={faTrash}
                            onClick={handleDelete}
                            style={{ cursor: 'pointer', color: '#dc3545' }}
                        />

                    </div>
                </>
            )}
        </div>
    );
};

export default TodoItem;
