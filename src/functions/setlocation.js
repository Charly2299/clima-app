/* OBTENIENDO COORDENADAS */
 export const setLocation = () => {
    function success(pos) {
      const crd = pos.coords;

      setCoords({
        lat: crd.latitude,
        lon: crd.longitude,
      });
    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error);
    setCityName("");
  };