"use strict";

console.log("Hello world!");

function urlAddress() {
  return "http://localhost:8080";
}

// This function will reload the page every 60 seconds
setInterval(function () {
  location.reload(); // Reloads the entire page
}, 60000); // 60000 milliseconds = 60 seconds

async function fetchMad() {
  try {
    const url = urlAddress() + "/deliveries/queue";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON response
    const tableBody = document.getElementById("tableBody"); // Ensure this matches your HTML

    tableBody.innerHTML = ""; // Clear the table before inserting new rows

    data.forEach(loadData);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

function loadData(data, index) {
  const tableBody = document.getElementById("tableBody");

  const tr = document.createElement("tr");

  tr.innerHTML = `
              <td>${data.adresse}</td>
              <td>${data.forventetLevering}</td>
              <td>${data.faktiskLevering}</td>
              <td>
                  <button class='editBtn' id='editBtn${index}' data-index='${index}'>Rediger</button>
              </td>
              <td>
                  <button class='deleteBtn' id='deleteBtn${index}' data-index='${index}'>Slet</button>
              </td>
          `;

  tr.row = index;

  tableBody.appendChild(tr);

  const editBtn = document.getElementById("editBtn" + index);
  const deleteBtn = document.getElementById("deleteBtn" + index);

  //editBtn
  editBtn.addEventListener("click", () => {
    editMad(data);
  });
  //deleteBtn
  deleteBtn.addEventListener("click", () => {
    deleteMad(data);
  });
}

// This function will be called when the page loads
window.onload = function () {
  // Add an event listener to the button for creating a new drone
  document
    .getElementById("createDroneButton")
    .addEventListener("click", createNewDrone);
};

// Function to create a new drone
function createNewDrone() {
  fetch("http://localhost:8080/drones/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        alert("New drone created successfully!");
        // Optionally, you can refresh or update the data on the page here
      } else {
        alert("Error creating drone.");
      }
    })
    .catch((error) => {
      console.error("Error creating drone:", error);
    });
}

document.addEventListener("DOMContentLoaded", fetchMad);
