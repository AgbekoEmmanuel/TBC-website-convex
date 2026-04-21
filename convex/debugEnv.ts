import { query } from "./_generated/server";
import "./auth";

export const getEnv = query({
  args: {},
  handler: async (ctx) => {
    return {
      B64_EXISTS: !!process.env.JWT_PRIVATE_KEY_B64,
      B64_LEN: process.env.JWT_PRIVATE_KEY_B64?.length,
      KEY_EXISTS: !!process.env.JWT_PRIVATE_KEY,
      KEY_START: process.env.JWT_PRIVATE_KEY?.substring(0, 30),
      KEY_END: process.env.JWT_PRIVATE_KEY?.substring(process.env.JWT_PRIVATE_KEY.length - 30),
      KEY_LEN: process.env.JWT_PRIVATE_KEY?.length,
    };
  },
});
