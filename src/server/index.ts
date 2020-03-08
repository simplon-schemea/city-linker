import express from "express";
import morgan from "morgan";
import * as path from "path";
import { ROOT } from "../../shared/config";

const app = express();

app.use(morgan("tiny"));
app.use(express.static(path.join(ROOT, "dist/www")));


app.listen(process.env.PORT || 8080);
