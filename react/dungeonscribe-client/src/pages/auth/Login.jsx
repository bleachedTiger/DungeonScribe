import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UseAuth } from '../../context/AuthContext';
import api from '../../api/axios';

function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = UseAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try{
            const response = await api.post('/auth/login', {email, password});
            login(response.data.token);
            navigate('/campaigns');
        }catch{
            setError('Invalid email or password');
        }finally{
            setLoading(false);
        }
    }

    return(
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-amber-500 mb-2 text-center">
                    DungeonScribe
                </h1>
                <p className="text-gray-400 text-center mb-8">Sign in to your account</p>

                {error &&(
                    <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
                    {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-300 text-sm font-medium mb-1">
                            Email
                        </label>
                        <input 
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
                            required
                        />  
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-300 text-sm font-medium mb-1">
                            Password
                        </label>
                        <input 
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-4 rounded transition-colors disabled:opacity-50"
                    >
                        { loading ? "Signing In..." : "Sign In" }
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-6">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-amber-500 hover:text-amber-400">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login