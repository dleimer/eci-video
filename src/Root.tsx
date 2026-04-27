import React from "react";
import "./index.css";
import { Composition } from "remotion";
import { ECIFeedPost } from "./ECIFeedPost";
import { ECIReel } from "./ECIReel";

export const RemotionRoot: React.FC = () => {
  return (
    <>
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
