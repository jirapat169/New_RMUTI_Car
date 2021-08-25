import React from "react";
import { useRouter } from "next/router";
import Dashboard from "../../components/Dashboard";

const Admin = (props) => {
  const router = useRouter();

  React.useEffect(() => {
    router.replace("/home");
  }, []);

  return (
    <Dashboard {...props}>
      <div className="spinner-border text-primary" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </Dashboard>
  );
};

export default Admin;
