"use strict";

console.log("Hello world!");

function urlAddress() {
  return "http://localhost:8080";
}

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

document.addEventListener("DOMContentLoaded", fetchMad);
