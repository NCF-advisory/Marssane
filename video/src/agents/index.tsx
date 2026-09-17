import React from 'react';
import {Composition, Freeze, Sequence, registerRoot} from 'remotion';
import {Team34V10Light, V10_LIGHT_DURATION_FRAMES} from './Team';

function TeamVideo() {
  return <>
    <Sequence durationInFrames={60}><Freeze frame={0}><Team34V10Light /></Freeze></Sequence>
    <Sequence from={60}><Team34V10Light /></Sequence>
  </>;
}

const Root = () => <Composition id="EquipeAgents" component={TeamVideo}
  durationInFrames={V10_LIGHT_DURATION_FRAMES + 60} fps={60} width={1920} height={1080} />;

registerRoot(Root);
