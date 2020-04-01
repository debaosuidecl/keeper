
const express = require("express");
const path = require("path")
var useragent = require("useragent");

const request = require("request")
const app = express();
const bodyParser = require("body-parser")
app.use(bodyParser.json({ limit: "900mb" }));
app.set('views',path.join(__dirname ,'views'));
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

  let Traffic = {
    "CASH FOR HOMES": "house.jpg",
    SKIN: "skin.jpg",
    COVID: "covid.jpg",
    VOD: "vod.jpg"
  };
  const PDATA = {
    "412294": "17",// YANCY
    "1920114": "18", // SHANNON
    "718159": "19", //7ROI
    "25114325": "20", // DAVID GLENN
  }
  // http://assure-link.com/ref?click_id={click_id}&pdata=25114325 GLENN
  // http://assure-link.com/ref?click_id={click_id}&pdata=412294 Yancy

app.get("/ref", async (req, res) => {
  // const {click_id} = req.query;
  let source = ""
  const {click_id, pdata} = req.query;
  // console.log(req.query)
  console.log(req.query);
  if(PDATA.hasOwnProperty(pdata)){
    source = PDATA[`${pdata}`]
  }
  let redirect_traffic = `http://918md-2.com/?a=4679&c=51301&s2=${source}&s5=${click_id}`
  // if(traffic=="CFH"){
    

  // }

  // let trafficText = req.query.traffic;
  // let redirectDetails = await ACCESS_HOST(req.params.cid, req.query.traffic, req.query.redirect)

  // let {traffic, title, redirectLink,customer} = JSON.parse(redirectDetails);
  // console.log(JSON.parse(redirectDetails))
  // if(trafficText === "CASH FOR HOMES" && customer && customer.cid){
    
  //   redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`)
  // }
  // if(trafficText === "VOD" && customer && customer.cid){
  //   redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`)
  // }
  // console.log("the new redirect link", redirectLink)
  res.render("redirect-for.ejs", {
    traffic:"house.jpg",
    title: "Get Cash for your Home!",
    redirectLink: redirect_traffic,
  });
})


  // http://assure-link.com/ref-vod?click_id={click_id}&pdata=1920114 for shannon LF MEDIA
  // http://assure-link.com/ref-vod?click_id={click_id}&pdata=718159&aff_id={aff_Id} for 7roi
  // http://assure-link.com/ref-vod?click_id={click_id}&pdata=25114325 for Glenn
app.get("/ref-vod", async (req, res) => {
  // try {
  //   var agent = useragent.parse(req.headers["user-agent"]);
  //  console.log(agent);
  //  res.send(agent.os.toString());
    
  // } catch (error) {
  //   console.log(error)
  // }
  let source = ""
  const {click_id, pdata, aff_id} = req.query;
  console.log(req.query);
  if(PDATA.hasOwnProperty(pdata)){
    source = PDATA[`${pdata}`]
  }
  let redirect_traffic = `https://101traffic.com/l.php?trf=m&p=c:dvtupna21u56_iol_&d=5e7248c8e793f611df536f69&pid=${click_id}&data4=5656&source=${source}${aff_id? `&data1=${aff_id}`: `&data1`}`

  res.render("redirect-for.ejs", {
    traffic:"vod.png",
    title: "Free Movies For a Year!",
    redirectLink: redirect_traffic,
  });
})


app.get("/ping/:cid", async (req, res) => {
  let trafficText = req.query.traffic;
  console.log(req.query);
  let redirectDetails = await ACCESS_HOST(req.params.cid, req.query.traffic, req.query.redirect)

  let {traffic, title, redirectLink,customer} = JSON.parse(redirectDetails);
  console.log(JSON.parse(redirectDetails))
  if(trafficText === "CASH FOR HOMES" && customer && customer.cid){
    
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`)
  }
  if(trafficText === "VOD" && customer && customer.cid){
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`)
  }
  console.log("the new redirect link", redirectLink)
  res.render("redirectclickers.ejs", {
    traffic,
    title,
    redirectLink,
    customer
  });
})


// app.get("/email/unsubscribe", async (req, res) => {
//   // try {
//   //   var agent = useragent.parse(req.headers["user-agent"]);
//   //  console.log(agent);
//   //  res.send(agent.os.toString());
    
//   // } catch (error) {
//   //   console.log(error)
//   // }
//   let source = ""
//   const {click_id, pdata} = req.query;
//   console.log(req.query);
//   if(PDATA.hasOwnProperty(pdata)){
//     source = PDATA[`${pdata}`]
//   }
//   let redirect_traffic = `https://101traffic.com/l.php?trf=m&p=c:dvtupna21u56_iol_&d=5e7248c8e793f611df536f69&pid=${click_id}&data4=5656&source=${source}`

//   res.render("redirect-for.ejs", {
//     traffic:"vod.png",
//     title: "Free Movies For a Year!",
//     redirectLink: redirect_traffic,
//   });
// })


async function ACCESS_HOST(cid,traffic,redirectLink) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://red.powersms.land/ping3/${cid}?traffic=${encodeURIComponent(traffic)}&redirect=${encodeURIComponent(redirectLink)}`,
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


async function LOGClickers(cid,traffic) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://red.powersms.land/ping4/${cid}?traffic=${encodeURIComponent(traffic)}&redirect=${encodeURIComponent(redirectLink)}`,
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