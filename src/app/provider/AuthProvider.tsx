import { supabase } from "../../lib/supabase";
import { Session, Subscription } from "@supabase/supabase-js";
import { useRootNavigationState, router, usePathname } from "expo-router";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type AuthData = {
  session: Session | null;
  profile: any;
  loading: boolean;
};

const AuthContext = createContext<AuthData>({
  session: null,
  profile: null,
  loading: true,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("useEffect triggered");

    const fetchSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          setSession(session);
          console.log("current session:", session);

          // Fetch profile
          const { data: profile, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error) {
            throw error;
          }

          setProfile(profile || null);
          console.log("user profile:", profile);
        } else {
          console.log("no user");
          setLoading(false);
        }
      } catch (error) {
        setProfile(null);
        console.error("Error fetching session or profile:", error);
        setLoading(false);
      }
    };

    // Fetch session and profile on component mount
    fetchSession();

    // Set up listener for authentication state changes
    const unsubscribe = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state change:", _event, session);
      if (session) {
        setSession(session);
        router.push("/(tabs)/MealPlan/");
      } else {
        setProfile(null);
        console.log("no user");
        router.replace("../../welcome");
      }
    });

    // Clean up listener on component unmount
    return () => {
      unsubscribe;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading, profile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
