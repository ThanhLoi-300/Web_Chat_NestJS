import { useContext, useEffect, useState } from 'react';
import { getUser, updateToken } from '../api';
import { AuthContext } from '../context/AuthContext';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { user, updateAuthUser } = useContext(AuthContext);
  const controller = new AbortController();

  useEffect(() => {
    updateToken();
    getUser()
      .then(({ data }) => {
        console.log("data: "+ JSON.stringify(data))
        updateAuthUser(data);
        setTimeout(() => setLoading(false), 1000);
      })
      .catch((err) => {
        console.log(err);
        setTimeout(() => setLoading(false), 1000);
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { user, loading };
}