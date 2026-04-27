import React from "react";
import "./index.css";
import { Composition } from "remotion";
import { ECIFeedPost } from "./ECIFeedPost";
import { ECIReel } from "./ECIReel";
import { ECIThermostat } from "./ECIThermostat";
import { ECIConcertSeries } from "./ECIConcertSeries";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ECIConcertSeries"
        component={ECIConcertSeries}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ECIThermostat"
        component={ECIThermostat}
        durationInFrames={960}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="ECIFeedPost"
        component={ECIFeedPost}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1080}
      />
      <Composition
        id="ECIReel"
        component={ECIReel}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
