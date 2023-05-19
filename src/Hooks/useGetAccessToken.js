import { useAuth0 } from "@auth0/auth0-react";

const useGetAccessToken = () => {
  const { getAccessTokenSilently } = useAuth0();

  return () =>
    getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUDIENCE,
        scope: "read:current_user",
      },
    });
};

export default useGetAccessToken;
