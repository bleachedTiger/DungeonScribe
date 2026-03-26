import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UseAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { AuthResponse } from "../../types";

function Register(){

    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const { login } = UseAuth();
    const navigate = useNavigate();

    useEffect(() => {
    document.title = ' DungeonScribe | Register';
    }, [])


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post<AuthResponse>("/auth/register", {
                email,
                username,
                password,
            })
            login(response.data.token);
            navigate('/campaigns');
        }catch{
            setError('Registration failed. Email may already be in use.');
        }finally{
            setLoading(false);
        }
    }

     return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-amber-500 mb-2 text-center">
          DungeonScribe
        </h1>
        <p className="text-gray-400 text-center mb-8">Create your account</p>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-amber-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
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
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-amber-500 hover:text-amber-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  ) 
}

export default Register