import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const app = Vue.createApp({
  data() {
    return {
      sensors: [], // Sensor data from the API
      error: null, // Error message
      temperatureData: [],
      soundData: [],
    };
  },
  methods: {
    async fetchSensors() {
      try {
        const response = await axios.get("http://localhost:5131/api/sensors"); // Ensure backend is running
        const sensorData = response.data;
        this.sensors = sensorData; // Store the data in the sensors array

        // Update temperature data
        this.temperatureData = sensorData
          .filter((sensor) => sensor.sensorType === "Temperature")
          .map((sensor) => ({
            x: new Date(sensor.lastMeasurement),
            y: sensor.currentValue,
          }));

        // Update sound data
        this.soundData = sensorData
          .filter((sensor) => sensor.sensorType === "Sound")
          .map((sensor) => ({
            x: new Date(sensor.lastMeasurement),
            y: sensor.currentValue,
          }));

        this.updateCharts();
      } catch (error) {
        this.error = "Failed to fetch sensor data.";
        console.error(error);
      }
    },
    updateCharts() {
      // Update temperature chart
      temperatureChart.data.datasets[0].data = this.temperatureData;
      temperatureChart.update();

      // Update sound chart
      soundChart.data.datasets[0].data = this.soundData;
      soundChart.update();
    },
  },
  created() {
    this.fetchSensors(); // Fetch data when the component is created
    setInterval(this.fetchSensors, 5000); // Fetch data every 5 seconds
  },
});

// Initialize charts
const temperatureChart = new Chart(document.getElementById("temperatureChart"), {
  type: "line",
  data: {
    datasets: [
      {
        label: "Temperature (°C)",
        data: [],
        borderColor: "red",
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
        },
      },
    },
  },
});

const soundChart = new Chart(document.getElementById("soundChart"), {
  type: "line",
  data: {
    datasets: [
      {
        label: "Sound (dB)",
        data: [],
        borderColor: "blue",
        borderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
        },
        title: {
          display: true,
          text: "Time",
        },
      },
      y: {
        title: {
          display: true,
          text: "Sound (dB)",
        },
      },
    },
  },
});

app.mount("#app");
