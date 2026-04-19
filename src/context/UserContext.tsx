"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export interface UserProfile {
  name: string;
  age: string;
  currentDegree: string;
  targetCountry: string;
  courseInterest: string;
  tuitionFee: string;
  livingExpenses: string;
  loanAmount: string;
}

interface UserContextType {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (key: keyof UserProfile, value: string) => void;
}

const defaultProfile: UserProfile = {
  name: "",
  age: "",
  currentDegree: "B.Tech",
  targetCountry: "US",
  courseInterest: "Computer Science",
  tuitionFee: "45000",
  livingExpenses: "15000",
  loanAmount: "40000",
};

const UserContext = createContext<UserContextType>({
  profile: defaultProfile,
  setProfile: () => {},
  updateProfile: () => {},
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);

  const updateProfile = (key: keyof UserProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <UserContext.Provider value={{ profile, setProfile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
