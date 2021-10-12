// @ts-nocheck
const express = require("express");
const path = require("path");
var useragent = require("useragent");
const DeviceDetector = require("node-device-detector");
var whois = require("node-whois");
const axios = require("axios");
const detector = new DeviceDetector();
const request = require("request");
const HOMESERVER = "http://localhost:8080";
const ipmap = require("./lists/iplist.json");
const app = express();
const bodyParser = require("body-parser");
const findgender = require("./helperfunctions/findgender");
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

  console.log("please start recieving requests now");
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
  9142152454: "25", // SMS Inboxed
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

  res.json({ ip });
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
        console.log("you are from google", ip, rejectIP);
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
      // redirectDetails = await ACCESS_HOST_META(
      //   req.params.cid,
      //   req.query.traffic,
      //   req.query.redirect,
      //   SUBSENDERMAP[req.query.uid]
      // );
    } catch (error) {
      console.log(error);
    }
  } else {
    redirectDetails = await ACCESS_HOST_META(
      req.params.cid,
      req.query.traffic,
      req.query.redirect,
      "http://red.powersms.land/pingmeta"
      // req.query.sub_id,
      // req.query.source
    );
  }
  let { traffic, title, customer } = JSON.parse(redirectDetails);

  let redirectLink = `http://www.domain-secured.com/ping/${
    req.params.cid
  }?redirect=${encodeURIComponent(
    redirect
  )}&traffic=${trafficText}&ip=${ip}&sub_id=${req.query.sub_id}&source=${
    req.query.source
  }`;
  if (title === "CASH-FOR-HOMES-FDN") {
    title = "Cash for your home";
  }
  if (title === "CBD-GUMMIES") {
    title = "Get down with CBD Gummies!";
  }
  if (title === "KETO-WG") {
    title = "Instant Movie-Star Weight-loss";
  }
  if (title === "Unclaimed-Assets") {
    title = "Unclaimed Money In The USA";
  }
  if (title === "TORT-LF") {
    title = "YOUR COMPENSATION CLAIM";
  }
  if (title === "IPHONE12") {
    title = "Everybody needs it!";
  }
  res.render("redmeta.ejs", {
    traffic,
    title,
    redirectLink,
    customer,
  });
});

app.get("/pingmeta2/:cid", async (req, res) => {
  console.log(req.query, 162);
  var ip =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);
  console.log(ip, "this is the ip");
  try {
    if (ipmap.hasOwnProperty(ip)) {
      console.log("you are not supposed to be accessing this route", ip);

      return res.status(404).json({
        message: "NOT ALLOWED",
      });
    }
  } catch (error) {
    console.log(error);
  }

  let trafficText = req.query.traffic;
  let redirect = req.query.redirect;

  if (req.query.traffic === "SKIN-DISABLED") {
    if (ip) {
      const rejectIP = await whoislookup(ip);

      if (rejectIP) {
        console.log("you are from google", ip, rejectIP);
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
      // redirectDetails = await ACCESS_HOST_META(
      //   req.params.cid,
      //   req.query.traffic,
      //   req.query.redirect,
      //   SUBSENDERMAP[req.query.uid]
      // );
    } catch (error) {
      console.log(error);
    }
  } else {
    redirectDetails = await ACCESS_HOST_META(
      req.params.cid,
      req.query.traffic,
      req.query.redirect,
      "http://red.powersms.land/pingmeta",
      req.query.sub_id,
      req.query.source
    );
  }

  try {
    if (req.query.oid) {
      console.log("fetching for new redirect");
      const oldredirect = redirect;
      redirect = await ACCESS_CONDITIONAL_REDIRECT(req.query.oid);

      if (!redirect) {
        console.log(
          "since no redirect ",
          redirect,
          "we are going back to the old value"
        );

        redirect = oldredirect;
      } else {
        console.log(redirect, "redirect extracted!!");
      }
    }
  } catch (error) {
    console.log(error);
  }
  let { traffic, title, customer } = JSON.parse(redirectDetails);

  let redirectLink = `https://www.domain-secured.com/ping/${
    req.params.cid
  }?redirect=${encodeURIComponent(
    redirect
  )}&traffic=${trafficText}&ip=${ip}&sub_id=${req.query.sub_id}&source=${
    req.query.source
  }`;
  if (title === "CASH-FOR-HOMES-FDN") {
    title = "Cash for your home";
  }
  if (title === "CBD-GUMMIES") {
    title = "Get down with CBD Gummies!";
  }
  if (title === "KETO-WG") {
    title = "Instant Movie-Star Weight-loss";
  }
  if (title === "Unclaimed-Assets") {
    title = "Unclaimed Money In The USA";
  }
  if (title === "TORT-LF") {
    title = "YOUR COMPENSATION CLAIM";
  }
  if (title === "IPHONE12") {
    title = "Everybody needs it!";
  }
  res.render("redmeta.ejs", {
    traffic: title === "AUTO-INSURANCE" ? "" : traffic,
    title: title === "AUTO-INSURANCE" ? "" : title,
    redirectLink,
    customer,
  });
});

// http://www.domain-secured.com/ref?click_id={click_id}&pdata=25114325 GLENN
// http://www.domain-secured.com/ref?click_id={click_id}&pdata=412294 Yancy
// http://www.domain-secured.com/ref?clickSDSD_id={click_id}&pdata=2514
// http://www.domain-secured.com/ref?click_id={click_id}&pdata=1125125

app.get("/summary/:id", async (req, res) => {
  try {
    const pdf = await DownloadPDF(req.params.id);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${req.params.id}.pdf`
    );
    pdf.pipe(res);
  } catch (error) {
    res.send("File does not exist");
  }

  res.send(pdf);
});
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
app.post("/save-response", async (req, res) => {
  // save response
  let {
    redirectLink = "http://google.com",
    leadid,
    phone,
    traffic,
    title,
    cid,
    ip,
    internationalCodePhone,
    source,
    sub_id,
  } = req.query;

  redirectLink = `${redirectLink}`.replace("{click_id}", cid);

  console.log(redirectLink, "after replacement");

  // const realRedirect = queryString.parse(redirectLink.split("?")[1]).redirect;

  // return res.send(redirectLink)

  console.log(redirectLink, "redirect link");

  let redirectDetails = await ACCESS_HOST_META(
    cid,
    traffic,
    redirectLink,
    "http://red.powersms.land/pingmeta"
    // req.query.sub_id,
    // req.query.source
  );

  console.log(redirectDetails);

  // res.send(redirectDetails);
  // return;

  ACCESS_HOST_LEADID(leadid, redirectLink, internationalCodePhone, traffic)
    .then((res) => {
      console.log("done", res);
    })
    .catch((err) => {
      console.log("err", err);
    });

  // take user to next page throught the meta click
  let redirectLinkToGo = `https://claim-your-assets.com/ping/${cid}?redirect=${encodeURIComponent(
    redirectLink
  )}&traffic=${traffic}&ip=${ip}&sub_id=${sub_id}&source=${source}`;
  res.render("redmeta.ejs", {
    traffic,
    title: "SECURE-LINK",
    redirectLink: redirectLinkToGo,
    customer: redirectDetails.customer,
  });
});
app.get("/ping-j/:cid", async (req, res) => {
  // const { ip } = req.query;
  let newip = req.query.ip;
  if (!newip) {
    newip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);
  }

  console.log("ping j", req.query);
  let trafficText = req.query.traffic;
  let redirect = req.query.redirect;

  let redirectDetails = "";

  try {
    if (req.query.oid) {
      console.log("fetching for new redirect");
      const oldredirect = redirect;
      redirect = await ACCESS_CONDITIONAL_REDIRECT(req.query.oid);

      if (!redirect) {
        console.log(
          "since no redirect ",
          redirect,
          "we are going back to the old value"
        );

        redirect = oldredirect;
      } else {
        console.log(redirect, "redirect extracted!!");
      }
    }
  } catch (error) {
    console.log(error);
  }

  redirectDetails = await ACCESS_HOST_META(
    req.params.cid,
    req.query.traffic,
    req.query.redirect,
    "http://red.powersms.land/pingmeta"
  );
  let { traffic, title, customer } = JSON.parse(redirectDetails);

  let advertiser;
  // if (traffic === "PAYDAY" || traffic === "PAYDAY2") {
  //   advertiser = "PAYDAY offers";
  // }

  if (!customer.phone) {
    console.log(customer, "Not allowed to access");
    return res.send("not allowed to access");
  }
  const customerphone = getusphoneformat(customer.phone);
  console.log(customer, "258");
  res.render("jcapture.ejs", {
    traffic: req.query.traffic,
    trafficText: traffic,
    title: req.query.traffic,
    redirectLink: encodeURIComponent(redirect),
    advertiser: "",
    customer,
    ip: newip,
    source: req.query.source,
    sub_id: req.query.sub_id,
    internationalCodePhone: customer.phone,
    phone: customerphone,
  });
});
app.get("/ping-revamp/:cid", async (req, res) => {
  try {
    let { cid } = req.params;

    let { redirect, OS, device, browser, ip } = req.query;

    try {
      let cdata = await GETLEADDATA(cid, ip, browser, device, OS);

      if (!cdata) {
        console.log(cdata, "cdata", 309);
        return res.sendStatus(404);
      }

      redirect = redirect
        .replace("{campaignid}", cdata.campaignid)
        .replace("{clickid}", cdata.leadid);

      res.redirect(redirect);
    } catch (error) {
      console.log(error);
      res.sendStatus(401);
    }
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

app.get("/ping-revamp-meta/:cid", async (rq, res) => {
  try {
    let { cid } = req.params;
    let { redirect } = req.query;

    let metaredirectlink = `http://www.domain-secured.com/ping-revamp/${cid}?redirect=${encodeURIComponent(
      redirect
    )}&OS=${OS}&device=${device}&browser=${browser}&ip=${newip}`;
    let newip =
      req.headers["x-forwarded-for"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    // let trafficText = req.query.traffic;
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

      console.log(browser, device, OS);
    } catch (error) {
      console.log(error);
    }

    res.render("redmetarevamp.ejs", {
      title: "",
      redirect: metaredirectlink,
    });
  } catch (error) {
    res.sendStatus(500);
    console.log(error);
  }
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

    console.log(browser, device, OS);
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
    OS,
    req.query.sub_id,
    req.query.source
  );

  let { traffic, title, redirectLink, customer } = JSON.parse(redirectDetails);
  // console.log(JSON.parse(redirectDetails))
  redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

  if (trafficText === "CASH FOR HOMES" && customer && customer.cid) {
    title = "CASH FOR YOUR HOME";

    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);
  }
  if (trafficText === "CASH-FOR-HOMES-FDN" && customer && customer.cid) {
    title = "CASH FOR YOUR HOME";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);
  }
  if (trafficText === "PAYDAY") {
    title = "PAYDAY";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (trafficText === "TORT-LF") {
    title = "YOUR COMPENSATION CLAIM";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (trafficText === "XMAS-LEND") {
    title = "XMAS CASH FAST";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (trafficText === "Unclaimed-Assets" && customer && customer.cid) {
    title =
      trafficText === "Unclaimed-Assets"
        ? "Unclaimed Money In The USA"
        : "SWEEPS";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kemail = customer.email || "";
      let kphone = getusphoneformat(customer.phone) || "";
      redirectLink = `${redirectLink}&phone=${kphone}&first=${kFirstName}&last=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&address=${kaddress}`;
    } catch (error) {
      console.log(error);
    }
  }
  if (trafficText === "Find-Unclaimed-Assets" && customer && customer.cid) {
    title =
      trafficText === "Unclaimed-Assets"
        ? "Unclaimed Money In The USA"
        : "SWEEPS";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kemail = customer.email || "";
      let kphone = getusphoneformat(customer.phone) || "";
      redirectLink = `${redirectLink}&phone=${kphone}&fname=${kFirstName}&lname=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&address=${kaddress}`;
    } catch (error) {
      console.log(error);
    }
  }
  if (trafficText === "Unclaimed-Assets-HT" && customer && customer.cid) {
    title =
      trafficText === "Unclaimed-Assets"
        ? "Unclaimed Money In The USA"
        : "Secure Link";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kemail = customer.email || "";
      let kphone = customer.phone || "";
      redirectLink = `${redirectLink}&d4=${kphone}&d1=${kFirstName}&d2=${kLastName}&d3=${kemail}&d5=${kzip}`;
    } catch (error) {
      console.log(error);
    }
  }
  if (
    trafficText.toLowerCase().indexOf("fluent") !== -1 &&
    customer &&
    customer.cid
  ) {
    // title = "50K";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    title =
      trafficText === "CASHAPP_FLUENT" ? "SECURE REDIRECT" : "Secure Redirect";

    let gender = "M";
    try {
      // find gender
      // gender = await findgender(customer.first_name);
      // gender = gender.toUpperCase();
    } catch (error) {
      console.log(error);
    }
    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kgender = gender[0] || "m";
      let kemail = customer.email || "";
      let kphone = getusphoneformat(customer.phone) || "";
      redirectLink = `${redirectLink}&telephone=${kphone}&firstname=${kFirstName}&lastname=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&address1=${kaddress}&gender=${kgender}`;
    } catch (error) {
      console.log(error, 4209302930193019301390139);
    }
  }

  if (trafficText === "iPHONE-CPC-CN" && customer && customer.cid) {
    title = "iPHONE13";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    let gender = "m";
    try {
      // find gender

      gender = (await findgender(customer.first_name)) || "m";
    } catch (error) {
      console.log(error);
    }
    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kgender = gender[0] || "m";
      let kemail = customer.email || "";
      let kphone = getusphoneformat(customer.phone) || "";
      redirectLink = `${redirectLink}&phone=${kphone}&address=${kaddress}&fname=${kFirstName}&lname=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&gender=${kgender}`;
    } catch (error) {
      console.log(error, 4209302930193019301390139);
    }
  }
  if (trafficText === "WE-BUY" && customer && customer.cid) {
    title = "WE-BUY";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    let gender = "m";
    try {
      // find gender

      gender = (await findgender(customer.first_name)) || "m";
    } catch (error) {
      console.log(error);
    }
    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kgender = gender[0] || "m";
      let kemail = customer.email || "";
      let kphone = getusphoneformat(customer.phone) || "";
      redirectLink = `${redirectLink}&phone=${kphone}&address=${kaddress}&fname=${kFirstName}&lname=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&gender=${kgender}`;
    } catch (error) {
      console.log(error, 4209302930193019301390139);
    }
  }
  if (trafficText === "50K" && customer && customer.cid) {
    title = "50K";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    let gender = "m";
    try {
      // find gender

      gender = (await findgender(customer.first_name)) || "m";
    } catch (error) {
      console.log(error);
    }
    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kgender = gender[0] || "m";
      let kemail = customer.email || "";
      let kphone = getusphoneformat(customer.phone) || "";
      redirectLink = `${redirectLink}&phone=${kphone}&first=${kFirstName}&last=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&address=${kaddress}&gender=${kgender}`;
    } catch (error) {
      console.log(error, 4209302930193019301390139);
    }
  }
  if (trafficText === "CASH-APP" && customer && customer.cid) {
    title = "Confirm $750 Receipt";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    let gender = "m";
    try {
      // find gender
      // gender = (await findgender(customer.first_name)) || "m";
    } catch (error) {
      console.log(error);
    }
    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kgender = gender[0] || "m";
      let kemail = customer.email || "";
      let kphone = getusphoneformat(customer.phone) || "";
      // first={first}&last={last}&email={email}&address1={address1}&city={city}&state={state}&zip={zip}&phone={phone}
      redirectLink = `${redirectLink}&phone=${kphone}&address1=${kaddress}&first=${kFirstName}&last=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&gender=${kgender}`;
    } catch (error) {
      console.log(error, 4209302930193019301390139);
    }
  }

  if (trafficText === "ED Revshare HT" && customer && customer.cid) {
    title = "Get Down with ED!";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    let gender = "m";
    try {
      // find gender

      gender = (await findgender(customer.first_name)) || "m";
    } catch (error) {
      console.log(error);
    }
    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kgender = gender[0] || "m";
      let kemail = customer.email || "";
      let kphone = getusphoneformat(customer.phone) || "";
      redirectLink = `${redirectLink}&phone=${kphone}&address=${kaddress}&first=${kFirstName}&last=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&gender=${kgender}`;
    } catch (error) {
      console.log(error, 4209302930193019301390139);
    }
  }

  if (trafficText === "IPHONE13" && customer && customer.cid) {
    title = "IPHONE13";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);

    let gender = "m";
    try {
      // find gender

      gender = (await findgender(customer.first_name)) || "m";
    } catch (error) {
      console.log(error);
    }
    try {
      let kFirstName = customer.first_name || "";
      let kLastName = customer.last_name || "";
      let kaddress = customer.address || "";
      let kcity = customer.city || "";
      let kstate = customer.state || "";
      let kzip = customer.zip || "";
      let kgender = gender[0] || "m";
      let kemail = customer.email || "";
      let kphone = getusphoneformat(customer.phone) || "";

      redirectLink = `${redirectLink}&phone=${kphone}&first=${kFirstName}&last=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&address=${kaddress}&gender=${kgender}`;

      redirectLink = `https://the-gloryofwinning.com?popclick=${
        req.params.cid
      }&r=${encodeURIComponent(
        redirectLink
      )}&phone=${kphone}&first=${kFirstName}&last=${kLastName}&email=${kemail}&city=${kcity}&state=${kstate}&zip=${kzip}&address=${encodeURIComponent(
        kaddress
      )}&gender=${kgender}`;
      // redirectLink = `${redirectLink}`;
    } catch (error) {
      console.log(error, 09080078009);
    }
  }
  if (trafficText === "PAYDAY2" && customer && customer.cid) {
    title = "PAYDAY";
    redirectLink = `${redirectLink}`.replace("{click_id}", `${customer.cid}`);
  }

  if (trafficText === "PS5" && customer && customer.cid) {
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
    // redirectLink =
    //   `https://anti-aging-potion.com/?popclick=${req.params.cid}&r=` +
    //   encodeURIComponent(redirectLink);
  }
  if (trafficText === "IMMUNITY") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
  }
  if (
    trafficText === "Boyscouts_HT" ||
    trafficText === "Boyscouts_OPP" ||
    trafficText === "STAY_HOME_OPP"
  ) {
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
  if (trafficText === "AUTO-INSURANCE" || trafficText === "REFINANCE") {
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
  if (trafficText === "Wally-World") {
    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
    redirectLink =
      `https://super-samp.com?popclick=${req.params.cid}&r=` +
      encodeURIComponent(redirectLink);
  }
  if (trafficText === "KETO-WG") {
    title = "Instant Movie-Star Weight-loss";

    redirectLink = `${redirectLink}`.replace("{click_id}", `${req.params.cid}`);
    // redirectLink =
    //   `https://superketogenics.com?popclick=${req.params.cid}&r=` +
    //   encodeURIComponent(redirectLink);
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

// http://www.domain-secured.com/ref-gummies?click_id={click_id}&pdata=2514
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
  OS,
  sub_id,
  source
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
      )}&OS=${encodeURIComponent(OS)}&sub_id=${sub_id}&source=${source}`,
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
async function GETLEADDATA(cid, ip, browser, device, OS) {
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://${HOMESERVER}/api/leadactivity/clickers/${cid}?ip=${encodeURIComponent(
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
function getusphoneformat(phone) {
  let formattedphone = "";
  for (let i = 0; i < phone.length; i++) {
    const char = phone[i];
    if (i === 0) {
      continue;
    } else if (i == 4 || i == 7) {
      formattedphone += "-";
    }

    formattedphone += char;
  }

  return formattedphone;
}
async function ACCESS_HOST_META(
  cid,
  traffic,
  redirectLink,
  url = `http://red.powersms.land/pingmeta`,
  sub_id,
  source
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

async function DownloadPDF(filename) {
  return new Promise((resolve, reject) => {
    axios
      .get(`http://159.89.55.0:8420/summary-report?filename=${filename}`, {
        method: "get",
        responseType: "stream",
      })
      .then(({ data }) => {
        console.log(data);
        resolve(data);
      })
      .catch((e) => {
        console.log(e);
        reject(e.response);
      });
  });
}

async function ACCESS_CONDITIONAL_REDIRECT(oid) {
  // browser,
  // device,
  // OS
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://159.89.55.0:2989/getsuboffers-forcs?offerid=${oid}`,
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
async function ACCESS_HOST_LEADID(leadid, redirectLink, phone, traffic) {
  // browser,
  // device,
  // OS
  return new Promise((resolve, reject) => {
    let options = {
      url: `http://red.powersms.land/save-lead-id/${leadid}?redirectLink=${encodeURIComponent(
        redirectLink
      )}&phone=${phone}&traffic=${traffic}`,
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
