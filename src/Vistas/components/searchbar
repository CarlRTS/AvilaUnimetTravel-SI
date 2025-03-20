import React, { useState } from "react";

const SearchBar = ({ temp, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value); //Manejador de los parametros ingresados por el usuario
  };

  const handleSearch = () => {
    onSearch(searchTerm); //Manejador de la funcion search
  };

  return (
    <div style={styles.container}>
      <input
        type="descripcion"
        temp={temp}
        value={searchTerm}
        onChange={handleInputChange}
        style={styles.input}
      />
      <button onClick={handleSearch} style={styles.button}>
       Buscar
      </button>
    </div>
  );
};

export default SearchBar;
