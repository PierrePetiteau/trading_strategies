import { useRouter } from "next/router";
import { useEffect } from "react";

const RedirectPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/project/introduction");
  }, []);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default RedirectPage;
