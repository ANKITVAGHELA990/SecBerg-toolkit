import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface Activity {
  id: string;
  timestamp: string;
  toolName: string;
  target: string;
  resultSummary: string;
}

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Omit<Activity, "id" | "timestamp">) => void;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<Activity[]>([]);

  const addActivity = useCallback((activity: Omit<Activity, "id" | "timestamp">) => {
    const newActivity: Activity = {
      ...activity,
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    
    // Add to the beginning of the list and keep only the latest 10 items
    setActivities((prev) => [newActivity, ...prev].slice(0, 10));
  }, []);

  return (
    <ActivityContext.Provider value={{ activities, addActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error("useActivity must be used within an ActivityProvider");
  }
  return context;
}
