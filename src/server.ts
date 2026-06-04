import app from "./app.ts";
import { env } from "./env.ts";
const PORT = env["PORT"];

app.listen(PORT, async () => {
 console.log("El servidor corriendo en el puerto: ", PORT);

});
