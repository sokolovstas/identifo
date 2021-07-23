// @ts-ignore
import { IdentifoAuth } from "@identifo/identifo-auth-js";

export const identifo = new IdentifoAuth({
  // issuer: 'http://localhost:8081',
  appId: "c3qn2t0em84rn76pap2g",
  url: "http://localhost:8081",
  scopes: ["offline"],
  autoRenew: true,
  redirectUri: "http://localhost:5000/callback",
  // postLogoutRedirectUri:'http://localhost:5000'
});
