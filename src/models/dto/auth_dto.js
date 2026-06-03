export const formatAuthResponse = (session, user) => {
  return {
    userId: user.id, 
    name: user.user_metadata?.name || 'Unknown', 
    accessToken: session.access_token, 
    refreshToken: session.refresh_token, 
  };
};