export const formatProfileResponse = (profile) => {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: profile.role,
    gender: profile.gender || 'Not Specified',
    photoProfile: profile.photo_profile, 
    created_at: profile.created_at,
    updated_at : profile.updated_at,
  };
};