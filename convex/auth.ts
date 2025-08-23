import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth } from '@convex-dev/auth/server';
import { ConvexError } from 'convex/values';
import { ResendOTP } from './ResendOTP';

export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    Password({
      profile(params) {
        return {
          email: params.email as string,
          name: params.name as string,
        };
      },
      reset: ResendOTP,
      validatePasswordRequirements(password: string) {
        if (password.length < 8) {
          throw new ConvexError("Password must be at least 8 characters long");
        }
      },
    }),
    ResendOTP,
  ],
});
