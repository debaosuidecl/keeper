
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
    SKIN: "skin.png",
    COVID: "covid.jpg",
    VOD: "movieflix.png",
    KETO: "keto.jpeg"
  };
  const PDATA = {
    "412294": "17",// YANCY
    "1920114": "18", // SHANNON
    "718159": "19", //7ROI
    "2514": "16", // Ben
    "25114325": "20", // DAVID GLENN
    "1125125": "21" // Kyle
  }


app.get("/ip-test", async (req,res)=> {

var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log(ip, "NNNNNNNNNNNNNNNNNNNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
})

  app.get("/pingmeta/:cid", async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || 
     req.connection.remoteAddress || 
     req.socket.remoteAddress ||
     (req.connection.socket ? req.connection.socket.remoteAddress : null);
    let trafficText = req.query.traffic;
    let redirect = req.query.redirect;
    let redirectDetails = await ACCESS_HOST_META(req.params.cid, req.query.traffic, req.query.redirect)
    let {traffic, title,customer} = JSON.parse(redirectDetails);

    let redirectLink = `http://assure-link.com/ping/${req.params.cid}?redirect=${encodeURIComponent(redirect)}&traffic=${trafficText}&ip=${ip}`

    res.render("redmeta.ejs", {
      traffic,
      title,
      redirectLink,
      customer
    });
  })










  // http://assure-link.com/ref?click_id={click_id}&pdata=25114325 GLENN
  // http://assure-link.com/ref?click_id={click_id}&pdata=412294 Yancy
  // http://assure-link.com/ref?click_id={click_id}&pdata=2514
  // http://assure-link.com/ref?click_id={click_id}&pdata=1125125
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

// https://101traffic.com/l.php?trf=m&p=c:1ighcaypohstx6b9x&d=5e850bd73c92e656601dd3a2&pid={click_id}
// &d1={data1}&d4=5757&d2={email}&d3={firstname}&d5={lastname}&d6={gender}&d7={dobmonth}
// &d8={dobday}&d9={dobyear}&d10={phonecode}&d11={phoneprefix}&d12={phonesuffix}
// &d13={address1}&d14={address2}&d15={city}&d16={state}&d17={zippost}
app.get("/ping/:cid", async (req, res) => {
  let newip = req.query.ip
  if(!newip){
    newip =  req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  }
  let trafficText = req.query.traffic;
  // console.log(req.query);
  let redirectDetails = await ACCESS_HOST(req.params.cid, req.query.traffic, req.query.redirect, newip)

  let {traffic, title, redirectLink,customer} = JSON.parse(redirectDetails);
  // console.log(JSON.parse(redirectDetails))
  if(trafficText === "CASH FOR HOMES" && customer && customer.cid){
    
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`)
  }
  if(trafficText === "VOD" && customer && customer.cid){
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`)
  }
  if((trafficText === "SKIN" && customer && customer.cid) || (trafficText === "KETO" && customer && customer.cid) || (trafficText === "CBD" && customer && customer.cid)){
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`)
  }
  if (trafficText === "IMMUNITY"){
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`)
  }
  if (trafficText === "ED-OS"){
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`)
    
  }
  if (trafficText === "KETO-OS"){
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`)
    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kemail = customer.email || "";
      let kphone = customer.phone || ""
      redirectLink = redirectLink +  `&shipping_firstname=${kFirstName}&shipping_lastname=${kLastName}&shipping_city=${kcity}&shipping_state=${kstate}&shipping_zipcode=${kzip}&shipping_email=${kemail}&shipping_phone=${kphone}&shipping_address1=${kaddress}`
    } catch (error) {
      console.log(error)
    }
    redirectLink = "https://foxnews.press?r=" + encodeURIComponent(redirectLink)
    traffic="keto.jpeg"
  }
  if (trafficText === "CBD-GUMMIES"){
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`)
    redirectLink = "https://foxnews.blog?r=" + encodeURIComponent(redirectLink)
    traffic = "cbdgummies.png"
  }
  if(trafficText === "VOD-SOI"){
    let phone = customer.phone || ""
    let phonecode = phone.substring(1,4);
    let phoneprefix = phone.substring(4,7);
    let phonesuffix = phone.substring(7);
    let customeraddress = customer.address || ""
    let customercity = customer.city || ""
    let customerstate = customer.state || ""
    let customerzip = customer.zip || ""
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`)
    redirectLink = `${redirectLink}`
    console.log("the new redirect link", redirectLink)
  }
  res.render("redirectclickers.ejs", {
    traffic,
    title,
    redirectLink,
    customer
  });
})

// http://assure-link.com/ref-gummies?click_id={click_id}&pdata=2514
app.get("/ref-gummies", async (req, res) => {
  // const {click_id} = req.query;
  let source = ""
  const {click_id, pdata} = req.query;
  // console.log(req.query)
  console.log(req.query);
  if(PDATA.hasOwnProperty(pdata)){
    source = PDATA[`${pdata}`]
  }
  // let redirect_traffic = `http://918md-2.com/?a=4679&c=51301&s2=${source}&s5=${click_id}`
  let redirect_traffic = `http://www.track4cr.com/click.track?CID=426105&AFID=434208&AffiliateReferenceID=${click_id}&SID=${source}&subid1=aff`
  // if(traffic=="CFH"){
    
  res.render("redirect-for.ejs", {
    traffic:"cbdgummies.png",
    title: "Get down with CBD Gummies!",
    redirectLink: redirect_traffic,
  });
})




async function ACCESS_HOST(cid,traffic,redirectLink, ip) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://red.powersms.land/ping3/${cid}?traffic=${encodeURIComponent(traffic)}&redirect=${encodeURIComponent(redirectLink)}&ip=${encodeURIComponent(ip)}`,
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

async function ACCESS_HOST_META(cid,traffic,redirectLink) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://red.powersms.land/pingmeta/${cid}?traffic=${encodeURIComponent(traffic)}&redirect=${encodeURIComponent(redirectLink)}`,
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