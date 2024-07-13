import { useCallback, useEffect } from "react";

import { withModalScreen } from "@showtime-xyz/universal.modal-screen";
import { useRouter } from "@showtime-xyz/universal.router";

import { Login } from "app/components/login";
import { createParam } from "app/navigation/use-param";

type Query = {
  redirect_url: string;
};

const { useParam } = createParam<Query>();

function LoginModal() {
  //#region hooks
  const [redirect_url] = useParam("redirect_url");
  const router = useRouter();
  //#endregion

  //#region callbacks
  const handleOnLogin = useCallback(() => {
    if (redirect_url && redirect_url.length > 0) {
      /**
       * TODO: we need to get rid off this.
       */
      router.pop();
      router.push(decodeURIComponent(redirect_url));
    } else {
      router.pop();
    }
  }, [redirect_url, router]);
  //#endregion

  // Check if 'wallet' is present in localStorage, if so, close the modal
  useEffect(() => {
    const wallet = localStorage.getItem("wallet");
    if (wallet) {
      router.pop(); // Close the modal
    }
  }, [router]);

  return <Login onLogin={handleOnLogin} />;
}

export const LoginScreen = withModalScreen(LoginModal, {
  title: "Sign In",
  matchingPathname: "/login",
  matchingQueryParam: "loginModal",
  snapPoints: ["90%"],
  web_height: `max-h-[100vh] md:max-h-[95vh]`,
  disableBackdropPress: true,
});
