import { useQuery, useReactiveVar } from "@apollo/client";
import { useEffect } from "react";
import { graphql } from "../gql";
import { isLoggedInVar, logUserOut } from "../apollo";

const ME_QUERY = graphql(`
  query me {
    me {
      profile {
        ...UserFragment
      }
    }
  }
`);

// function to check if user's token is valid
function useUser() {
  // check if token exists in local storage
  const hasToken = useReactiveVar(isLoggedInVar);
  // query function to fetch currently logged in user data
  const { data } = useQuery(ME_QUERY, {
    skip: !hasToken, // skip if user doesn't have a token
  });

  useEffect(() => {
    if (data?.me.profile === null) {
      // if the token exist but no user was found because token is faulty
      logUserOut();
    }
  }, [data]);
  return { data };
}

export default useUser;
