import React from "react";
import "./Home.css";
import Navbar from "./Navbar";
import Footers from "./Footer";
import { Card, Space } from "antd";

const Home = () => {
  return (
    <div className="cover">
      <Navbar />
      <div >
        <Card className="card" title="About">
            dskcdcsvdmmdslsdpeppppppppppppppppppppppppppppppppppppg
            hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
            pppppppppppppppppppppppppppppppppppppppppppppppppppppppp
                   </Card>
          <Card
            style={{ borderRadius: "10px", width: "60vw" }}
            title="Chains We Currently Support"
          >
            <div style={{ display: "flex" }}>
              <Space size={"middle"}></Space>
            </div>
          </Card>
          <Card title="Our Products categories"></Card> 
      </div>

      <footer>
        <Footers />
      </footer>
    </div>
  );
};

export default Home;
