import { useRef, useState } from 'react';
import { AppShell } from '../components/AppShell';
import { UniverseScene, type SceneControls } from '../universe/UniverseScene';
import type { PanelView } from '../universe/Panel';
import { projects } from '../content';

export function Home() {
  const [revealed, setRevealed] = useState(false);
  const [active, setActive] = useState<PanelView | 'project'>('home');
  const controls = useRef<SceneControls | null>(null);

  return (
    <AppShell revealed={revealed} active={active} onNav={(v) => controls.current?.show(v)}>
      <UniverseScene projects={projects} onIntroDone={setRevealed} onViewChange={setActive} controls={controls} />
    </AppShell>
  );
}
