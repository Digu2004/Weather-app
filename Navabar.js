import React, { useState } from 'react';

// Navbar component receives a function 'onInputChange' as a prop
export default function Navabar({ onInputChange }) {
  // State to store the value typed in the search input
  const [inputValue, setInputValue] = useState("");

  // Function to update state whenever user types in the input box
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  // Function that runs when the search button is clicked
  const handleClick = (e) => {
    e.preventDefault(); // Prevents the page from refreshing on form submit
    if (inputValue.trim() === "") return; // Do nothing if input is empty
    onInputChange(inputValue); // Pass the typed value to the parent component
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        {/* Brand name/logo on the navbar */}
        <a className="navbar-brand" href="#">Weather Api</a>

        {/* Button for toggling navbar menu on small screens */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Left side of the navbar: navigation links */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Weather</a></li>
            <li className="nav-item"><a className="nav-link" href="#">Forecast</a></li>
            <li className="nav-item"><a className="nav-link disabled">About</a></li>
          </ul>

          {/* Right side of the navbar: search form */}
          <form className="d-flex">
            {/* Input box for user to type search query */}
            <input 
              className="form-control me-2" 
              type="search" 
              placeholder="Search" 
              onChange={handleChange} 
            />
            {/* Search button */}
            <button 
              className="btn btn-outline-success" 
              type="submit" 
              onClick={handleClick}
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
