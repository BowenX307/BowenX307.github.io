// 作品集的全部内容。来源：三版简历（SWE / AIE / Trading）+ LinkedIn 导出（Profile.pdf）+ AVO 仓库的 README，2026-11。
// 三版简历有出入时以简历为准（比 LinkedIn 新、更具体）；只写来源里有的事实。
//
// 轨道 = 时间，从中心往外长：
//   0 内圈  Foundations  学校、比赛、课程里的项目
//   1 中圈  First roles  第一批实习
//   2 外圈  Now          2026 年正在做 / 刚做完的（AVO 来自 GitHub 仓库 README，简历上没有）
// 颜色 = 领域（6 种，见 FIELDS）；星球大小 = 分量；带环 = 获奖。

export type Field = 'ml' | 'research' | 'software' | 'design' | 'data' | 'math';

export const FIELDS: Record<Field, { label: string; hex: string }> = {
  ml: { label: 'ML & NLP', hex: '#d27a52' },
  research: { label: 'Research', hex: '#8579d6' },
  math: { label: 'Math', hex: '#d4b363' },
  data: { label: 'Data', hex: '#6fae8f' },
  design: { label: 'Design', hex: '#cf7ba0' },
  software: { label: 'Software & systems', hex: '#6a8fcc' },
};

export const ORBIT_NAMES = ['01 · Foundations', '02 · First roles', '03 · Now'];

export type Point = { label: string; text: string };
export type Link = { label: string; href: string };

export type Project = {
  id: string;
  label: string; // 星球旁边的短名
  title: string; // 详情页大标题
  org: string;
  role: string;
  kind: string; // 索引右侧的一个词
  when: string;
  place?: string;
  orbit: 0 | 1 | 2;
  field: Field;
  size: number; // 星球半径（世界单位）
  award?: string; // 有奖项的星球带环
  summary: string;
  points: Point[];
  stack: string[];
  links?: Link[];
  related: string[]; // 互相吸引的项目
};

export const projects: Project[] = [
  // ---------------------------------------------------------------- 03 · Now
  {
    id: 'lenovo',
    label: 'Lenovo',
    title: 'Lenovo',
    org: 'Lenovo (CBSO)',
    role: 'AI Development Intern',
    kind: 'Intern',
    when: 'May – Aug 2026',
    place: 'Morrisville, NC',
    orbit: 2,
    field: 'ml',
    size: 18,
    summary:
      'Email triage for a two-agent quote-automation system. The model sorts incoming customer email into Actionable, Manual or Skip, so nobody has to do the first pass by hand before a quote is generated.',
    points: [
      { label: '94% precision', text: 'Routed 33K+ multilingual customer emails into Actionable / Manual / Skip, removing the manual first-pass review.' },
      { label: '+3.5 points', text: 'Added attachment features (file names, in-document titles, file types) on a DeBERTa-v3 encoder, and measured each one through ablations on leakage-free, conversation-level splits.' },
      { label: '96% agreement', text: 'Wrote the labeling rubric and DeepSeek prompt that generated the full 33K-email training set, checked against hand-labeled samples.' },
      { label: 'Pipeline', text: 'PostgreSQL exploration, an NLLB-200 translation stage for Spanish and Portuguese email, and moving training from Colab to Lambda Cloud GPUs (A10 → H100).' },
      { label: 'Model collapse', text: 'Traced predictions collapsing to 100% Manual to a 69% class imbalance, and fixed it with weighted sampling.' },
    ],
    stack: ['PyTorch', 'DeBERTa-v3', 'NLLB-200', 'PostgreSQL', 'DeepSeek API', 'Lambda Cloud'],
    related: ['springer', 'decoding'],
  },
  {
    id: 'uniai',
    label: 'Uniai',
    title: 'Uniai',
    org: 'Uniai',
    role: 'Co-Founder & Core Developer',
    kind: 'Co-founder',
    when: 'Apr 2026 – Present',
    place: 'Shanghai',
    orbit: 2,
    field: 'software',
    size: 18,
    summary:
      'An AI companion startup, demoed at WAIC 2026. I built its real-time voice agent: speech to text, a streaming LLM, then text to speech, so the assistant starts speaking before generation completes.',
    points: [
      { label: '3s → 800ms', text: 'Cut p95 time-to-first-audio by 73%. Profiled latency per stage and took a serial scene-classification call off the critical path with scene caching, early sentence cutting and persistent HTTP connections.' },
      { label: 'Streaming', text: 'Sentence-level streaming synthesis and scene-aware context routing between the LLM and the voice.' },
      { label: 'iOS audio', text: 'Fixed streamed audio cutting off on iOS. The cause was conflicting autoplay-unlock paths plus a getUserMedia call forcing a VoIP session; moved everything to one WebAudio pipeline.' },
    ],
    stack: ['STT → LLM → TTS', 'Streaming inference', 'WebAudio'],
    related: ['studuvalley'],
  },
  {
    id: 'avo',
    label: 'AVO',
    title: 'AVO',
    org: 'Meta Global AI Developer Hackathon 2026',
    role: 'Solo builder · Indie track',
    kind: 'Hackathon',
    when: 'Oct – Nov 2026',
    orbit: 2,
    field: 'software',
    size: 16,
    summary:
      'A voice-first Mac app for people who can speak clearly but find precise mouse or trackpad use difficult. Say what you want done; AVO handles the clicks, and asks when your meaning is unclear. It started when I broke my hand climbing during the Lenovo internship.',
    points: [
      { label: '0 / 9 silent errors', text: 'On three deliberately ambiguous tasks, full AVO made no silent errors and got 9 of 9 right; the agent alone made 7 silent errors in 9. Small controlled tests on fictional pages, not a user study.' },
      { label: 'Two questions', text: '“Which person do you mean?” and “Can I send this?” are different questions. AVO asks the first when a target is ambiguous, and shows a preview before sends and other irreversible actions.' },
      { label: '33% → 100%', text: 'With simulated 8px pointing error on 12px targets, direct pointing hit 33%; SAM segmentation plus name matching from macOS accessibility hit 100%.' },
      { label: 'AVO Remote', text: 'Send a task from a paired phone on the same Wi-Fi, and answer its questions on a cropped, numbered view of the screen.' },
    ],
    stack: ['Meta Muse models', 'SAM 3.1', 'Realtime ASR', 'macOS accessibility', 'Python', 'Electron'],
    links: [
      { label: 'Demo', href: 'https://www.youtube.com/watch?v=u7045Y1N5V0' },
      { label: 'Website', href: 'https://bowenx307.github.io/AVO/' },
      { label: 'GitHub', href: 'https://github.com/BowenX307/AVO' },
    ],
    related: ['uniai', 'lenovo'],
  },
  {
    id: 'decoding',
    label: 'Constrained decoding',
    title: 'Constrained decoding',
    org: 'University of Illinois',
    role: 'Undergraduate Researcher · Advisor Prof. Sasa Misailovic',
    kind: 'Research',
    when: 'Aug 2026 – Present',
    place: 'Urbana-Champaign',
    orbit: 2,
    field: 'research',
    size: 16,
    summary:
      'Grammar-constrained code generation: making an LLM emit code that always parses. I benchmark four decoding strategies for pass@k against latency, and look for where the time goes.',
    points: [
      { label: '4 decoders', text: 'Unconstrained, SynCode (DFA token masking), IterGen (incremental parsing with backtracking) and ChopChop (guess-and-check over Brzozowski derivatives), on MultiPL-E JavaScript HumanEval and MBPP.' },
      { label: '~30× slower', text: 'ChopChop takes 35s against SynCode’s 1.2s median per MBPP problem, at lower pass@1. Traced the gap to per-token full-prefix re-lexing and re-derivation, O(n²) per completion.' },
      { label: '6+ hour runs', text: 'Built a checkpoint-and-resume GPU harness (Drive-backed outputs, merged timing logs) so long runs survive disconnects and restarts.' },
    ],
    stack: ['Python', 'Hugging Face', 'MultiPL-E', 'Colab GPU'],
    links: [{ label: 'GitHub', href: 'https://github.com/BowenX307/constrained-llm-js-codegen-final' }],
    related: ['lenovo'],
  },
  {
    id: 'studuvalley',
    label: 'Studuvalley',
    title: 'Studuvalley',
    org: 'HackIllinois 2026',
    role: 'Full-Stack Developer & UI/UX Designer',
    kind: 'Winner',
    when: 'Feb 2026',
    place: 'Champaign, IL',
    orbit: 2,
    field: 'design',
    size: 14,
    award: 'Best UI/UX Design',
    summary:
      'A real-time, gamified study space against study isolation, with a pixel-art look and interactive onboarding. It won Best UI/UX Design at HackIllinois 2026, among hundreds of participants.',
    points: [
      { label: 'Best UI/UX', text: 'Winner at HackIllinois 2026.' },
      { label: '20+ users', text: 'Supabase Realtime keeps avatar movement, shared tasks and chat in sync across 20+ concurrent users.' },
    ],
    stack: ['Next.js', 'Supabase Realtime'],
    links: [{ label: 'GitHub', href: 'https://github.com/BowenX307/Studuvalley' }],
    related: ['uniai', 'pathforms', 'markets'],
  },

  // ---------------------------------------------------------------- 02 · First roles
  {
    id: 'idx',
    label: 'IDXExchange',
    title: 'IDXExchange',
    org: 'IDXExchange',
    role: 'Data Science Intern',
    kind: 'Intern',
    when: 'Jan – Mar 2026',
    orbit: 1,
    field: 'data',
    size: 11,
    summary: 'Data science internship.',
    points: [],
    stack: [],
    related: ['shanghai'],
  },
  {
    id: 'springer',
    label: 'Springer Capital',
    title: 'Springer Capital',
    org: 'Springer Capital',
    role: 'AI Research Intern',
    kind: 'Intern',
    when: 'May – Jul 2025',
    place: 'Chicago, IL',
    orbit: 1,
    field: 'ml',
    size: 13,
    summary: 'A sentiment model that reads employee email and predicts engagement.',
    points: [
      { label: '70% accuracy', text: 'Predicted employee engagement from email communications.' },
      { label: '3,000 emails', text: 'Processed and vectorized the corpus with TF-IDF term weighting and n-grams to keep contextual phrases.' },
    ],
    stack: ['NLP', 'TF-IDF', 'n-grams'],
    links: [{ label: 'GitHub', href: 'https://github.com/BowenX307/Springer-Capital-Data-Analysis' }],
    related: ['lenovo'],
  },
  {
    id: 'shanghai',
    label: 'Shanghai Pharma',
    title: 'Shanghai Pharmaceuticals',
    org: 'Shanghai Pharmaceuticals Holding',
    role: 'Data Operations Intern',
    kind: 'Intern',
    when: 'May – Aug 2025',
    place: 'Shanghai',
    orbit: 1,
    field: 'data',
    size: 12,
    summary:
      'A data operations workflow for pharmaceutical inventory data, covering the whole lifecycle from ingestion to visualization.',
    points: [],
    stack: [],
    related: ['idx'],
  },

  // ---------------------------------------------------------------- 01 · Foundations
  {
    id: 'pathforms',
    label: 'PathForms',
    title: 'PathForms',
    org: 'Illinois Math Lab',
    role: 'Undergraduate Researcher',
    kind: 'Research',
    when: 'Aug – Dec 2025',
    place: 'Urbana-Champaign',
    orbit: 0,
    field: 'math',
    size: 10,
    summary:
      'Path transformations in colored graphs. An interactive learning environment that implements the Nielsen algorithm, so students can watch it work instead of only reading it.',
    points: [{ label: 'Drag and drop', text: 'Concatenate paths by dragging them together, with real-time visual feedback.' }],
    stack: ['JavaScript', 'React'],
    links: [{ label: 'GitHub', href: 'https://github.com/BowenX307/PathForms' }],
    related: ['himcm', 'studuvalley'],
  },
  {
    id: 'markets',
    label: 'Prediction markets',
    title: 'Prediction-market analytics',
    org: 'CS 222 · Software Design Lab',
    role: 'Team project',
    kind: 'Course',
    when: 'UIUC',
    orbit: 0,
    field: 'software',
    size: 8,
    summary: 'A team-built analytics app for prediction markets.',
    points: [{ label: 'Integration', text: 'Connected the frontend to a Flask backend serving Kalshi and Polymarket market data.' }],
    stack: ['Flask', 'Kalshi', 'Polymarket'],
    related: ['studuvalley'],
  },
  {
    id: 'himcm',
    label: 'HiMCM',
    title: 'HiMCM',
    org: 'High School Mathematical Contest in Modeling',
    role: 'Coder and model developer',
    kind: 'Award',
    when: 'Nov 2022 – Mar 2023',
    place: 'Shanghai',
    orbit: 0,
    field: 'math',
    size: 9,
    award: 'Outstanding Team',
    summary: 'A differential-equation model of bee population dynamics and virus spread, including the Allee effect.',
    points: [
      { label: 'Top 9 of ~1,000', text: 'Outstanding Team award, out of nearly 1,000 teams.' },
      { label: 'Model', text: 'Led the model setup and solved the system with the Euler method.' },
      { label: 'Python + MATLAB', text: 'Implemented the solver and the visualizations.' },
    ],
    stack: ['Python', 'MATLAB'],
    related: ['pathforms'],
  },
];

export const projectById = new Map(projects.map((p) => [p.id, p]));

export const profile = {
  name: 'Bowen Xiao',
  headline: 'I build ML systems, and the interfaces around them.',
  tagline: 'ML & Software Engineer',
  place: 'Urbana, Illinois',
  email: 'xiaobowenlyf@gmail.com',
  github: 'https://github.com/BowenX307',
  linkedin: 'https://www.linkedin.com/in/bowenx0307',
  intro:
    'I study Mathematics and Computer Science at the University of Illinois Urbana-Champaign. Most of my work sits where a model meets the people using it: email triage at Lenovo, a real-time voice agent at the startup I co-founded, and research on constrained decoding.',
  education: {
    school: 'University of Illinois Urbana-Champaign',
    degree: 'B.S. Mathematics and Computer Science',
    detail: 'Expected May 2028 · GPA 3.93 / 4.00',
    coursework:
      'Data Structures, System Programming, Computer Architecture, Software Design Lab, Numerical Methods, Real Analysis, Combinatorics, Complex Variables',
  },
  skills: [
    { label: 'Languages', text: 'Python, C++, C, Java, JavaScript / TypeScript, SQL' },
    {
      label: 'ML & LLM',
      text: 'PyTorch, Hugging Face Transformers, OpenAI / DeepSeek APIs, LLM-based labeling, RAG, streaming inference, Pandas, scikit-learn',
    },
    { label: 'Systems & web', text: 'Linux, Git, Docker, PostgreSQL, Nginx, React, Next.js, Supabase, Lambda Cloud GPUs' },
  ],
  certificates: 'Google Data Analytics · Data Science DISCOVERY',
};
