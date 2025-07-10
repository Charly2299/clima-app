import { useEffect, useState, useRef } from "react";
import { useFetch } from "../hooks/useFetch";
import {
  Search,
  MapPinHouse,
  BrushCleaning,
  MapPin,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Droplets,
  Wind,
  Cloudy,
} from "lucide-react";

import Spinner from "./Spinner";
import swal from "sweetalert";

function Weather() {
  const { data, fetchData } = useFetch();
  const [coords, setCoords] = useState(null);
  const [cityName, setCityName] = useState("Mexico City");
  /* const [search, setSearch] = useState(""); */
  const [units, setUnits] = useState("metric");
  const [unitsText, setUnitsText] = useState("C°");
  const [unitsButton, setUnitsButton] = useState("F°");
  const [unitsWind, setUnitsWind] = useState("m/s");
  const [texto, setTexto] = useState("Texto inicial");
  const [text, setText] = useState("Texto inicial");
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    // Simula una carga de 2 segundos (reemplaza por tu fetch real)
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  /* OBTENIENDO DATOS BASADO A cityName */
  useEffect(() => {
    const weatherApiConfigCity = {
      params: {
        q: cityName,
        units: units,
        lang: "es",
        appid: "ba51a806210e7ada1bca84d55982bfcf",
      },
    };

    if (!cityName) return;
    fetchData(weatherApiConfigCity);
  }, [cityName, units]);

  /* OBTENIENDO DATOS BASADO A cooords obtenidas del botton seLocation */
  useEffect(() => {
    const weatherApiConfigCoords = {
      params: {
        lat: coords?.lat,
        lon: coords?.lon,
        units: units,
        lang: "es",
        appid: "ba51a806210e7ada1bca84d55982bfcf",
      },
    };
    if (!coords) return;
    fetchData(weatherApiConfigCoords);
  }, [coords, units]);

  /* CONDICION SI CITYNAME NI COORDS ESTAN */
  useEffect(() => {
    if (!cityName && !coords) {
      setCityName("");
    }
  }, [coords, cityName]);

  /* OBTENIENDO COORDENADAS */
  const setLocation = () => {
    function success(pos) {
      const crd = pos.coords;

      setCoords({
        lat: crd?.latitude,
        lon: crd?.longitude,
      });
      setText("Texto cambiado " + Math.random());
      setTexto("Texto cambiado " + Math.random());
    }

    /*   function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    } */

    navigator.geolocation.getCurrentPosition(success);
    setCityName("");
  };

  /* LIMPIADO DE COORDS Y CITYNAME */
  const crearAll = () => {
    setCoords(null);
    setCityName("Mexico City");
    setText("Texto cambiado " + Math.random());
    setTexto("Texto cambiado " + Math.random());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputRef.current.value.trim()) {
      swal("🫢", "No dejes vacio el campo!", "warning");
      return;
    }

    setCityName(inputRef.current.value);
    inputRef.current.value = "";
    setText("Texto cambiado " + Math.random());
    setTexto("Texto cambiado " + Math.random());
  };

  const handleTemp = () => {
    setTexto("Texto cambiado " + Math.random());
    if (units === "metric") {
      setUnits("imperial");
      setUnitsWind("mph");
    } else {
      setUnits("metric");
      setUnitsWind("m/s");
    }

    unitsText === "F°" ? setUnitsText("C°") : setUnitsText("F°");

    unitsText === "C°" ? setUnitsButton("C°") : setUnitsButton("F°");
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="weather__container ">
      {/* {error && <p>{error}</p>}
      {loading && <p>Loading...</p>} */}

      {data && (
        <div
          className="weather__content
        "
        >
          <div className="weather__header">
            <form onSubmit={handleSubmit} className="weather__search">
              <Search
                className="
              weather__search-icon 
              weather__icon
              text-sky-50
              
              "
              />
              <input
                title="Escribe una ciudad o país"
                ref={inputRef}
                type="text"
                /*   value={inputRef} */
                onChange={() => inputRef?.current?.value}
                placeholder="Buscar..."
                className=" 
                weather__search-input
        border-1 border-indigo-500/50

               
               
                focus:outline-2 
                focus:outline-offset-2 
                focusex-:outline-violet-500
                "
              />
            </form>
            <button title="Ubicación en timepo real" onClick={setLocation}>
              <MapPinHouse
                className="
              weather__icon
              "
              />
            </button>
            <button title="Limmpia" onClick={crearAll}>
              <BrushCleaning
                className="
              weather__icon
              "
              />
            </button>
            <button title={`Convierte a ${unitsButton}`} onClick={handleTemp}>
              <p
                key={texto}
                className=" 
             text-focus-in
              weather__icon-text"
              >
                {unitsButton}
              </p>
            </button>
          </div>

          <div
            className="weather__container-total
          flex flex-col m-3 p-4 gap-3
        "
          >
            <div
              className="weather__data flex flex-col sm:flex-row 
         justify-evenly items-center border-2 border-indigo-500/50
rounded-xl gap-1
          "
            >
              {isLoading && <Spinner />}

              <div className="weather__data-principal flex justify-evenly flex-col  items-center">
                <svg
                  fill="#646cff"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  width={100}
                  height={150}
                  viewBox="0 -5 35 42"
                >
                  <path key={text} className="text-focus-in" d={data.icon} />
                </svg>
                <p
                  key={texto}
                  className=" text-focus-in weather__data-text"
                >
                  {data.temp} {unitsText}
                </p>
              </div>

              <div className="weather__data-info flex justify-evenly flex-col items-center p-3 ">
                <div
                  className="weather__data-country
                flex flex-row"
                >
                  <MapPin className="weather__icon-country" />
                  <p
                    key={text}
                    className=" 
             text-focus-in-2 weather__data-text"
                  >
                    {data.name}, {data.country}
                  </p>
                </div>

                <p
                  key={text}
                  className=" 
             text-focus-in 
             weather__data-text-info"
                >
                  {data.description}
                </p>
              </div>
            </div>

            <div
              className="weather__details
          flex flex-row sm:flex-col 
         justify-evenly border-2 border-indigo-500/50
          bg-gray-600/60 
rounded-xl


          "
            >
              <div className="weather__details-fisrt flex flex-col sm:flex-row justify-evenly">
                <div className="weather__details-info">
                  <p>Sensación</p>
                  <Thermometer className="weather__details-info-icon" />
                  <p
                    key={texto}
                    className=" 
             text-focus-in"
                  >
                    {data.sensation}
                    {unitsText}
                  </p>
                </div>
                <div className="weather__details-info">
                  <p>Máxima</p>
                  <ThermometerSun className="weather__details-info-icon" />
                  <p
                    key={texto}
                    className=" 
             text-focus-in"
                  >
                    {data.tempmax}
                    {unitsText}
                  </p>
                </div>
                <div className="weather__details-info">
                  <p>Mínima</p>
                  <ThermometerSnowflake className="weather__details-info-icon" />
                  <p
                    key={texto}
                    className=" 
             text-focus-in"
                  >
                    {data.tempmin}
                    {unitsText}
                  </p>
                </div>
              </div>

              <div className="weather__details-second flex flex-col sm:flex-row justify-evenly">
                <div
                  className="weather__details-info
            "
                >
                  <p>Viento</p>
                  <Wind className="weather__details-info-icon" />

                  <p
                    key={texto}
                    className=" 
             text-focus-in"
                  >
                    {data.wind}
                    {unitsWind}
                  </p>
                </div>
                <div className="weather__details-info">
                  <p>Humedad</p>
                  <Droplets className="weather__details-info-icon" />
                  <p
                    key={texto}
                    className=" 
             text-focus-in"
                  >
                    {data.humidity}%
                  </p>
                </div>
                <div className="weather__details-info">
                  <p>Nubes</p>
                  <Cloudy className="weather__details-info-icon" />
                  <p
                    key={texto}
                    className=" 
             text-focus-in"
                  >
                    {data.clouds}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Weather;
