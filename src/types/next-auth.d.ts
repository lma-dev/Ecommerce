// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

// Extending the NextAuth session type
declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      role: string;
      token: string;
      tokenType: string;
    };
  }

  interface User extends DefaultUser {
    id: number;
    name: string;
    role: string;
    token: string;
    tokenType: string;
  }


}
