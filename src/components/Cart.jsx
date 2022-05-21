import React, { useState } from "react";
import { Card, Button, Input } from "antd";
import { useMoralis } from "react-moralis";

import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { useApiContext } from "../utils/ApiCode";
import { useIntegraContext } from "../utils/integration";

const Cart = () => {
  const {isAuthenticated} = useMoralis();
  const { setDelivery, totalPrice, total, dataFeed, Price } = useIntegraContext();
  const { onAdd, onRemove, cartPage } = useApiContext();

  const itemsPrice = cartPage.reduce((a, c) => a + c.qty * c.price, 0);
  const deliveryFee = 0;
  totalPrice(itemsPrice, deliveryFee);
  return (
    <div>
      <div>{cartPage.length === 0 && <div>Cart is Empty</div>}</div>
      {cartPage.map((item) => (
        <Card>
          <div className="product-info" style={{ display: "flex" }}>
            <div className="product-image">
              <img
                src={item.image}
                alt="product_image"
                width="150px"
                height="100px"
              />
            </div>
            <div style={{ marginLeft: "20px" }}>
              <p>
                Name - <strong>{item.title}</strong>
              </p>
              <div style={{ display: "flex" }}>
                <p style={{ marginRight: "20px" }}>
                  Quantity -<strong> {item.qty}</strong>{" "}
                </p>
                <Button
                  style={{ border: "none", marginTop: "-3px" }}
                  onClick={() => onAdd(item)}
                >
                  <AiOutlinePlus />
                </Button>
                <Button
                  style={{ border: "none", marginTop: "-3px" }}
                  onClick={() => onRemove(item)}
                >
                  <AiOutlineMinus />
                </Button>
              </div>
              <div>
                {isAuthenticated ? (
                  Price((item.price / dataFeed).toFixed(3), "Price")
                ) : (
                  <p>
                    Price - <strong> ${item.price}</strong>{" "}
                  </p>
                )}
                {isAuthenticated ? (
                  Price(
                    ((item.qty * item.price) / dataFeed).toFixed(3),
                    "Total Price"
                  )
                ) : (
                  <p>
                    Total Price - <strong>${item.qty * item.price}</strong>{" "}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
      {cartPage.length !== 0 && (
        <div>
          <hr></hr>
          <Input
            placeholder="Enter Address/ Location"
            onChange={(value) => setDelivery(value.target.value)}
          ></Input>

          {!isAuthenticated ? (
            <div style={{ display: "flex" }}>
              <p style={{ marginRight: "150px", marginLeft: "10px" }}>
                Items Total{" "}
              </p>

              <strong>${itemsPrice.toFixed(2)}</strong>
            </div>
          ) : (
            <div style={{ display: "flex" }}>
              <p style={{ marginRight: "150px", marginLeft: "10px" }}>
                Items Total{" "}
              </p>

              <strong>{Price((itemsPrice / dataFeed).toFixed(3), "")}</strong>
            </div>
          )}
          <div style={{ display: "flex" }}>
            <p style={{ marginRight: "150px", marginLeft: "10px" }}>
              Delivery Fee
            </p>
            <strong>{Price((deliveryFee / dataFeed).toFixed(3), "")}</strong>
          </div>
          <div style={{ display: "flex" }}>
            <p style={{ marginRight: "190px", marginLeft: "10px" }}>Total</p>
            <strong>{Price((total / dataFeed).toFixed(3), "")}</strong>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
