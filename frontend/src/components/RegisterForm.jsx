import { useState } from 'react';
import axios from 'axios';

const RegisterForm = ({ onRegister }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');

    const checkPasswordStrength = (password) => {
        const minLength = password.length >= 8;
        const hasNumber = /\d/.test(password);
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const strength = [minLength, hasNumber, hasUpper, hasLower, hasSpecial].filter(Boolean).length;
        
        if (strength === 5) return 'Strong';
        if (strength >= 3) return 'Medium';
        return 'Weak';
    };

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        setPasswordStrength(checkPasswordStrength(newPassword));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (passwordStrength === 'Weak') {
            setError('Please choose a stronger password.');
            return;
        }

        try {
            setError('');
            await axios.post('https://todo-backend-lyart.vercel.app/register', {
                username,
                password,
            });
            onRegister();
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setError('Username already taken');
            } else {
                setError('Registration failed. Please try again.');
            }
            console.error('Registration failed:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='Login'>
            <input
                className='todo-input'
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                required
            />
            <input
                className='todo-input'
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                required
            />
            <p className={`password-strength ${passwordStrength.toLowerCase()}`}>
                Password strength: {passwordStrength}
            </p>
            <button className='todo-btn' type="submit">Register</button>
            {error && <p className='error-message'>{error}</p>}
        </form>
    );
};

export default RegisterForm;
