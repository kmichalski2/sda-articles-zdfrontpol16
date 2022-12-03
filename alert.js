const addAlert = (message) => {
  const alerts = document.querySelector("#alerts");

  const alert = document.createElement("div");
  alert.innerHTML = message;
  alert.classList.add("alert", "alert-warning", "mb-3");
  alerts.appendChild(alert);

  removeAlertAfterTimeout(alert, 3000);
};

const removeAlertAfterTimeout = (alert, timeout) => {
  setTimeout(() => {
    alert.remove();
  }, timeout);
};

const createAlertsContainer = () => {
  // const alertsElement = `<div class="position-fixed bottom-0 w-100">
  // <div class="container" id="alerts"></div>
  // </div>`;

  // const body = document.querySelector("body");
  // document.body.innerHTML += alertsElement;

  const alertsElement = document.createElement("div");
  alertsElement.classList.add("position-fixed", "bottom-0", "w-100");

  // Sposób 1
  const alertsContainer = document.createElement("div");
  alertsContainer.classList.add("container");
  alertsContainer.id = "alerts";
  alertsElement.appendChild(alertsContainer);

  // Sposób 2
  // alertsElement.innerHTML = `<div class="container" id="alerts"></div>`;

  document.body.appendChild(alertsElement);
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
