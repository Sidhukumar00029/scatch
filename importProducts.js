const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const csv = require("csv-parser");
// const Product = require("./models/Product"); // Adjust if path differs

const productModel = require("./models/product-model");
// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/scatch", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  importCSV();
});

// CSV Import Logic
function importCSV() {
  const products = [];

  fs.createReadStream("products.csv")
    .pipe(csv())
    .on("data", (row) => {
      try {
        const imagePath = path.resolve(__dirname, "images", row.image + ".png"); // assumes .jpg extension
        const imageBuffer = fs.readFileSync(imagePath);

        products.push({
          name: row.name,
          price: parseFloat(row.price),
          bgcolor: row.bgcolor,
          panelcolor: row.panelcolor,
          textcolor: row.textcolor,
          availability: row.availability.toLowerCase() === "true", // convert to boolean
          discount: parseFloat(row.discount),
          category: row.category,
          image: imageBuffer,
        });
      } catch (err) {
        console.error(`Error processing row:`, row, "\n", err.message);
      }
    })
    .on("end", async () => {
      try {
        await productModel.insertMany(products);
        console.log("Products successfully imported!");
        process.exit();
      } catch (err) {
        console.error("Error inserting products:", err);
        process.exit(1);
      }
    });
}
