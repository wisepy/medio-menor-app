import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [dailyPhoto, setDailyPhoto] = useState(null);
  const [treasury, setTreasury] = useState(null);

  const isLoggedIn = !!token;

  const loadAll = useCallback(async () => {
    setLoading(true);

    try {
      const [me, announcementsData, eventsData, photosData, dailyPhotoData, treasuryData] =
        await Promise.all([
          api.get("/api/auth/me"),
          api.get("/api/announcements"),
          api.get("/api/events"),
          api.get("/api/photos"),
          api.get("/api/photos/daily"),
          api.get("/api/treasury"),
        ]);

      setUser(me);
      setAnnouncements(announcementsData);
      setEvents(eventsData);
      setPhotos(photosData);
      setDailyPhoto(dailyPhotoData);
      setTreasury(treasuryData);
    } catch {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadAll();
    } else {
      setLoading(false);
    }
  }, [token, loadAll]);

  async function login(email, password) {
    const { token: newToken, user: profile } = await api.post("/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", newToken);
    setUser(profile);
    setToken(newToken);

    return profile;
  }

  async function updateProfile({ name, email, currentPassword, newPassword }) {
    const { token: newToken, user: profile } = await api.put("/api/auth/me", {
      name,
      email,
      currentPassword,
      newPassword: newPassword || undefined,
    });

    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(profile);

    return profile;
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAnnouncements([]);
    setEvents([]);
    setPhotos([]);
    setDailyPhoto(null);
    setTreasury(null);
  }

  const child = user?.children?.[0] || null;

  const notifications = {
    unread: announcements.filter((item) => item.status !== "Leído").length,
  };

  async function addAnnouncement({ title, text, type }) {
    await api.post("/api/announcements", {
      title,
      text,
      important: type === "Importante",
    });

    setAnnouncements(await api.get("/api/announcements"));
  }

  async function markAnnouncementRead(id) {
    await api.post(`/api/announcements/${id}/read`);
    setAnnouncements(await api.get("/api/announcements"));
  }

  async function addEvent({ title, date, time, description, confirm }) {
    const fullDescription = time ? `${description} (Hora: ${time})` : description;

    await api.post("/api/events", {
      title,
      date,
      description: fullDescription,
      confirm,
    });

    setEvents(await api.get("/api/events"));
  }

  async function addPhoto({ title, description, activity, file }) {
    const formData = new FormData();
    formData.append("title", title);
    if (description) formData.append("description", description);
    if (activity) formData.append("activity", activity);
    if (file) formData.append("image", file);

    await api.postForm("/api/photos", formData);

    const [photosData, dailyPhotoData] = await Promise.all([
      api.get("/api/photos"),
      api.get("/api/photos/daily"),
    ]);

    setPhotos(photosData);
    setDailyPhoto(dailyPhotoData);
  }

  async function likeDailyPhoto() {
    if (!dailyPhoto?.id) return;

    const { likes } = await api.post(`/api/photos/${dailyPhoto.id}/like`);
    setDailyPhoto((prev) => (prev ? { ...prev, likes } : prev));
  }

  async function addTreasuryMovement({ type, title, amount }) {
    await api.post("/api/treasury/movements", { type, title, amount });
    setTreasury(await api.get("/api/treasury"));
  }

  return (
    <AppContext.Provider
      value={{
        user,
        child,
        notifications,
        loading,

        isLoggedIn,
        login,
        logout,
        updateProfile,

        announcements,
        addAnnouncement,
        markAnnouncementRead,

        events,
        addEvent,

        photos,
        dailyPhoto,
        addPhoto,
        likeDailyPhoto,

        treasury,
        addTreasuryMovement,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
