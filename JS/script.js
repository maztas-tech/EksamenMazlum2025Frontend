"use strict";

function urlAddress() {
  return "http://localhost:8080";
}

// Reload the page every 60 seconds
setInterval(function () {
  location.reload();
}, 60000);

async function fetchDeliveries() {
  try {
    const url = urlAddress() + "/deliveriesNotDelivered";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse the JSON response

    // Sortér leveringerne efter 'forventetLevering' (nyeste først)
    data.sort((a, b) => {
      const dateA = new Date(`1970-01-01T${a.forventetLevering}:00`);
      const dateB = new Date(`1970-01-01T${b.forventetLevering}:00`);

      return dateA - dateB; // Sorter i stigende rækkefølge (nyeste først)
    });

    const tableBody = document.getElementById("tableBody");

    tableBody.innerHTML = ""; // Clear the table before inserting new rows

    // Læs dataene ind i tabellen
    data.forEach(loadData);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

function loadData(data, index) {
  const tableBody = document.getElementById("tableBody");

  const tr = document.createElement("tr");

  const isDrone = data.drone ? "Drone tilføjet" : "Tilføj drone";

  const isDisabled = data.drone ? "disabled" : "";

  const faktiskLevering = data.faktiskLevering
    ? data.faktiskLevering
    : "Afventer svar";

  tr.innerHTML = `
              <td>${data.adresse}</td>
              <td>${data.forventetLevering}</td>
              <td>${faktiskLevering}</td>
              <td>
                  <button class='addDroneBtn' id='addDroneBtn${index}' data-index='${index}' ${isDisabled}>${isDrone}</button>
              </td>
          `;

  tr.row = index;

  tableBody.appendChild(tr);

  const addDroneBtn = document.getElementById("addDroneBtn" + index);

  // addDroneBtn
  addDroneBtn.addEventListener("click", () => {
    addDrone(data);
  });
}

// POST method to add a drone to the delivery
async function addDrone(data) {
  try {
    const url = `http://localhost:8080/deliveries/schedule/${data.leveringID}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    fetchDeliveries();
    alert("Drone er blevet tilføjet");
  } catch (error) {
    console.error("Error adding drone:", error);
    alert("Failed to assign drone to delivery.");
  }
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
      } else {
        alert("Error creating drone.");
      }
    })
    .catch((error) => {
      console.error("Error creating drone:", error);
    });
}

document.addEventListener("DOMContentLoaded", fetchDeliveries);
