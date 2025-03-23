const inventory = () => {
  fetch("http://localhost:3000/api/update-taxi-inventory", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => console.log(data));
};

inventory();