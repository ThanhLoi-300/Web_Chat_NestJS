import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchGroupById, getConversationById } from '../api';

export function useGroupGuard() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const controller = new AbortController();

  useEffect(() => {
    console.log('Fetching Group: '+id);
    setLoading(true);
    fetchGroupById(id!)
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => setLoading(false));

    return () => {
      controller.abort();
    };
  }, [id]);

  return { loading, error };
}