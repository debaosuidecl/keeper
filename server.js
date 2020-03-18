
const express = require("express");
const request = require("request")
const app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.json({ limit: "900mb" }));

app.use(bodyParser.urlencoded({ limit: "900mb", extended: true }));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Request-Headers", "GET, PUT, POST, DELETE");
  next();
});
let PORT =  process.env.PORT || 3000
app.listen(PORT, function() {
    console.log(`listening to requests on port ${PORT}`);
    // connectDB();
  });
  app.use("/images", express.static("images"));
  app.set("view engine", "ejs");

  const Traffic = {
    "CASH FOR HOMES": "house.jpg",
    SKIN: "skin.jpg",
    COVID: "covid.jpg"
  };

app.get("/ping/:cid", async (req, res) => {
  let redirectDetails = await ACCESS_HOST(req.params.cid)

  const {traffic, title, redirectLink,customer} = redirectDetails;

  res.render("redirectClicker.ejs", {
    traffic,
    title,
    redirectLink,
    customer
  });
})


async function ACCESS_HOST(cid) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://red.powersms.land/ping/${cid}`,
      method: "GET",

    };
    request(options, function(error, response, body) {
      // if (!error && response.statusCode == 200) {
      //   // console.log(body);
      //   resolve(body);
      // } else {

      resolve(body);
    });
  });
}