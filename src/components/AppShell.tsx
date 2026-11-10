import type { ReactNode } from 'react';
import { OrbLogo } from './OrbLogo';
import { sound, useSoundEnabled } from '../universe/sound';
import type { PanelView } from '../universe/Panel';
import { profile } from '../content';
import './AppShell.css';

type Props = {
  revealed?: boolean; // 入场动画结束后再淡入顶栏
  active: PanelView | 'project';
  onNav: (view: PanelView) => void;
  children: ReactNode;
};

const NAV: { view: PanelView; label: string }[] = [
  { view: 'home', label: 'Work' },
  { view: 'about', label: 'About' },
  { view: 'contact', label: 'Contact' },
];

export function AppShell({ revealed = true, active, onNav, children }: Props) {
  const soundOn = useSoundEnabled();
  // 打开某个项目时仍算在 Work 下面
  const current = active === 'project' ? 'home' : active;
  return (
    <div className={`shell ${revealed ? 'is-revealed' : ''}`}>
      {children}
      <header className="shell-top">
        <button className="wordmark" onClick={() => onNav('home')}>
          <OrbLogo size={20} />
          <span>{profile.name}</span>
        </button>
        <nav className="shell-nav mono" aria-label="Main">
          {NAV.map((n) => (
            <button
              key={n.view}
              className={current === n.view ? 'is-active' : ''}
              aria-current={current === n.view ? 'page' : undefined}
              onClick={() => onNav(n.view)}
            >
              {n.label}
            </button>
          ))}
          <button className="sound-toggle" onClick={sound.toggle} aria-pressed={soundOn} title="Toggle sound (M)">
            Sound {soundOn ? 'on' : 'off'}
          </button>
        </nav>
      </header>
    </div>
  );
}
