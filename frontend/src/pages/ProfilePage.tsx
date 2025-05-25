import { useEffect, useState } from "react";
import ProfileComponent from "../ProfileComponent";
const apiUrl = import.meta.env.VITE_BACKEND_URL;

// Definizione del tipo per il profilo utente
interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  instagram_link?: string;
  youtube_link?: string;
  facebook_link?: string;
  tiktok_link?: string;
}

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // Recupera il token JWT dal localStorage
        if (!token) {
          setError("Non sei loggato.");
          return;
        }

        const response = await fetch(`${apiUrl}/api/profile`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Invia il token JWT nell'header Authorization
          },
        });

        if (response.status === 401) {
          setError("Non sei loggato.");
          return;
        }

        if (!response.ok) {
          throw new Error("Errore durante il recupero del profilo.");
        }

        const data: UserProfile = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error(err);
        const token = localStorage.getItem("token");
        console.log("Token recuperato:", token);
        setError("Errore durante il recupero del profilo.");
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div>{error} Prova ad accedere da qui <a href="/login">Accedi</a></div>;
  }

  if (!userProfile) {
    return <div>Caricamento...</div>;
  }

  return (
    <div>
      <h1>PROFILO</h1>
      <ProfileComponent userId={userProfile.id} />
    </div>
  );
};

export default ProfilePage;