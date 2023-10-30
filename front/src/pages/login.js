import { useState, useEffect } from 'react'
import axios from 'axios'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from "./auth"
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

function Login() {
    const { authenticated, setAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        gender: '',
        birthday: '',
        firstname: '',
        lastname: '',
        confirmPassword: '',
    })

    const [loginData, setLoginData] = useState({
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState({})
    const { userId } = useParams();

    const nav = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleLoginChange = (e) => {
        const { name, value } = e.target
        setLoginData({ ...loginData, [name]: value })
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3000/users/create', formData, {
                headers: {
                'Content-Type': 'application/json',
              }
            })
            if (response.status === 200) {
                setAuthenticated(true);
                const authToken = response.data.authToken;
                const userId = response.data.userId;
                console.log("IDIDIDD", userId);
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('userId', userId)
                document.cookie = `authToken=${authToken}; max-age=${7 * 24 * 60 * 60}; path=/;`;
                nav(`/${userId}`);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data) /* the error messages from the backend */
            }
            console.log('Error: ', error)
        }
    }

    const handleLogin = async (e) => {
        try {
            const response = await axios.post('http://localhost:3000/auth/login', loginData, {
                headers: {
                  'Content-Type': 'application/json',
                },
              }
            );
            console.log('Response status:', response.status);
        
            if (response.status === 200) {
                const authToken = response.data.authToken;
                const userId = response.data.userId;
                localStorage.setItem('authToken', authToken);
                localStorage.setItem('isAuthenticated', true);
                localStorage.setItem('userId', userId)
                setAuthenticated(true);
                document.cookie = `authToken=${authToken}; max-age=${7 * 24 * 60 * 60}; path=/;`;
                nav(`/${userId}`);
            }
            
        } catch (error) {
            if (error.response && error.response.data) {
                setErrors(error.response.data); // Display error messages to the user
                console.log(error.message)
              }
              console.error('Error: ', error);
            }
        }

    if (authenticated) {
        return <Navigate to="/:userId" replace/>;
    } else {
        return (
        <div className="identification">
            <div className='form-container form-login'>
                <h2 className='loginText'>Login</h2>
                <form action='/login' method='POST' className='id-form'>
                    <div>
                        <label className='form-label'>Username</label>
                        <input placeholder='Username' name='username' value={loginData.username} onChange={(e) => handleLoginChange(e)} className='form-input' type="email" required />
                    </div>
                    <div>
                        <label className='form-label'>Password:</label>
                        <input placeholder='Password' name='password' value={loginData.password} onChange={(e) => handleLoginChange(e)} className='form-input' type="password" required />
                    </div>
                    <div>
                        <button className='form-button' type="submit" onClick={(e) => handleLogin(e)}>Login</button>
                    </div>
                </form>
            </div>
            <div className='form-container form-signup'>
                <h2 className='signupText'>Signup</h2>
                <form onSubmit={(e) => handleSubmit(e)} action='/create' method='POST' className='id-form'>
                    <div className="form-flex">
                        <div className="form-column">
                            <div>
                                <label className='form-label'>First Name:</label>
                                <input onChange={handleChange} value={formData.firstname} placeholder='First Name' type="text" className="form-input" name="firstname" required />
                            </div>
                            <div>
                                <label className='form-label'>Last Name:</label>
                                <input onChange={handleChange} value={formData.lastname} placeholder='Last Name' type="text" className="form-input" name="lastname" required />
                            </div>
                            <div>
                                <label className='form-label'>Birthday:</label>
                                <input onChange={handleChange} value={formData.birthday} min="1900-01-01" max="2023-01-01" type="date" className="form-input" name='birthday' required
                                />
                            </div>
                            <div>
                                <label className='form-label'>Gender:</label>
                                <select onChange={handleChange} value={formData.gender} className="form-input" name="gender" required>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-column">
                            <div>
                                <label className='form-label'>Username:</label>
                                <input onChange={handleChange} value={formData.username} placeholder='Username' name='username' className='form-input' type="username" required />
                                {errors && errors.error && errors.error.includes("Username") && <p className="error-message">{errors.error}</p>}
                            </div>
                            <div>
                                <label className='form-label'>Email:</label>
                                <input onChange={handleChange} value={formData.email} placeholder='Email' name='email' className='form-input' type="email" required />
                                {errors && errors.error && errors.error.includes("Email") && <p className="error-message">{errors.error}</p>}
                                
                            </div>
                            <div>
                                <label className='form-label'>Password:</label>
                                <input onChange={handleChange} value={formData.password} placeholder='Password' name='password' className='form-input' type="password" required />
                            </div>
                            <div>
                                <label className='form-label'>Confirm Password:</label>
                                <input onChange={handleChange} value={formData.confirmPassword} placeholder='Confirm Password' type="password" name='confirmPassword' className="form-input" required/>
                                {errors && errors.error && errors.error.includes("Passwords") && <p className="error-message">{errors.error}</p>}
                            </div>
                        </div>
                    </div> 
                    <button className='form-button' type="submit">Signup</button>
                </form>
            </div>
        </div> 
        )
    }
}

export default Login