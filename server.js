import express from "express";
import routes from "./routes/index.js";
import path from "path";
import fileupload from "express-fileupload";
import cors from "cors"
const app = express();

const PORT = process.env.PORT || 4001;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(fileupload());


// const corsOptions = {
//   origin: ['http://localhost:3000',
//     "https://reverseimgsearch.com",
//     "https://ris-frontend-zl18.vercel.app/",
//     "https://reverseimgsearchfrontend.herokuapp.com"],
//   credentials: true
// }

var whitelist = ['http://localhost:3000', "reverseimgsearch.com", 'https://reverseimgsearchfrontend.herokuapp.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}
app.use(cors(corsOptions))

app.use(routes);

function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV !== "development"
  ) {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}
app.use(requireHTTPS);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
