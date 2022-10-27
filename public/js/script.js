var isLocal = ~location.href.indexOf("://localhost");
var fetchStr;
if (isLocal) {
  fetchStr = "/api/basic/upload";
} else {
  fetchStr = "https://reverseimgsearch.com/api/basic/upload";
}

document.getElementById("file").onchange = function () {
  var input = document.querySelector('input[type="file"]');

  var fd = new FormData();
  fd.append("file", input.files[0]);
  console.log(input.files);

  fetch(fetchStr, {
    method: "POST",
    body: fd,
  })
    .then((res) => res.json())
    .then((data) => {
      //   console.log(data[0]);
      data.map((each) => {
        console.log(each);

        let eachImgContainerEl = document.createElement("div");
        eachImgContainerEl.setAttribute("class", "each-img-container");
        let imgEl = document.createElement("img");

        imgEl.setAttribute("src", each.img);

        let aEl = document.createElement("a");
        aEl.setAttribute("href", each.link);
        aEl.setAttribute("target", "_blank");
        aEl.innerHTML += each.alt;

        let imgContainerEl = document.querySelector(".image-container");
        eachImgContainerEl.appendChild(imgEl);
        eachImgContainerEl.appendChild(aEl);
        imgContainerEl.appendChild(eachImgContainerEl);
      });
    });
};
