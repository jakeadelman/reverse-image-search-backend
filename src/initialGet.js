import axios from "axios";
import HttpsProxyAgent from "https-proxy-agent";
import FormData from "form-data";
import fs from "fs";
import * as cheerio from "cheerio";
import { } from "dotenv/config";

const initialGet = (image) => {
  return new Promise(async (resolve, reject) => {
    try {
      let rand = Math.floor(
        Math.random() * process.env.PROXIES.split(" ").length
      );
      let proxy = process.env.PROXIES.split(" ")[rand];
      console.log(proxy)
      proxy = "http://430262c1c2bf4034983a0173dbde4c82:@proxy.crawlera.com:8011"

      var formData = new FormData();
      formData.append("image_url", "");
      formData.append("image_content", "");
      formData.append("filename", "");
      formData.append("h1", "en");
      formData.append("bih", "179");
      formData.append("biw", "1600");
      formData.append(
        "encoded_image",
        fs.createReadStream("./images/" + image)
      );
      // console.log(formData);
      const instance = axios.create({
        headers: {
          proxy: false,
          httpsAgent: new HttpsProxyAgent.HttpsProxyAgent(proxy),
        },
      });

      const res = await instance.post(
        "https://www.google.com/searchbyimage/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.64 Safari/537.36",
          }
        }
      );

      let $ = cheerio.load(res.data);

      let thisUrl = $(".hSQtef");
      //   console.log(thisUrl.attr("href"));
      resolve([thisUrl.attr("href"), instance]);
    } catch (err) {
      reject(err);
    }
  });
};

export default initialGet;
