import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./router";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n";
import { useEffect, useState } from "react";
import { supabase } from "./utils/supabaseClient";

function App() {
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    // Initialize auth
    const initAuth = async () => {
      try {
        // Set a timeout to prevent infinite loading
        const timeoutId = setTimeout(() => {
          console.warn('Auth check timeout - proceeding anyway');
          setIsAuthReady(true);
        }, 3000);

        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Ensure user data is in database (non-blocking)
          const upsertUser = async () => {
            try {
              await supabase.from('users').upsert({
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                role: session.user.user_metadata?.role,
                updated_at: new Date().toISOString()
              }, { onConflict: 'id' });
            } catch (err) {
              console.error('User upsert error:', err);
            }
          };
          upsertUser();
        }
        
        clearTimeout(timeoutId);
        setIsAuthReady(true);
      } catch (error) {
        console.error('Auth init error:', error);
        setIsAuthReady(true);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // Save/update user in database
        const userData: any = {
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
          updated_at: new Date().toISOString()
        };

        if (session.user.user_metadata?.role) {
          userData.role = session.user.user_metadata.role;
        }

        const upsertUser = async () => {
          try {
            await supabase.from('users').upsert(userData, { onConflict: 'id' });
          } catch (err) {
            console.error('User upsert error:', err);
          }
        };
        upsertUser();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show loading while checking auth
  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-teal-600 animate-spin"></i>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <I18nextProvider i18n={i18n}>
      <BrowserRouter basename={__BASE_PATH__}>
        <AppRoutes />
      </BrowserRouter>
    </I18nextProvider>
  );
}

export default App;