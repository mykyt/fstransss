window.addEventListener("scroll", function () {
  var header = document.querySelector("header");
  header.classList.toggle("sticky", window.scrollY > 0);
});

document.addEventListener("DOMContentLoaded", function () {
  var yearSelect = document.getElementById("yearSelect");
  var makeSelect = document.getElementById("makeSelect");
  var modelSelect = document.getElementById("modelSelect");
  var carForm = document.getElementById("carForm");

  // Define the list of desired makes
  var desiredMakes = [
    "ACURA",
    "ALFA ROMEO",
    "ASTON MARTIN",
    "AUDI",
    "BENTLEY",
    "BMW",
    "BUGATTI",
    "BUICK",
    "CADILLAC",
    "CATERHAM",
    "CHEVROLET",
    "CHRYSLER",
    "DODGE",
    "FERRARI",
    "FIAT",
    "FORD",
    "GMC",
    "HONDA",
    "HYUNDAI",
    "INFINITI",
    "JAGUAR",
    "JEEP",
    "KIA",
    "LAMBORGHINI",
    "LAND ROVER",
    "LEXUS",
    "LINCOLN",
    "LOTUS",
    "MASERATI",
    "MAZDA",
    "MERCEDES BENZ",
    "MINI",
    "MITSUBISHI",
    "NISSAN",
    "PORSCHE",
    "RAM TRUCKS",
    "ROLLS ROYCE",
    "SMART",
    "SUBARU",
    "TOYOTA",
    "TESLA",
    "VOLKSWAGEN",
    "VOLVO",
  ];

  // Populate the year select options
  var currentYear = new Date().getFullYear();
  var startYear = currentYear - 40; // Assuming cars from the last 40 years are relevant
  for (var year = currentYear; year >= startYear; year--) {
    var option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }

  // Disable the make and model fields initially
  makeSelect.disabled = true;
  modelSelect.disabled = true;

  // Clear make and model fields when the year changes
  yearSelect.addEventListener("change", function () {
    makeSelect.value = "";
    modelSelect.innerHTML = '<option value="">Select Model</option>';
    makeSelect.disabled = false; // Enable the make field
    modelSelect.disabled = true; // Disable the model field
    loadMakes();
  });

  // Load all available makes based on the selected year
  function loadMakes() {
    var year = yearSelect.value;
    makeSelect.innerHTML = '<option value="">Select Make</option>';

    if (year !== "") {
      // Make the API request to fetch all available makes for the selected year
      fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetMakesForVehicleType/car?year=${year}&format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          var makes = data.Results.map((make) => make.MakeName).filter((make) =>
            desiredMakes.includes(make)
          ); // Filter out undesired makes
          makes.sort(); // Sort makes alphabetically
          makes.forEach(function (make) {
            var option = document.createElement("option");
            option.value = make;
            option.textContent = make;
            makeSelect.appendChild(option);
          });
        })
        .catch((error) => {
          console.error("Error: " + error);
        });
    }
  }

  // Load all available models based on the selected make and year
  function loadModels() {
    var make = makeSelect.value;
    var year = yearSelect.value;
    modelSelect.innerHTML = '<option value="">Select Model</option>';

    if (make !== "" && year !== "") {
      // Make the API request to fetch all available models for the selected make and year
      fetch(
        `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}?format=json`
      )
        .then((response) => response.json())
        .then((data) => {
          var models = data.Results.map((model) => model.Model_Name);
          models.sort(); // Sort models alphabetically
          models.forEach(function (model) {
            var option = document.createElement("option");
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
          });

          modelSelect.disabled = false; // Enable the model field
        })
        .catch((error) => {
          console.error("Error: " + error);
        });
    }
  }

  // Handle make selection change
  makeSelect.addEventListener("change", function () {
    loadModels();
  });

  // Handle form submission
  carForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting normally

    var year = yearSelect.value;
    var make = makeSelect.value;
    var model = modelSelect.value;

    // Make the API request
    fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/GetModelsForMakeYear/make/${make}/modelyear/${year}/model/${model}?format=json`
    )
      .then((response) => response.json())
      .then((data) => {
        // Handle the API response here
        console.log(data);
      })
      .catch((error) => {
        console.error("Error: " + error);
      });
  });
});

let burger = document.querySelector(".burger");
let nav = document.querySelector(".nav");
let navLinks = document.querySelectorAll(".nav__link");
let body = document.querySelector("body");
let isNavOpen = false;

burger.addEventListener("click", (event) => {
  event.stopPropagation(); // Prevent the body click event from firing
  toggleNav();
});

body.addEventListener("click", () => {
  if (isNavOpen) {
    closeNav();
  }
});

function toggleNav() {
  nav.classList.toggle("nav--active");
  navLinks.forEach((link, index) => {
    if (link.style.animation) {
      link.style.animation = "";
    } else {
      link.style.animation = `navLinksFade 0.5s ease forwards ${
        index / 5 + 0
      }s`;
    }
  });
  burger.classList.toggle("toggle");
  isNavOpen = !isNavOpen;
}

function closeNav() {
  nav.classList.remove("nav--active");
  navLinks.forEach((link) => {
    link.style.animation = "";
  });
  burger.classList.remove("toggle");
  isNavOpen = false;
}
