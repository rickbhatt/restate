import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { createContext, ReactNode, useContext } from "react";

// Define the UserProfile interface
interface UserProfile {
  _creationTime: number;
  _id: Id<"users"> | string;
  clerkId: string;
  email: string;
  fullName?: string;
  imageUrl?: string;
}

// Define the context type
interface UserProfileContextType {
  userProfile: UserProfile | null | undefined;
}

// Create the context with a default value
const UserProfileContext = createContext<UserProfileContextType>({
  userProfile: null,
});

// Create the provider component
export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const userProfile = useQuery(api.users.getAuthenticatedUserProfile);

  return (
    <UserProfileContext.Provider value={{ userProfile }}>
      {children}
    </UserProfileContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext);

  if (context === undefined) {
    throw new Error("useUserProfile must be used within a UserProfileProvider");
  }

  return context;
};
