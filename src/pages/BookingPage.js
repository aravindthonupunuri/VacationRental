import { useState, useEffect } from "react";
import * as React from "react";
import "../assets/css/Rentals.css";
import logo from "../assets/images/rentalLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ethers, utils } from "ethers";
import { useLocation } from "react-router";
import RentalsMap from "../components/RentalsMap";
import { Button, CircularProgress, Typography, Rating } from "@mui/material";
import Connect from "../components/Connect";

import DecentralAirbnb from "../artifacts/DecentralAirbnb.sol/DecentralAirbnb.json";
import { contractAddress, networkDeployedTo } from "../utils/contracts-config";
import networksMap from "../utils/networksMap.json";
import "../assets/css/bookingPage.css";

const BookingPage = () => {
  let navigate = useNavigate();
  const data = useSelector((state) => state.blockchain.value);
  const { state: rentaldata } = useLocation();
  const [loading, setLoading] = useState(false);




  const [reviews, setReviews] = useState([
    { id: 1, user: 'John', comment: 'Great place to stay!', rating: 4.5 },
    { id: 2, user: 'Jane', comment: 'Had a wonderful time here', rating: 5 },
    { id: 3, user: 'Joe', comment: 'Very clean and comfortable', rating: 4 },
    { id: 4, user: 'Jenny', comment: 'The view is amazing!', rating: 5 },
    { id: 5, user: 'Jim', comment: 'Highly recommended!', rating: 4.5 },
    { id: 6, user: 'Jessica', comment: 'Will definitely come back', rating: 5 },
  ]);

  const datefrom = Math.floor(rentaldata.checkIn.getTime() / 1000);
  const dateto = Math.floor(rentaldata.checkOut.getTime() / 1000);

  const dayToSeconds = 86400;
  const bookPeriod = ((dateto - datefrom) / dayToSeconds);
  const totalBookingPriceUSD = Number(rentaldata.price) * (bookPeriod);
  console.log(rentaldata.image);
  const bookProperty = async () => {
    if (data.network == networksMap[networkDeployedTo]) {
      console.log("aaa0")
      try {
        setLoading(true);
        const provider = new ethers.providers.Web3Provider(
          window.ethereum,
          "any"
        );
        const signer = provider.getSigner();
        const AirbnbContract = new ethers.Contract(
          contractAddress,
          DecentralAirbnb.abi,
          signer
        );
        console.log("aaa1")


        const totalBookingPriceETH = await AirbnbContract.convertFromUSD(
          utils.parseEther(totalBookingPriceUSD.toString(), "ether")
        );
        console.log(rentaldata.id)
        console.log(datefrom);
        console.log(dateto);
        console.log(totalBookingPriceETH);

        const book_tx = await AirbnbContract.bookDates(
          rentaldata.id,
          datefrom,
          dateto,
          { value: totalBookingPriceETH }
        );
        console.log("aaa3")
        await book_tx.wait();
        console.log("aaa4")
        setLoading(false);
        navigate("/dashboard");
      } catch (err) {
        setLoading(false);
        console.log(err);
        window.alert("An error has occured, please try again");
      }
    } else {
      setLoading(false);
      window.alert(
        `Please Switch to the ${networksMap[networkDeployedTo]} network`
      );
    }
  };






  return (
    <>
      <div className="topBanner">
        <div>
          <Link to="/">
            <img className="logo" src={logo} alt="logo"></img>
          </Link>
        </div>

        <div className="lrContainers">
          <Connect />
        </div>
      </div>

      <hr className="line" />
      <div className="rental-page">
        <div className="rental-details">
          <div className="rentalinternaldiv">
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={rentaldata.image} alt="Rental" height="200" width="300" />
              <div style={{ marginLeft: "20px" }}>
                <h4>{rentaldata.name}</h4>
                <h6> {rentaldata.city}</h6>
                <p>{rentaldata.description}</p>
                <h6>${rentaldata.price}/day</h6>
              </div>
            </div>
            <div className="reviews">
              <Typography variant="h6" gutterBottom>
                Reviews
              </Typography>
              <div className="reviews-list">
                {reviews.map((review) => (
                  <div key={review.id} className="review">
                    <Typography variant="subtitle1" gutterBottom>
                      <strong>{review.user}</strong>
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {review.comment}
                    </Typography>
                    <Typography variant="subtitle2" gutterBottom>
                      <span>Rating:</span>
                      <Rating name="read-only" value={review.rating} precision={0.5} readOnly />
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="cost-details">
          <Typography variant="h6" gutterBottom>
            Cost Details
          </Typography>
          <Typography variant="body1" gutterBottom>
            Cost per day: ${rentaldata.price}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Check-in day: {rentaldata.checkIn.toLocaleDateString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Check-out day: {rentaldata.checkOut.toLocaleDateString()}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total days: {bookPeriod}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Total price: ${totalBookingPriceUSD}
          </Typography>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              bookProperty();
            }}
          >
            {loading ? (
              <CircularProgress color="inherit" />
            ) : (
              "Book"
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

export default BookingPage;