import React, { useState, useEffect } from "react";
import "./State.css";
import Select from "react-select";

export default function State() {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [flag, setFlag] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (url, setData) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            const options = data.map(item => ({ value: item, label: item }));
            setData(options);
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    useEffect(() => {
        fetchData("https://crio-location-selector.onrender.com/countries", setCountries);
    }, []);

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setSelectedState(null);
        setSelectedCity(null);
        setStates([]);
        setCities([]);
        setFlag(false);
        setError(null);
        if (selectedOption) {
            fetchData(`https://crio-location-selector.onrender.com/country=${selectedOption.value}/states`, setStates);
        }
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setSelectedCity(null);
        setCities([]);
        setFlag(false);
        setError(null);
        if (selectedOption) {
            fetchData(`https://crio-location-selector.onrender.com/country=${selectedCountry.value}/state=${selectedOption.value}/cities`, setCities);
        }
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        setFlag(true);
    };

    return (
        <div>
            <h1>Search Location</h1>
            {error && <p className="error">Error: {error}</p>}
            <div className="select">
                <Select
                    className="selectItem1"
                    placeholder="Select Country"
                    options={countries}
                    value={selectedCountry}
                    onChange={handleCountryChange}
                />
                <Select
                    className="selectItem"
                    placeholder="Select State"
                    options={states}
                    value={selectedState}
                    onChange={handleStateChange}
                    isDisabled={!selectedCountry}
                />
                <Select
                    className="selectItem"
                    placeholder="Select City"
                    options={cities}
                    value={selectedCity}
                    onChange={handleCityChange}
                    isDisabled={!selectedState}
                />
            </div>

            {flag && selectedCity && selectedState && selectedCountry && (
                <h4>You selected {selectedCity.label}, {selectedState.label}, {selectedCountry.label}</h4>
            )}
        </div>
    );
}