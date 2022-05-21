import React, { useState, useEffect } from "react";
import { Layout, Card, Rate, Radio, Space, InputNumber } from "antd";
import {Box, Image} from '@chakra-ui/react'
import { Link } from "react-router-dom";
import "./Layout.css";
import { useMoralis } from "react-moralis";
import { useIntegraContext } from "../utils/integration";

const Body = ({ Products }) => {
  const { isAuthenticated } = useMoralis();
  const { Price, dataFeed } = useIntegraContext();
  const { Sider, Content } = Layout;
  const [rating, setRating] = useState(1);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(2000);
  const [productFilter, setProductFilter] = useState([]);

  function changePrice(min, max) {
    setPriceMin(min / dataFeed);
    setPriceMax(max / dataFeed);
  }

  useEffect(() => {
    if (isAuthenticated) {
      setProductFilter(
        Products?.filter((x) => x.rating.rate >= rating)
          .filter((x) => x.price / dataFeed > priceMin / dataFeed)
          .filter((x) => x.price / dataFeed <= priceMax / dataFeed)
      );
    } else {
      setProductFilter(
        Products?.filter((x) => x.rating.rate >= rating)
          .filter((x) => x.price > priceMin)
          .filter((x) => x.price <= priceMax)
      );
    }
    
  }, [dataFeed, productFilter, isAuthenticated]);

  return (
    <div>
      <Layout>
        <Sider width="340px" theme="light" style={{ padding: "25px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h2>Customer Reviews</h2>
            <Radio.Group
              value={rating}
              onChange={(value) => setRating(value.target.value)}
            >
              <Space direction="vertical">
                <Radio value={5}>
                  <Rate defaultValue={5} disabled={true}></Rate>
                </Radio>
                <Radio value={4}>
                  <Rate defaultValue={4} disabled={true}></Rate>
                </Radio>
                <Radio value={3}>
                  <Rate defaultValue={3} disabled={true}></Rate>
                </Radio>
                <Radio value={2}>
                  <Rate defaultValue={2} disabled={true}></Rate>
                </Radio>
                <Radio value={1}>
                  <Rate defaultValue={1} disabled={true}></Rate>
                </Radio>
              </Space>
            </Radio.Group>
            <br />
            <br />
            <h2>Price Ranges</h2>
            <p className="prices" onClick={() => changePrice(0, 100)}>
              1st Price Range
            </p>
            <p className="prices" onClick={() => changePrice(100, 400)}>
              2nd Price Range
            </p>
            <p className="prices" onClick={() => changePrice(400, 700)}>
              3rd Price Range
            </p>
            <p className="prices" onClick={() => changePrice(700, 1000)}>
              4th Price Range
            </p>
            <p className="prices" onClick={() => changePrice(1, 1500)}>
              All Items
            </p>
            <Space>
              <InputNumber
                value={priceMin}
                formatter={(value) => `${value}`}
                onChange={(value) => changePrice(value, priceMax)}
              />
              <InputNumber
                value={priceMax}
                formatter={(value) => `${value}`}
                onChange={(value) => changePrice(priceMin, value)}
              />
            </Space>
            <br />
            <br />
          </div>
        </Sider>
        <Content>
          {productFilter.length === 0 ? (
            <p style={{ justifyContent: "center", height: "300px" }}>
              No item fit your description
            </p>
          ) : (
            productFilter.map((info) => (
              <Link to={`/category/product/${info.id}`}>
                <Card>
                  <div className="product-info" style={{ display: "flex" }}>
                
                  <img width="300px"src={info.image} alt={info.title}/>
          
                    <div style={{ marginLeft: "20px", marginTop:"50px" }}>
                      <strong>Name - {info.title}</strong>
                      <br/>
                      <Rate
                        disabled
                        defaultValue={Math.round(info.rating.rate)}
                      />
                      {!isAuthenticated ? (
                        <p style={{ marginTop: "15px" }}>
                          {" "}
                          Price:
                          <span style={{ color: "green" }}>${info.price}</span>
                        </p>
                      ) : (
                        Price((info.price / dataFeed).toFixed(3), "Price")
                      )}
                      <p>Description - {info.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </Content>
      </Layout>
    </div>
  );
};

export default Body;
