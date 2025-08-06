import React from 'react';
import ProfileComponent from "../ProfileComponent";

const ProfilePage: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Profilo Utente</h1>
      <ProfileComponent />
    </div>
  );
};

export default ProfilePage;