//Kunal Dongre

import React, { useEffect, useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div className="flex-ct mb15">
          <div className="list-box">
            <div className="list-header">
              <div className="flex-jcsp">
                <div className="flex">
                  <Skeleton
                    circle
                    width={45}
                    height={45}
                    style={{ marginLeft: -5, marginRight: 5 }}
                  />
                  <Skeleton width={140} />
                </div>
              </div>
            </div>
            <div className="list-body pa-10 flex-r">
              <Skeleton className="flex-fdr" height={89} width={180} />
              <Skeleton className="flex-fdr" height={89} width={180} />
              <Skeleton className="flex-fdr" height={89} width={180} />
              <Skeleton className="flex-fdr" height={89} width={180} />
            </div>
          </div>
        </div>
        <div className="flex-ct">
          <div className="list-box">
            <div className="list-header">
              <Skeleton
                circle
                width={45}
                height={45}
                style={{ marginLeft: -5, marginRight: 5 }}
              />
              <Skeleton width={140} />
            </div>
            <div className="list-body attempt">
              <Skeleton
                className="list-item sr-90"
                borderRadius={0}
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                borderRadius={0}
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                borderRadius={0}
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                borderRadius={0}
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                borderRadius={0}
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                borderRadius={0}
                height={40}
                style={{ borderBottomWidth: 1 }}
              />
            </div>
          </div>
          <div className="list-box">
            <div className="list-header">
              <Skeleton
                circle
                width={45}
                height={45}
                style={{ marginLeft: -5, marginRight: 5 }}
              />
              <Skeleton width={140} />
            </div>
            <div className="list-body">
              {" "}
              <Skeleton
                className="list-item sr-90"
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                height={40}
                style={{ borderBottomWidth: 1 }}
              />{" "}
              <Skeleton
                className="list-item sr-90"
                height={40}
                style={{ borderBottomWidth: 1 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;
