import { useState } from "react";
import axios from "axios";
import { getIcon } from "../lib/utils";
import swal from "sweetalert";
export function useFetch() {
  const [data, setData] = useState(null);
  const [error, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "https://api.openweathermap.org/data/2.5/weather?";

  async function fetchData(params) {
    setLoading(true);
    setErrors(null);
    try {
      await axios
        .get(BASE_URL, params)
        /*  setData(res.data) */
        .then((res) =>
          setData({
            name: res.data.name,
            description: res.data.weather[0].description,
            temp: res.data.main.temp.toFixed(0),
            tempmax: res.data.main.temp_max.toFixed(0),
            tempmin: res.data.main.temp_min.toFixed(0),
            sensation: res.data.main.feels_like.toFixed(0),
            icon: res.data.weather[0] && getIcon(res.data.weather[0].icon),
            wind: res.data.wind.speed.toFixed(0),
            humidity: res.data.main.humidity,
            clouds: res.data.clouds.all,
            date: res.data.dt,
            country: res.data.sys.country,
          })
        );
    } catch (error) {
      console.error("Error fetching data:", error);

      {
        swal(
          "Error ☹️ intente nuevamente ",
          `${error?.response?.data?.message}`,
          "error"
        );
      }
      if (error.response) {
        setErrors(error.response?.data?.cod);
      }
    } finally {
      setLoading(false);
    }
  }
  return { data, fetchData, error, setErrors, loading };
}
