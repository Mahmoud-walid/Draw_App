"use strict";

const kinet = new Kinet({
  acceleration: 0.06,
  friction: 0.2,
  names: ["x", "y"],
});

const circle = document.getElementById("circle");

kinet.on("tick", function (instances) {
  circle.style.transform = `translate3d(${instances.x.current}px, ${
    instances.y.current
  }px, 0) rotateX(${instances.x.velocity / 2}deg) rotateY(${
    instances.y.velocity / 2
  }deg)`;
});

const appElement = document.querySelector(".app");

function showCircle() {
  circle.style.opacity = "0.5";
}

function hideCircle() {
  circle.style.opacity = "0";
}

appElement.addEventListener("mousemove", function (event) {
  kinet.animate("x", event.clientX - window.innerWidth / 2);
  kinet.animate("y", event.clientY - window.innerHeight / 2);
});

appElement.addEventListener("mouseenter", showCircle);
appElement.addEventListener("mouseleave", hideCircle);

// Start app
const container = document.querySelector(".container");
const submitBtn = document.querySelector("#submit_grid");
const clearBtn = document.querySelector("#clear_grid");
const eraseBtn = document.querySelector("#erase_grid");
const paintBtn = document.querySelector("#paint_grid");
const gridWidthBtn = document.querySelector("#width_range");
const gridHeightBtn = document.querySelector("#heigth_range");
const colorBtn = document.querySelector("#color_input");
const widthValue = document.querySelector("#width_range_value");
const heightValue = document.querySelector("#heigth_range_value");

const events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup",
  },
  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend",
  },
};

let deviceType = "";
let draw = false;
let erase = false;

const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (error) {
    deviceType = "mouse";
    return false;
  }
};
isTouchDevice();

submitBtn.addEventListener("click", () => {
  container.innerHTML = "";
  let count = 0;
  for (let i = 0; i < gridHeightBtn.value; i++) {
    count += 2;
    let div = document.createElement("div");
    div.classList.add("gridRow");

    for (let j = 0; j < gridWidthBtn.value; j++) {
      count += 2;
      let col = document.createElement("div");
      col.classList.add("gridCol");
      col.setAttribute("id", `gridCol${count}`);
      col.addEventListener(events[deviceType].down, () => {
        draw = true;
        erase
          ? (col.style.backgroundColor = "transparent")
          : (col.style.backgroundColor = colorBtn.value);
      });

      col.addEventListener(events[deviceType].move, (event) => {
        let elementID = document.elementFromPoint(
          !isTouchDevice() ? event.clientX : event.touches[0].clientX,
          !isTouchDevice() ? event.clientY : event.touches[0].clientY
        ).id;
        checker(elementID);
      });
      col.addEventListener(events[deviceType].up, () => {
        draw = false;
      });
      div.appendChild(col);
    }
    container.appendChild(div);
  }
});

const checker = (elementID) => {
  let gridCloumns = document.querySelectorAll(".gridCol");
  gridCloumns.forEach((ele) => {
    elementID === ele.id
      ? draw && !erase
        ? (ele.style.backgroundColor = colorBtn.value)
        : draw && erase
        ? (ele.style.backgroundColor = "transparent")
        : null
      : null;
  });
};

clearBtn.addEventListener("click", () => {
  container.innerHTML = "";
});

eraseBtn.addEventListener("click", () => {
  erase = true;
  draw = false;
  if (erase) {
    container.style.cursor = "url('../public/icon/eraser.png'), default";
  } else {
    container.style.cursor = "default";
  }
});

paintBtn.addEventListener("click", () => {
  erase = false;
  draw = !draw;
  if (draw) {
    container.style.cursor = "url('../public/icon/handwriting32.png'), default";
  } else {
    container.style.cursor = "default";
  }
});

gridWidthBtn.addEventListener("input", () => {
  widthValue.innerHTML =
    gridWidthBtn.value <= 9 ? `0${gridWidthBtn.value}` : gridWidthBtn.value;
});

gridHeightBtn.addEventListener("input", () => {
  heightValue.innerHTML =
    gridHeightBtn.value <= 9 ? `0${gridHeightBtn.value}` : gridHeightBtn.value;
});

window.onload = () => {
  container.style.cursor = "url('/public/icon/handwriting32.png'), default";
  gridHeightBtn.value = 0;
  gridWidthBtn.value = 0;
};

container.addEventListener("mouseenter", hideCircle);
container.addEventListener("mouseleave", showCircle);

////
container.addEventListener(
  "mouseenter",
  () => (appElement.style.backgroundColor = "#ffff")
);
container.addEventListener(
  "mouseleave",
  () => (appElement.style.backgroundColor = "#dadada")
);
appElement.addEventListener(
  "mouseenter",
  () => (appElement.style.backgroundColor = "#dadada")
);
appElement.addEventListener(
  "mouseleave",
  () => (appElement.style.backgroundColor = "#ffff")
);

//Download image
const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", function () {
  saveContainerAsImage(container);
});

function saveContainerAsImage(container) {
  html2canvas(container).then(function (canvas) {
    const link = document.createElement("a");
    link.download = "drawapp.png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

const pixelChoose = document.querySelector("#pixelChoose");
let pixel = false;

pixelChoose.addEventListener("click", (event) => {
  document.querySelectorAll(".gridCol").forEach((ele) => {
    if (!pixel) {
      ele.style.border = "none";
    } else ele.style.border = "1px solid #ddd";
  });
  pixel = !pixel;
  event.preventDefault();
});

// add star to GitHub
document.getElementById("starButton").addEventListener("click", function () {
  fetch("https://api.github.com/user/starred/Mahmoud-Walid/Draw_App", {
    method: "PUT",
    headers: {
      Authorization: "Bearer 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",
    },
  })
    .then((response) => {
      if (response.status === 204) {
        alert("تم وضع الستار بنجاح!");
      } else if (response.status === 404) {
        alert("الريبوزيتوري غير موجود على GitHub.");
      } else if (response.status === 401) {
        alert("غير مصرح لك بوضع الستار على الريبوزيتوري.");
      } else {
        alert("حدث خطأ ما.");
      }
    })
    .catch((error) => {
      alert("حدث خطأ ما.");
      console.error(error);
    });
});
