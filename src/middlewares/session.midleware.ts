import { env } from "../env.ts";
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "../db/connections/pool/conections.ts";
import { SESSION_COOKIE_NAME } from "../lib/session.ts";

const PgStore = pgSession(session);
const maxAge = 7*24*60*60*1000;

export const sessionMidleware = session({
    name: SESSION_COOKIE_NAME,
    store: new PgStore({ pool }),
    secret:env["SESSION_SECRET_STATE"] ?? "secreto_default",
    resave:false,
    saveUninitialized:false,
    cookie :{httpOnly:true,maxAge }
});
