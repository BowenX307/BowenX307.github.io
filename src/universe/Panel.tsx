// 左列的四种视图
//  home    — 标题、一行统计、按轨道分组的项目索引（和宇宙里的星球联动）、Get in touch
//  focus   — 一个项目的详情（点星球或索引行）
//  about   — 教育、课程、技能（点顶栏 About 或中心的 Orb）
//  contact — 邮箱、GitHub、LinkedIn
import type { CSSProperties } from 'react';
import { TextButton } from '../components/TextButton';
import { pad2 } from '../lib/format';
import { FIELDS, ORBIT_NAMES, profile } from '../content';
import type { Body } from './engine';
import './Panel.css';

export type PanelView = 'home' | 'about' | 'contact';

// 索引从外圈（最近）往内圈（最早）排，和 content.ts 里的顺序一致
const GROUPS = [2, 1, 0];

/** 依次给每一项一个序号，CSS 用它错开入场时间 */
function stagger() {
  let i = 0;
  return () => ({ '--i': i++ }) as CSSProperties;
}

type HomeProps = {
  bodies: Body[];
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onFocus: (id: string) => void;
  onView: (v: PanelView) => void;
};

export function PanelHome({ bodies, hoveredId, onHover, onFocus, onView }: HomeProps) {
  const fields = new Set(bodies.map((b) => b.project.field)).size;
  return (
    <div className="panel-home">
      <h1 className="headline">{profile.headline}</h1>
      {/* 每段连同后面的分隔点一起不断行：折行时 "·" 留在上一行末尾 */}
      <p className="stats mono">
        <span>{pad2(bodies.length)} projects ·</span> <span>{pad2(fields)} fields ·</span> <span>Math + CS at UIUC</span>
      </p>

      <div className="index" role="list" aria-label="Projects by orbit">
        {GROUPS.map((orbit) => {
          const rows = bodies.filter((b) => b.orbit === orbit);
          if (!rows.length) return null;
          return (
            <section key={orbit} className="index-group">
              <h2 className="index-label mono">{ORBIT_NAMES[orbit]}</h2>
              <ol>
                {rows.map((b) => (
                  <li key={b.id}>
                    <button
                      className={`row ${hoveredId === b.id ? 'is-hover' : ''}`}
                      style={{ '--c': b.color } as CSSProperties}
                      onPointerEnter={() => onHover(b.id)}
                      onPointerLeave={() => onHover(null)}
                      onFocus={() => onHover(b.id)}
                      onBlur={() => onHover(null)}
                      onClick={() => onFocus(b.id)}
                    >
                      <span className="row-num mono">{pad2(b.index + 1)}</span>
                      <span className="row-dot" aria-hidden />
                      <span className="row-name">{b.project.title}</span>
                      <span className="row-meta mono">{b.project.kind}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </section>
          );
        })}
      </div>

      <div className="home-actions">
        <TextButton onClick={() => onView('contact')}>Get in touch</TextButton>
        <TextButton className="is-quiet" onClick={() => onView('about')}>
          About
        </TextButton>
      </div>
      <p className="hint mono">Drag · Scroll to zoom · Click a planet</p>
    </div>
  );
}

// ---------------------------------------------------------------- 项目详情

type FocusProps = { body: Body; color: string; onClose: () => void };

export function ProjectFocus({ body, color, onClose }: FocusProps) {
  const p = body.project;
  const step = stagger();
  return (
    <section className="focus" style={{ '--c': color } as CSSProperties} aria-label={p.title}>
      <p className="focus-meta mono" style={step()}>
        Project {pad2(body.index + 1)} · {ORBIT_NAMES[body.orbit].split(' · ')[1]} · {p.when}
      </p>
      <h2 className="focus-title" style={step()}>
        {p.title}
      </h2>
      <p className="focus-field mono" style={step()}>
        {FIELDS[p.field].label}
        {p.award && ` · ${p.award}`}
      </p>

      <p className="focus-role" style={step()}>
        {p.role}
        <span className="focus-org">
          {' '}
          · {p.org}
          {p.place && `, ${p.place}`}
        </span>
      </p>
      <p className="focus-desc" style={step()}>
        {p.summary}
      </p>

      {p.points.length > 0 && (
        <ol className="focus-points">
          {p.points.map((pt) => (
            <li key={pt.label} style={step()}>
              <p className="point-label mono">{pt.label}</p>
              <p className="point-text">{pt.text}</p>
            </li>
          ))}
        </ol>
      )}

      {p.stack.length > 0 && (
        <p className="focus-stack mono" style={step()}>
          {p.stack.join(' · ')}
        </p>
      )}

      {p.links && p.links.length > 0 && (
        <div className="focus-links" style={step()}>
          {p.links.map((l) => (
            <a key={l.href} className="text-button mono" href={l.href} target="_blank" rel="noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      )}

      <div className="focus-actions" style={step()}>
        <TextButton onClick={onClose}>Back to all work</TextButton>
        <span className="mono focus-esc">Esc</span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- About

export function PanelAbout({ onClose }: { onClose: () => void }) {
  const step = stagger();
  const { education: edu } = profile;
  return (
    <section className="focus" aria-label="About">
      <p className="focus-meta mono" style={step()}>
        About · {profile.place}
      </p>
      <h2 className="focus-title" style={step()}>
        {profile.name}
      </h2>
      <p className="focus-field mono is-plain" style={step()}>
        {profile.tagline}
      </p>
      <p className="focus-desc" style={step()}>
        {profile.intro}
      </p>

      <ol className="focus-points">
        <li style={step()}>
          <p className="point-label mono">Education</p>
          <p className="point-text">{edu.school}</p>
          <p className="point-sub">
            {edu.degree} · {edu.detail}
          </p>
        </li>
        <li style={step()}>
          <p className="point-label mono">Coursework</p>
          <p className="point-text">{edu.coursework}</p>
        </li>
        {profile.skills.map((s) => (
          <li key={s.label} style={step()}>
            <p className="point-label mono">{s.label}</p>
            <p className="point-text">{s.text}</p>
          </li>
        ))}
        <li style={step()}>
          <p className="point-label mono">Certificates</p>
          <p className="point-text">{profile.certificates}</p>
        </li>
      </ol>

      <div className="focus-actions" style={step()}>
        <TextButton onClick={onClose}>Back to all work</TextButton>
        <span className="mono focus-esc">Esc</span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Contact

export function PanelContact({ onClose }: { onClose: () => void }) {
  const step = stagger();
  const rows = [
    { label: 'Email', text: profile.email, href: `mailto:${profile.email}` },
    { label: 'GitHub', text: profile.github.replace('https://', ''), href: profile.github },
    { label: 'LinkedIn', text: profile.linkedin.replace('https://www.', ''), href: profile.linkedin },
  ];
  return (
    <section className="focus" aria-label="Contact">
      <p className="focus-meta mono" style={step()}>
        Contact
      </p>
      <h2 className="focus-title" style={step()}>
        Say hello.
      </h2>
      <p className="focus-desc" style={step()}>
        Email is the fastest way to reach me.
      </p>

      <ol className="focus-points contact-list">
        {rows.map((r) => (
          <li key={r.label} style={step()}>
            <a className="contact-row" href={r.href} target={r.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer">
              <span className="point-label mono">{r.label}</span>
              <span className="contact-text">{r.text}</span>
            </a>
          </li>
        ))}
      </ol>

      <div className="focus-actions" style={step()}>
        <TextButton onClick={onClose}>Back to all work</TextButton>
        <span className="mono focus-esc">Esc</span>
      </div>
    </section>
  );
}
