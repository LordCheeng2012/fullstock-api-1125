
import session from "express-session";
const maxAge = 7*24*60*60*1000;
export const sessionMidleware = session({
    secret:process.env["SESSION_SECRET_STATE"] ?? "secreto_default",
    resave:false,
    saveUninitialized:false,
    cookie :{httpOnly:true,maxAge }
});
