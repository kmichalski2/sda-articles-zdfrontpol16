const addAlert = (message) => {
  const alerts = document.querySelector("#alerts");

  const alert = document.createElement("div");
  alert.innerHTML = message;
  alert.classList.add("alert", "alert-warning", "mb-3");
  alerts.appendChild(alert);
};

const createAlertsContainer = () => {
  const alertsElement = `<div class="position-fixed bottom-0 w-100">
  <div class="container" id="alerts"></div>
  </div>`;

  const body = document.querySelector("body");
  document.body.innerHTML += alertsElement;
};

export const displayAlert = (message) => {
  const alerts = document.querySelector("#alerts");

  if (!alerts) {
    createAlertsContainer();
  }
  addAlert(message);

  // if (alerts) {
  //   addAlert(message);
  // } else {
  //   createAlertsContainer();
  //   addAlert(message);
  // }
};
