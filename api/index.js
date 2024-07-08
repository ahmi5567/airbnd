import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import UserModel from "./models/User.js";
import PlaceModel from "./models/Place.js";
import Booking from "./models/Booking.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader";
import { fileURLToPath } from "url";
import { dirname } from "path";
import multer from "multer";
import fs from "fs";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use("/uploads", express.static(`${__dirname}/uploads`));
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());

// MONGODB CONNECTION
await mongoose.connect(process.env.MONGO_URL);
console.log("Database is connected");

// MONGODB CONNECTION ERROR
mongoose.connection.on("error", (error) => {
  console.log(error);
});

// TEST ROUTE
app.get("/test", (req, res) => {
  res.json("Hello World");
});

// REGISTER ROUTE
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const createdUser = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, 10),
    });

    res.json(createdUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

// LOGIN ROUTE
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  if (user) {
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (isPasswordValid) {
      jwt.sign(
        { email: user.email, id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "30d" },
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, {
              httpOnly: true,
              maxAge: 1000 * 60 * 60 * 24 * 30,
              sameSite: "strict",
            })
            .json(user);
        }
      );
    } else {
      res.status(400).json("invalid password");
    }
  } else {
    res.json("not found");
  }
});

// PROFILE ROUTE

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await UserModel.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

// LOGOUT ROUTE

app.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) }).json(true);
});

// UPLOAD BY LINK PHOTO
app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  const options = {
    url: link,
    dest: `${__dirname}/uploads/${newName}`,
    timeout: 30000, // Set timeout to 30 seconds
  };

  try {
    await imageDownloader.image(options);
    res.json(newName);
  } catch (error) {
    if (error.code === "ETIMEDOUT") {
      res.status(408).json({ error: "Request timed out" });
    } else {
      res.status(500).json({ error: "Failed to download image" });
    }
  }
});

// UPLOAD PHOTO FROM DEVICE
const photosMiddleware = multer({ dest: `${__dirname}/uploads/` });

app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const filenames = req.files.map((file) => {
    const extension = file.originalname.split(".").pop();
    const newFilename = `${file.filename}.${extension}`;
    fs.renameSync(file.path, `${file.destination}/${newFilename}`);
    return newFilename;
  });
  res.json(filenames);
});

// UPLOAD FORM DATA

app.post("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    addedPhotos,
  } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err;
    const newPlace = await PlaceModel.create({
      owner: userData.id,
      title,
      address,
      description,
      photos: addedPhotos,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(newPlace);
  });
});

// GET THE PLACES

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    const { id } = userData;
    const places = await PlaceModel.find({ owner: id });
    res.json(places);
  });
});

// GET PLACE BY ID

app.get("/places/:id", async (req, res) => {
  const { id } = req.params;
  const place = await PlaceModel.findById(id);
  res.json(place);
});

// PUT PLACE BY ID

app.put("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
    addedPhotos,
  } = req.body;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err;
    const place = await PlaceModel.findById(id);
    if (userData.id === place.owner.toString()) {
      place.set({
        title,
        address,
        description,
        photos: addedPhotos,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await place.save();
      res.json(place);
    } else {
      res.status(401).json("You are not allowed to update this place");
    }
  });
});

// GET PLACES FOR ALL USER

app.get("/places", async (req, res) => {
  const places = await PlaceModel.find();
  res.json(places);
});


async function getUserDataFromToken(req) {
  try {
    const userData = await jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    return userData;
  } catch (err) {
    throw err;
  }
}

// SAVE THE BOOKINGS
app.post("/bookings", async (req, res) => {
  const userData = await getUserDataFromToken(req)
  const { place, checkIn, checkOut, numberOfGuests, name, phone, price } = req.body;
  try {
    const doc = await Booking.create({
      place,
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      user:userData.id,
      price,
    });
    res.json(doc);
  } catch (err) {
    throw err;
  }
});

// FUNCTIOIN TO GET THE TOKEN


// GET THE BOOKING
app.get("/bookings", async (req, res) => {
  const userData = await getUserDataFromToken(req)
  res.json( await Booking.find({user:userData.id}).populate('place'))
});

// PORT LISTENING
app.listen(4000, () => {
  console.log("Server is running on port 4000");
});
