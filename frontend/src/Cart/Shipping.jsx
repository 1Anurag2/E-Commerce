import React from "react";
import "../CartStyles/Shipping.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import { toast } from 'react-toastify';
import { saveShippingInfo } from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";

function Shipping() {
  const { shippingInfo } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const [address, setAddress] = React.useState(shippingInfo.address || "");
  const [city, setCity] = React.useState(shippingInfo.city || "");
  const [state, setState] = React.useState(shippingInfo.state || "");
  const [country, setCountry] = React.useState(shippingInfo.country || "");
  const [pinCode, setPinCode] = React.useState(shippingInfo.pinCode || "");
  const [phoneNo, setPhoneNo] = React.useState(shippingInfo.phoneNo || "");

  const navigate=useNavigate()

  const shippingInfoSubmit = (e) => {
    e.preventDefault();
    if(phoneNo.length !== 10){
      toast.error('Invalid Phone Number ! It should be 10 digits',{
        position:'top-center',autoClose:2000})
        return;
    }
    dispatch(saveShippingInfo({address,pinCode,phoneNo,country,state,city}))
    navigate('/order/confirm')
  };
  return (
    <>
      <PageTitle title="Shipping Info" />
      <CheckoutPath activePath={0} />
      <Navbar />
      <div className="shipping-form-container">
        <h1 className="shipping-form-header">Shipping Details</h1>
        <form className="shipping-form" onSubmit={shippingInfoSubmit}>
          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            <div className="shipping-form-group">
              <label htmlFor="pinCode">Pin Code</label>
              <input
                type="number"
                id="pinCode"
                name="pinCode"
                placeholder="Enter your pin code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                required
              />
            </div>
            <div className="shipping-form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phoneNumber"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Select Country</option>
                {Country && Country.getAllCountries().map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="shipping-form-group">
              <label htmlFor="state">State</label>
              <select
                id="state"
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              >
                <option value="">Select State</option>
                {State && State.getStatesOfCountry(country).map((item) => (
                  <option value={item.isoCode} key={item.isoCode}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="shipping-form-group">
              <label htmlFor="city">City</label>
              <select
                id="city"
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              >
                <option value="">Select City</option>
                {City &&  City.getCitiesOfState(country, state).map((item) => (
                  <option value={item.name} key={item.isoCode}>{item.name}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="shipping-submit-btn">Continue</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default Shipping;
