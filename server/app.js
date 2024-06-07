const express = require("express");
const app = express();
require('dotenv').config();

const cors = require("cors"); //cross origin
const {default: mongoose} = require("mongoose"); 

app.use(cors({origin: true}));
app.use(express.json());

app.get("/", (req, res) => {
    return res.json("Hi There....")
})

//user authentication route
const userRoute = require("./routes/auth")
//neu co bat cu thu gi di qua route nay navigate toi userRoute
app.use("/api/users/", userRoute);

//Artist routes
const artistsRoutes = require("./routes/artists");
app.use("/api/artists/", artistsRoutes);

//Albums routes
const albumRoutes = require("./routes/albums");
app.use("/api/albums/", albumRoutes);

//Songs routes
const songRoutes = require("./routes/songs");
app.use("/api/songs/", songRoutes);

//tranh depreciation warning
mongoose.connect(process.env.DB_STRING, {useNewUrlParser: true});
mongoose.connection
.once("open", () => console.log("Connected"))
.on("error", (error) => {
    console.log(`ERROR: ${error}`);
})

app.listen(4000, () => console.log("Listening to port 4000"));