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
    <div>
      <input
        type="descripcion"
        temp={temp}
        value={searchTerm}
        onChange={handleInputChange}
        style={styles.input}
      />
      <button onClick={handleSearch}>
       Buscar
      </button>
    </div>
  );
};

export default SearchBar;
