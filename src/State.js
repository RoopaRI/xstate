import React, { useState, useEffect } from "react";
import "./State.css";
import Select from "react-select";

export default function State() {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null); // Added state for selected city
    const [flag, setFlag] = useState(false);

    const fetchData = async (url, setData) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const options = data.map(item => ({ value: item, label: item }));
            setData(options);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchData("https://crio-location-selector.onrender.com/countries", setCountries);
    }, []);

    const handleCountryChange = (selectedOption) => {
        setSelectedCountry(selectedOption);
        setSelectedState(null); // Reset state when country changes
        setSelectedCity(null); // Reset city when country changes
        setStates([]); // Reset states when country changes
        setCities([]); // Reset cities when country changes
        setFlag(false); //Reset the flag. Otherwise for the next select of country it will show runtime error
        if (selectedOption) {
            fetchData(`https://crio-location-selector.onrender.com/country=${selectedOption.value}/states`, setStates);
        }
    };

    const handleStateChange = (selectedOption) => {
        setSelectedState(selectedOption);
        setSelectedCity(null); // Reset city when state changes
        setCities([]); // Reset cities when state changes
        setFlag(false);
        if (selectedOption) {
            fetchData(`https://crio-location-selector.onrender.com/country=${selectedCountry.value}/state=${selectedOption.value}/cities`, setCities);
        }
    };

    const handleCityChange = (selectedOption) => {
        setSelectedCity(selectedOption);
        setFlag(true);
    }

    return (
        <div>
            <h1>Search Location</h1>
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

            {flag ? <h4>You Selected {selectedCity.label}, {selectedState.label}, {selectedCountry.label}</h4> : null}
        </div>
    );
}