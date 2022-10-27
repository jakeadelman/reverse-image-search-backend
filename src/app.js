import axios from "axios";
import fetch from "node-fetch";
import HttpsProxyAgent from "https-proxy-agent";
import httpProxy from "http-proxy-server";
import FormData from "form-data";
import fs from "fs";
import * as cheerio from "cheerio";
import { } from "dotenv/config";
import initialGet from "./initialGet.js";
import puppeteer from "puppeteer";
// const $ = cheerio.load();

const start = async (image) => {
  return new Promise(async (resolve) => {
    try {
      let rand = Math.floor(
        Math.random() * process.env.PROXIES.split(" ").length
      );
      let proxy = process.env.PROXIES.split(" ")[rand];

      let url = await initialGet(image);
      console.log(url[0]);
      let thisUrl = "https://google.com" + url[0];
      let instance = url[1];

      // let res = await fetch("https://google.com" + thisUrl, {
      //   headers: {
      //     "User-Agent":
      //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
      //   },
      // });

      const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });
      // use tor
      //
      //   const browser = await puppeteer.launch({args:['--proxy-server=socks5://127.0.0.1:9050']});
      const page = await browser.newPage();
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        console.log(`Intercepting: ${request.method} ${request.url}`);
        request.continue();
      });
      await page.goto(thisUrl, { waitUntil: "load" });

      const html = await page.content();
      // console.log(html);

      fs.writeFile("output.html", html, function () {
        console.log("done writing file");
      });
      browser.close();

      const $ = cheerio.load(html);
      const img = $(".rg_i");
      // console.log(img.attr("src"));
      let allImgs = [];
      img.map(function () {
        let parents = $(this).parents(".isv-r");
        let a = parents.find("a");

        let attribsA = a[1].attribs;
        attribsA = JSON.parse(JSON.stringify(attribsA));

        if ($(this).attr("src")) {
          let json = {
            img: $(this).attr("src"),
            link: attribsA.href,
            alt: $(this).attr("alt"),
          };
          allImgs.push(json);
        } else {
          let json = {
            img: $(this).attr("data-src"),
            link: attribsA.href,
            alt: $(this).attr("alt"),
          };
          allImgs.push(json);
        }
        console.log(allImgs);
      });

      resolve(allImgs);
    } catch (err) {
      console.log(err);
    }
  });
};
export default start;
