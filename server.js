const express = require("express");
const path = require("path");
var useragent = require("useragent");
const DeviceDetector = require("node-device-detector");
var whois = require("node-whois");

const detector = new DeviceDetector();
const request = require("request");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "900mb" }));
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.urlencoded({ limit: "900mb", extended: true }));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.header("Access-Control-Request-Headers", "GET, PUT, POST, DELETE");
  next();
});
let PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
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
  KETO: "keto.jpeg",
};
const PDATA = {
  412294: "17", // YANCY
  1920114: "18", // SHANNON
  718159: "19", //7ROI
  2514: "16", // Ben
  25114325: "20", // DAVID GLENN
  1125125: "21", // Kyle
};
const SUBSENDERMAP = {
  "5f15983c85c36e5200a51f40": "http://jilead.red.powersms.land/pingmeta",
};
const whoislookup = async (ip) => {
  return new Promise((res, rej) => {
    whois.lookup(ip, function (err, data) {
      console.log(err, data);

      if (err) {
        rej(err);
      }

      if (data) {
        const reject = data.indexOf("Google LLC") !== -1; // reject if there is google

        res(reject);
      }
    });
  });
};
app.get("/ip-test", async (req, res) => {
  var ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  let agent = useragent.parse(req.headers["user-agent"]);
  // let device = agent.device.toJSON(); // returns an object
  const result = detector.detect(agent);

  res.json({ result });
});

app.get("/pingmeta/:cid", async (req, res) => {
  var ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  let trafficText = req.query.traffic;
  let redirect = req.query.redirect;

  if (req.query.traffic === "SKIN-DISABLED") {
    if (ip) {
      const rejectIP = await whoislookup(ip);

      if (rejectIP) {
        return console.log("you are from google", ip, rejectIP);
      } else {
        console.log(ip, "not google");
      }
    } else {
      console.log(great, "not skin");
    }
  }
  let redirectDetails = "";
  if (req.query.uid) {
    try {
      redirectDetails = await ACCESS_HOST_META(
        req.params.cid,
        req.query.traffic,
        req.query.redirect,
        SUBSENDERMAP[req.query.uid]
      );
    } catch (error) {
      console.log(error);
    }
  } else {
    redirectDetails = await ACCESS_HOST_META(
      req.params.cid,
      req.query.traffic,
      req.query.redirect
    );
  }
  let { traffic, title, customer } = JSON.parse(redirectDetails);

  let redirectLink = `http://assure-link.com/ping/${
    req.params.cid
  }?redirect=${encodeURIComponent(redirect)}&traffic=${trafficText}&ip=${ip}`;

  res.render("redmeta.ejs", {
    traffic,
    title,
    redirectLink,
    customer,
  });
});

// http://assure-link.com/ref?click_id={click_id}&pdata=25114325 GLENN
// http://assure-link.com/ref?click_id={click_id}&pdata=412294 Yancy
// http://assure-link.com/ref?click_id={click_id}&pdata=2514
// http://assure-link.com/ref?click_id={click_id}&pdata=1125125
app.get("/ref", async (req, res) => {
  // const {click_id} = req.query;
  let source = "";
  const { click_id, pdata } = req.query;
  // console.log(req.query)
  console.log(req.query);
  if (PDATA.hasOwnProperty(pdata)) {
    source = PDATA[`${pdata}`];
  }
  let redirect_traffic = `http://918md-2.com/?a=4679&c=51301&s2=${source}&s5=${click_id}`;
  // if(traffic=="CFH"){

  res.render("redirect-for.ejs", {
    traffic: "house.jpg",
    title: "Get Cash for your Home!",
    redirectLink: redirect_traffic,
  });
});

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
  let source = "";
  const { click_id, pdata, aff_id } = req.query;
  console.log(req.query);
  if (PDATA.hasOwnProperty(pdata)) {
    source = PDATA[`${pdata}`];
  }
  let redirect_traffic = `https://101traffic.com/l.php?trf=m&p=c:dvtupna21u56_iol_&d=5e7248c8e793f611df536f69&pid=${click_id}&data4=5656&source=${source}${
    aff_id ? `&data1=${aff_id}` : `&data1`
  }`;

  res.render("redirect-for.ejs", {
    traffic: "vod.png",
    title: "Free Movies For a Year!",
    redirectLink: redirect_traffic,
  });
});

// https://101traffic.com/l.php?trf=m&p=c:1ighcaypohstx6b9x&d=5e850bd73c92e656601dd3a2&pid={click_id}
// &d1={data1}&d4=5757&d2={email}&d3={firstname}&d5={lastname}&d6={gender}&d7={dobmonth}
// &d8={dobday}&d9={dobyear}&d10={phonecode}&d11={phoneprefix}&d12={phonesuffix}
// &d13={address1}&d14={address2}&d15={city}&d16={state}&d17={zippost}
app.get("/ping/:cid", async (req, res) => {
  let newip = req.query.ip;
  if (!newip) {
    newip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);
  }
  let trafficText = req.query.traffic;
  let browser = "";
  let device = "";
  let OS = "";
  try {
    let agent = useragent.parse(req.headers["user-agent"]);
    // let device = agent.device.toJSON(); // returns an object
    let result = detector.detect(agent);
    browser = result.client.name || "";
    device = result.device.model || result.device.type || "";
    OS = result.os.name || "";
  } catch (error) {
    console.log(error);
  }
  // res.json({  result });
  // console.log(req.query);
  let redirectDetails = await ACCESS_HOST(
    req.params.cid,
    req.query.traffic,
    req.query.redirect,
    newip,
    browser,
    device,
    OS
  );

  let { traffic, title, redirectLink, customer } = JSON.parse(redirectDetails);
  // console.log(JSON.parse(redirectDetails))
  if (trafficText === "CASH FOR HOMES" && customer && customer.cid) {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);
  }
  if (trafficText === "IPHONE-7ROI" && customer && customer.cid) {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);
  }
  if (trafficText === "VISA-7ROI" && customer && customer.cid) {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);
  }
  if (trafficText === "VOD" && customer && customer.cid) {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);
  }
  if (
    (trafficText === "KETO" && customer && customer.cid) ||
    (trafficText === "CBD" && customer && customer.cid)
  ) {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);
  }

  if (trafficText === "SKIN") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
    redirectLink =
      `https://anti-aging-potion.com/?popclick=${req.params.cid}&r=` +
      encodeURIComponent(redirectLink);
  }
  if (trafficText === "IMMUNITY") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (trafficText === "Boyscouts_HT" || trafficText === "Boyscouts_OPP") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (trafficText === "Credit-Score-SA") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (trafficText === "PM-Score-A") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (trafficText === "ED-OS") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (trafficText == "SKIN-OS") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (trafficText === "IPHONE-712") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
    redirectLink =
      `https://myphoneispretty.com?popclick=${req.params.cid}&r=` +
      encodeURIComponent(redirectLink);
  }
  if (trafficText === "7ROI-Skin-B") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
    redirectLink =
      `https://centerfoldskin.com/?popclick=${req.params.cid}&r=` +
      encodeURIComponent(redirectLink);
  }
  if (trafficText === "KETOMATIC") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
    redirectLink =
      `https://procore-keto.com?popclick=${req.params.cid}&r=` +
      encodeURIComponent(redirectLink);
  }

  if (trafficText === "KETO-OS") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kemail = customer.email || "";
      let kphone = customer.phone || "";
      redirectLink =
        redirectLink +
        `&shipping_firstname=${kFirstName}&shipping_lastname=${kLastName}&shipping_city=${kcity}&shipping_state=${kstate}&shipping_zipcode=${kzip}&shipping_email=${kemail}&shipping_phone=${kphone}&shipping_country=US&shipping_address=${kaddress}`;
    } catch (error) {
      console.log(error);
    }
    redirectLink =
      "https://foxnews.press?r=" + encodeURIComponent(redirectLink);
    traffic = "keto.jpeg";
  }
  if (trafficText === "CBD-GUMMIES") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
    redirectLink = "https://foxnews.blog?r=" + encodeURIComponent(redirectLink);
    traffic = "cbdgummies.png";
  }
  if (trafficText === "VOD-SOI") {
    let phone = customer.phone || "";
    let phonecode = phone.substring(1, 4);
    let phoneprefix = phone.substring(4, 7);
    let phonesuffix = phone.substring(7);
    let customeraddress = customer.address || "";
    let customercity = customer.city || "";
    let customerstate = customer.state || "";
    let customerzip = customer.zip || "";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);
    redirectLink = `${redirectLink}`;
    console.log("the new redirect link", redirectLink);
  }
  res.render("redirectclickers.ejs", {
    traffic,
    title,
    redirectLink,
    customer,
  });
});

// http://assure-link.com/ref-gummies?click_id={click_id}&pdata=2514
app.get("/ref-gummies", async (req, res) => {
  // const {click_id} = req.query;
  let source = "";
  const { click_id, pdata } = req.query;
  // console.log(req.query)
  console.log(req.query);
  if (PDATA.hasOwnProperty(pdata)) {
    source = PDATA[`${pdata}`];
  }
  // let redirect_traffic = `http://918md-2.com/?a=4679&c=51301&s2=${source}&s5=${click_id}`
  let redirect_traffic = `http://www.track4cr.com/click.track?CID=426105&AFID=434208&AffiliateReferenceID=${click_id}&SID=${source}&subid1=aff`;
  // if(traffic=="CFH"){

  res.render("redirect-for.ejs", {
    traffic: "cbdgummies.png",
    title: "Get down with CBD Gummies!",
    redirectLink: redirect_traffic,
  });
});

async function ACCESS_HOST(
  cid,
  traffic,
  redirectLink,
  ip,
  browser,
  device,
  OS
) {
  // browser,
  // device,
  // OS
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://red.powersms.land/ping3/${cid}?traffic=${encodeURIComponent(
        traffic
      )}&redirect=${encodeURIComponent(redirectLink)}&ip=${encodeURIComponent(
        ip
      )}&browser=${encodeURIComponent(browser)}&device=${encodeURIComponent(
        device
      )}&OS=${encodeURIComponent(OS)}`,
      method: "GET",
    };
    request(options, function (error, response, body) {
      // if (!error && response.statusCode == 200) {
      //   // console.log(body);
      //   resolve(body);
      // } else {

      resolve(body);
    });
  });
}

async function ACCESS_HOST_META(
  cid,
  traffic,
  redirectLink,
  url = `http://red.powersms.land/pingmeta`
) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `${url}/${cid}?traffic=${encodeURIComponent(
        traffic
      )}&redirect=${encodeURIComponent(redirectLink)}`,
      method: "GET",
    };
    request(options, function (error, response, body) {
      // if (!error && response.statusCode == 200) {
      //   // console.log(body);
      //   resolve(body);
      // } else {

      resolve(body);
    });
  });
}

async function LOGClickers(cid, traffic) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://red.powersms.land/ping4/${cid}?traffic=${encodeURIComponent(
        traffic
      )}&redirect=${encodeURIComponent(redirectLink)}`,
      method: "GET",
    };
    request(options, function (error, response, body) {
      // if (!error && response.statusCode == 200) {
      //   // console.log(body);
      //   resolve(body);
      // } else {

      resolve(body);
    });
  });
}
