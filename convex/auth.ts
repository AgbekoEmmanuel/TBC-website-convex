import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

if (process.env.JWT_PRIVATE_KEY_B64) {
  process.env.JWT_PRIVATE_KEY = atob(process.env.JWT_PRIVATE_KEY_B64);
}

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [Password],
});
