import React, { useState } from "react";
import "./Navbar.css";
import {useMoralis} from 'react-moralis'

import { MdPictureInPictureAlt } from "react-icons/md";
import { Button, Modal, Input, Typography } from "antd";
import { GiShoppingCart } from "react-icons/gi";

import { useApiContext } from "../utils/ApiCode";
import { Link } from "react-router-dom";
import Cart from "./Cart";
import profile from "../assets/profile1.jpg";
import Profile from "./profile";
import { useIntegraContext } from "../utils/integration";


import ConnectWallet from "./connectwallet";

const Navbar = () => {
  const { Category, productid } = useApiContext();
  const { Search } = Input;

  const { handleOk } = useIntegraContext();
  const { Title } = Typography;
  const {isAuthenticated, account} = useMoralis();

  const [showcategory, setshowcategory] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [connect, setConnect] = useState(false);
  const [uns, setUns] = useState(false)

  return (
    <div>
      <div className="Navbar">
        <Title level={3}>
          <Link to="/">Debay</Link>
        </Title>

        <Search
          style={{ width: "500px", marginLeft: "-20px" }}
          size="large"
          placeholder="input search text"
          onSearch
          enterButton
        />

        <Button
          style={{
            display: "flex",
            justifyItems: "center",
            marginLeft: "10px",
            marginTop: "5px",
          }}
          onClick={() => setConnect(true)}
        >
          <strong>
            <img
              height="20px"
              width="30px"
              style={{ marginRight: "5px", marginTop: "-4px" }}
              src={profile}
              alt="profile"
            />
          </strong>
         {isAuthenticated || uns ? account : "Connect Wallet"}
        </Button>

        <ConnectWallet connect={connect} setConnect={setConnect} setUns={setUns} />

        <div>
          {" "}
          <Button
            style={{
              backgroundColor: "transparent",
              border: "none",
              marginRight: "15px",
            }}
            onClick={() => setShowCart(true)}
            icon={<GiShoppingCart size={"30px"} />}
          ></Button>
          <Modal
            title="Items in Cart"
            visible={showCart}
            onCancel={() => setShowCart(false)}
            onOk={() => handleOk(productid)}
            okText="Proceed"
          >
            <Cart />
          </Modal>
          <Button
            onClick={() => setShowProfile(true)}
            style={{
              backgroundColor: "transparent",
              border: "none",
              marginRight: "10px",
            }}
            icon={<MdPictureInPictureAlt size={"30px"} />}
          ></Button>
          <Modal
            title="Profile"
            visible={showProfile}
            style={{ backgroundColor: "royalblue", color: "black" }}
            footer={[
              <Button onClick={() => setShowProfile(false)}>Close</Button>,
            ]}
          >
            <Profile />
          </Modal>
         
        </div>
      </div>
      <div style={{ backgroundColor: "black", display: "flex" }}>
        <strong
          className="sub-category"
          onClick={() =>
            showcategory ? setshowcategory(false) : setshowcategory(true)
          }
        >
          Categories >
        </strong>
        {showcategory && (
          <div className="showcategory" style={{ marginTop: "0.7rem" }}>
            {Category.map((item) => (
              <Link
                style={{ color: "aliceblue" }}
                to={`/category/${item}`}
                key={item}
                className="links"
              >
                {item}{" "}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
