import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';

function DebugAuth() {
  const { user, token } = useAuth();
  const [decodedToken, setDecodedToken] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Authentication Debug</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User from Context</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Token</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
          {token || 'No token'}
        </pre>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Decoded Token</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {decodedToken ? JSON.stringify(decodedToken, null, 2) : 'No token to decode'}
        </pre>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">localStorage</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify({
            user: localStorage.getItem('user'),
            token: localStorage.getItem('token')
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default DebugAuth;
