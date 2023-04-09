import { useRouter } from 'next/router';
import { useEffect } from 'react';

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Perform your redirection logic here
    router.push('/project/introduction'); // Redirect to '/new-page'
  }, []);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default RedirectPage;
