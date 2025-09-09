import { useState, useEffect } from "react";

const STORAGE_KEY = "userLoginDates";

function useLoginDates() {
  const [loginDates, setLoginDates] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setLoginDates(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    if (!loginDates.includes(today)) {
      const updated = [...loginDates, today];
      setLoginDates(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  }, [loginDates]);

  return loginDates;
}

export default useLoginDates;
