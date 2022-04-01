import React, { useEffect, useState } from 'react';
import { useAuth } from '@hooks/auth';
import { useAppSelector } from 'store';
import { useRouter } from 'next/router';

function withPrivateRoute(Component) {
  const WrapComponent = (props) => {
    const initialized = useAppSelector((state) => state.app.initialized);
    const loggedIn = useAppSelector((state) => state.app.loggedIn);
    const [loading, setLoading] = useState(false);
    const { signIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
      const performsSignIn = async () => {
        try {
          setLoading(true);
          await signIn();
          setLoading(false);
        } catch (e) {
          console.error(e);
          router.push('/');
        }
      };

      if (initialized && !loggedIn) {
        performsSignIn();
      }
    }, [initialized, loggedIn]);

    if (!initialized) {
      return (
        <div className="greyscheme">
          <section className="container">
            <h2 className="text-center pt60">Loading...</h2>
          </section>
        </div>
      );
    }

    if (!loggedIn) {
      return (
        <div className="greyscheme">
          <section className="container">
            <h2 className="text-center pt60">Please sign in</h2>
          </section>
        </div>
      );
    }

    return <Component {...props} />;
  };

  return WrapComponent;
}

export default withPrivateRoute;
