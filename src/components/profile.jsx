import React, {useState, useEffect} from 'react'

import {useMoralis} from "react-moralis" 

import { useIntegraContext } from '../utils/integration';
import { Card, Steps, Button } from 'antd';

const Profile = () => {
    const {account} = useMoralis();
    const {balance, bar} = useIntegraContext();
    const {Step} = Steps;
    const [current, setCurrent] = useState(0);
    const [percent, setPercent] = useState(0);

    useEffect(() => {
       if(bar <= 100){
           setCurrent(0);
           setPercent(bar);
       }else  if(bar > 100)
          {
               const dowm = Math.floor(bar/100);
               const remainder = bar % 100 ;
               setCurrent(dowm);
               setPercent(remainder);

           
       }
    }, [bar]);
  return (
    <div>
      {balance.length === 0 ? (
        <div>
          {account}
          <p>No Nfts Found</p>
        </div>
      ) : (
        <div>
          {balance.length > 1 ? (
            balance.map((item) => (
              <div>
                <Card>
                  <div>{item.image}</div>
                  <hr></hr>
                  <div style={{ display: "flex" }}>
                    {item.name}
                    <Button>burn</Button>
                  </div>
                </Card>
              </div>
            ))
          ) : (
            <div>
              <Card>
                <div>{balance.image}</div>
                <hr></hr>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  {balance.name}
                  <Button >burn</Button>
                </div>
              </Card>
            </div>
          )}
          <Steps style={{marginTop : "30px", marginLeft:"20px"}} direction="vertical" current={current} percent={percent}>
            <Step title="Finished" description="This is a description." />
            <Step
              title="In Progress"
              subTitle="Left 00:00:08"
              description="This is a description."
            />
            <Step title="Waiting" description="This is a description." />
            <Step title="Waiting" description="This is a description." />
            <Step title="Waiting" description="This is a description." />
            <Step title="Coming Soon" description="This is a description." />
          </Steps>
        </div>
      )}
    </div>
  );
}

export default Profile