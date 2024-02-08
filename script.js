console.log("====================================");
console.log("Connected");
console.log("====================================");
document.addEventListener("DOMContentLoaded", function () {
  const staticImages = [
    "./assets/product/dress1.webp",
    "./assets/product/dress2.webp",
    "./assets/product/dress3.webp",
    "./assets/product/dress4.webp",
  ];

  // globally store the selected product into
  let currentColor;
  let currentSize;

  // Fetch data from the API
  fetch(
    "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/singleProduct.json"
  )
    .then((response) => response.json())
    .then((data) => {
      // Populate the HTML elements with data
      populateImages(staticImages);
      populateProductInfo(data.product);
      addEventListeners(data.product);
    })
    .catch((error) => console.error("Error fetching data:", error));

  // Function to populate main and small images
  function populateImages(images) {
    const mainImageContainer = document.querySelector(".main-image");
    const smallImagesContainer = document.querySelector(".small-images");

    mainImageContainer.innerHTML = `<img src="${images[0]}" alt="Main Image">`;

    images.forEach((image, index) => {
      const smallImage = document.createElement("img");
      smallImage.src = image;
      smallImage.alt = `Small Image ${index + 1}`;
      smallImagesContainer.appendChild(smallImage);

      smallImage.addEventListener("click", () => {
        // Cache the element:
        const mainImage = document.querySelector(".main-image img");
        mainImage.src = image;

        // Remove the 'selected' class from all small images
        document.querySelectorAll(".small-images img").forEach((smallImg) => {
          smallImg.classList.remove("selected");
        });

        // Add 'selected' class to the clicked small image
        smallImage.classList.add("selected");
      });
    });

    // Set the first small image as selected by default
    document.querySelector(".small-images img").classList.add("selected");
  }

  // Function to populate product information

  function populateProductInfo(product) {
    document.querySelector(".brand-name").textContent = product.vendor;
    document.querySelector(".product-title").textContent = product.title;
    document.querySelector(".product-price span").textContent =
      product?.price + ".00";
    document.querySelector(".compare-price span").textContent =
      product?.compare_at_price + ".00";
    document.querySelector(".product-description").innerHTML =
      product?.description;
  }

  // Function to add event listeners for color selection and add to cart button
  function addEventListeners(product) {
    const colorsContainer = document.querySelector(".colors");
    const sizesContainer = document.querySelector(".sizes");
    const quantityInput = document.querySelector(".quantity-buttons .qty");
    const addToCartButton = document.querySelector(".add-to-cart");
    const cartMessage = document.querySelector(".cart-message");

    // Populate colors
    product.options[0].values.forEach((color, index) => {
      const colorBox = document.createElement("div");
      colorBox.style.backgroundColor = Object.values(color)[0];
      colorsContainer.appendChild(colorBox);

      if (index === 0) {
        // Set the first color as selected by default
        colorBox.classList.add("selected");
        colorBox.innerHTML = `<img id="checkIcon" src="./assets/icons/check-white.svg" alt="Check">`;
        // set color
        currentColor = Object.keys(color)[0];
      }

      colorBox.addEventListener("click", () => {
        // Remove the 'selected' class from all color boxes
        colorsContainer.querySelectorAll("div").forEach((box) => {
          box.classList.remove("selected");
          box.innerHTML = "";
        });

        // Add 'selected' class to the clicked color box
        colorBox.classList.add("selected");
        colorBox.innerHTML = `<img id="checkIcon" src="./assets/icons/check-white.svg" alt="Check">`;
        currentColor = Object.keys(color)[0];
      });
    });

    // Populate sizes
    // Populate sizes
    product.options[1].values.forEach((size, index) => {
      const sizeDiv = document.createElement("div");
      const radioInput = document.createElement("input");
      radioInput.type = "radio";
      radioInput.name = "size";

      sizeDiv.appendChild(radioInput);
      sizeDiv.insertAdjacentHTML("beforeend", size);

      // Add 'selected' class to the first size by default
      if (index === 0) {
        sizeDiv.classList.add("selected");
        radioInput.checked = true; // Check the corresponding radio button
        currentSize = size;
      }

      sizesContainer.appendChild(sizeDiv);

      // Add event listener to size div
      sizeDiv.addEventListener("click", () => {
        // Remove the 'selected' class from all size divs
        sizesContainer.querySelectorAll("div").forEach((sizeDiv) => {
          sizeDiv.classList.remove("selected");
        });

        // Add 'selected' class to the clicked size div
        sizeDiv.classList.add("selected");
        currentSize = size;

        // Check the corresponding radio button
        radioInput.checked = true;
      });

      // Trigger click on the first size div to set it as selected
      if (index === 0) {
        sizeDiv.click();
      }
    });

    // Quantity buttons functionality
    const quantityMinusButton = document.querySelector(
      ".quantity-buttons .minus"
    );
    const quantityPlusButton = document.querySelector(
      ".quantity-buttons .plus"
    );

    quantityMinusButton.addEventListener("click", () => {
      let quantityValue = parseInt(quantityInput.textContent);

      if (quantityValue > 1) {
        quantityValue--;
        quantityInput.textContent = quantityValue;
      }
    });

    quantityPlusButton.addEventListener("click", () => {
      let quantityValue = parseInt(quantityInput.textContent);
      quantityValue++;
      quantityInput.textContent = quantityValue;
    });

    // Add to cart button functionality
    addToCartButton.addEventListener("click", () => {
      cartMessage.innerHTML = `
          <h3 id="message">${product.title} with Color ${currentColor} and Size ${currentSize} added to cart</h3>
      `;
    });
  }
});
