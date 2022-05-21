import React from "react";
import "./Home.css";
import Navbar from "./Navbar";
import Footers from "./Footer";
import { Card, Space } from "antd";

const Home = () => {
  return (
    <div className="cover">
      <Navbar />
      <div>
        <Card
          style={{ width: "70vw", marginBottom: "2rem" }}
          className="card"
          title="About"
        >
          Debay is an e-commerce store where goods are paid for in
          cryptocurrency and each user recieves NFTs after they have purchased
          an item, the more the NFTs a user has acquired the higher their level.
          Each level comes with an added feature or features.
        </Card>
        <Card
          style={{
            marginLeft: "5rem",
            marginBottom: "2rem",
            borderRadius: "10px",
            width: "45vw",
          }}
          title="Chains We Currently Support"
        >
          <div style={{ display: "flex" }}>
            <Space size={"middle"}>
              <div>
                <img
                  src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=022"
                  alt="ethereum"
                  width="100px"
                />
                <p>Ethereum - Rinkeby Testnet</p>
              </div>
              <div>
                <img
                  src="https://cryptologos.cc/logos/polygon-matic-logo.png?v=022"
                  alt="ethereum"
                  width="100px"
                />
                <p>Polygon - Mumbai Testnet</p>
              </div>
              <div>
                <img
                  src="https://cryptologos.cc/logos/bnb-bnb-logo.png?v=022"
                  alt="ethereum"
                  width="100px"
                />
                <p>Bsc - Bsc Testnet</p>
              </div>
            </Space>
          </div>
        </Card>
       
      </div>
    </div>
  );
};

export default Home;
