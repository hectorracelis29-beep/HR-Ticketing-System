import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { ref, onValue, set } from "firebase/database";
import { serverTimestamp } from "../../lib/firebase";
import { auth, database } from "../../lib/firebase";
import { User as AppUser, UserRole } from "../data/mockData";

interface AuthContextType {
  user: AppUser | null;
  officers: AppUser[];
  loading: boolean;
  profileLoading: boolean;
  hasPermission: (permission: string) => boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [officers, setOfficers] = useState<AppUser[]>([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      setLoading(false);

      if (fbUser) {
        setProfileLoading(true);
        // Fetch user role/profile from DB
        const userRef = ref(database, `users/${fbUser.uid}`);
        const unsubscribeUser = onValue(userRef, (snapshot) => {
          const dbUserData = snapshot.val() as any;
          setProfileLoading(false);
          if (dbUserData) {
            setUser({
              uid: fbUser.uid,
              email: fbUser.email || '',
              employeeId: dbUserData.employeeId,
              name: dbUserData.name || fbUser.email?.split('@')[0] || 'User',
              role: dbUserData.role as UserRole,
              department: dbUserData.department,
              assignedCategories: dbUserData.assignedCategories,
            });
          } else {
            // Auto-create default profile for first-time login
            const defaultProfile = {
              name: fbUser.email?.split('@')[0] || 'New Employee',
              email: fbUser.email || '',
              employeeId: `EMP-${fbUser.uid.slice(-4).toUpperCase()}`,
              role: 'employee' as UserRole,
              department: 'General',
              assignedCategories: [],
              createdAt: serverTimestamp()
            };
            set(ref(database, `users/${fbUser.uid}`), defaultProfile).then(() => {
              setUser({
                uid: fbUser.uid,
                email: fbUser.email || '',
                employeeId: defaultProfile.employeeId,
                name: defaultProfile.name,
                role: 'employee',
                department: 'General',
                assignedCategories: [],
              });
            }).catch((err: any) => {
              console.error('Failed to create profile:', err);
              setUser(null);
            });
          }
        });
        return () => unsubscribeUser();
      } else {
        setUser(null);
        setProfileLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const role = user.role;

    const permissions: Record<UserRole, string[]> = {
      employee: [
        "create_ticket",
        "view_own_tickets",
        "comment_own_tickets",
      ],
      officer: [  // Mapped hr -> officer
        "view_assigned_tickets",
        "update_ticket_status",
        "add_comments",
        "view_own_tickets",
        "create_ticket",
        "comment_own_tickets",
      ],
      admin: [
        "view_all_tickets",
        "reassign_tickets",
        "manage_categories",
        "manage_users",
        "manage_officer_assignments",
        "update_ticket_status",
        "add_comments",
        "create_ticket",
        "view_own_tickets",
        "comment_own_tickets",
      ],
    };

    return permissions[role]?.includes(permission) || false;
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  // Load all officers realtime
  useEffect(() => {
    const usersRef = ref(database, 'users');
    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const usersList: AppUser[] = Object.entries(data).map(([uid, u]: [string, any]) => ({
        uid,
        ...u
      })).filter((u: AppUser) => u.role === 'officer');
      setOfficers(usersList);
    });
    return () => unsubscribeUsers();
  }, []);

  return (
    <AuthContext.Provider value={{ user, officers, loading, profileLoading, hasPermission, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
