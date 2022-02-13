import { useContext, useEffect } from "react";

import { AuthContext } from "../context/AuthContext";
import { setupAPIClient } from "../services/api";
import { api } from "../services/apiClient";
import { withSSRAuth } from "../utils/withSSRAuth";

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get('me')
    .then(response => console.log('response: ', response))
    .catch(err => console.error('err: ', err));
  }, [])

  return (
    <div>
      <h1>
        Dashboard: {user?.email}
      </h1>
    </div>
  );
}

export const getServerSideProps = withSSRAuth(async(ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get('/me');

  console.log('response:', response.data)

  return {
    props: {},
  }
})