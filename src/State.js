import React, { useState, useEffect } from "react";
import "./State.css";

export default function State() {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [flag, setFlag] = useState(false);
    const [error, setError] = useState(null);

    const fetchData = async (url, setData) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setData(data);
        } catch (e) {
            console.error(e);
            setError(e.message);
        }
    };

    useEffect(() => {
        fetchData("https://crio-location-selector.onrender.com/countries", setCountries);
    }, []);

    const handleCountryChange = (e) => {
        setSelectedCountry(e.target.value);
        setSelectedState("");
        setSelectedCity("");
        setStates([]);
        setCities([]);
        setFlag(false);
        setError(null);
        if (e.target.value) {
            fetchData(`https://crio-location-selector.onrender.com/country=${e.target.value}/states`, setStates);
        }
    };

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
        setSelectedCity("");
        setCities([]);
        setFlag(false);
        setError(null);
        if (e.target.value) {
            fetchData(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${e.target.value}/cities`, setCities);
        }
    };

    const handleCityChange = (e) => {
        setSelectedCity(e.target.value);
        setFlag(true);
    };

    return (
        <div>
            <h1>Search Location</h1>
            {error && <p className="error">Error: {error}</p>}
            <div className="select">
                <select
                    className="selectItem1"
                    value={selectedCountry}
                    onChange={handleCountryChange}
                >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                        <option key={country} value={country}>{country}</option>
                    ))}
                </select>
                <select
                    className="selectItem"
                    value={selectedState}
                    onChange={handleStateChange}
                    disabled={!selectedCountry}
                >
                    <option value="">Select State</option>
                    {states.map((state) => (
                        <option key={state} value={state}>{state}</option>
                    ))}
                </select>
                <select
                    className="selectItem"
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={!selectedState}
                >
                    <option value="">Select City</option>
                    {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                    ))}
                </select>
            </div>

            {flag && selectedCity && selectedState && selectedCountry && (
                <h4>You selected {selectedCity}, {selectedState}, {selectedCountry}</h4>
            )}
        </div>
    );
}
