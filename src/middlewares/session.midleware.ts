
import session from "express-session";
import pgSession from "connect-pg-simple";
import { pool } from "../db/connections/pool/conections.ts";


const PgStore = pgSession(session);
const maxAge = 7*24*60*60*1000;

export const sessionMidleware = session({
     store: new PgStore({ pool }),
    secret:process.env["SESSION_SECRET_STATE"] ?? "secreto_default",
    resave:false,
    saveUninitialized:false,
    cookie :{httpOnly:true,maxAge }
});
