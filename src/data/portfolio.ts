export interface EscalationItem {
  label: string;
  title: string;
  delay?: string;
  situation: string;
  assumed: string;
  hardPart: string;
  outcome: string;
}

export interface ApproachPanel {
  num: string;
  title: string;
  description: string;
  items: string[];
}

export interface ExperienceItem {
  datetime: string;
  period: string;
  role: string;
  company: string;
  bullets: string[];
}

export interface MoreWorkItem {
  title: string;
  blurb: string;
  overview: string;
  stack: string;
  highlights: string;
  img?: string;
  imgFit?: 'contain';
  mediaClass?: string;
  imgClass?: string;
  url?: string;
  cta?: string;
  flat?: boolean;
  flatLabel?: string;
  pill?: string;
  shortDesc: string;
  delay?: string;
}

export const escalations: EscalationItem[] = [
  {
    label: 'Feasibility call · Nicasource · Client booking platform',
    title: 'Seat-level booking, inside WordPress',
    situation:
      'A client asked for a seat reservation system. The team could not agree on whether WordPress could carry it or whether it needed a separate application alongside.',
    assumed:
      'That this was past what WordPress could hold, and that a second, standalone system was the safe choice.',
    hardPart:
      'The data model. Seats, availability, and reservations had to fit WordPress custom post types, meta, and relations without degrading as bookings grew — the exact failure people expect when you say "we built it in WordPress." The safe-looking alternative traded that risk for two codebases and a sync problem someone would own forever.',
    outcome: 'Shipped inside WordPress, on one codebase. The call held up.',
  },
  {
    label: 'Rescue · AIM Services · Web + mobile product',
    title: 'A year late, in production in three months',
    delay: '0.05',
    situation:
      'They hired me onto a web and mobile product already a year past its deadline, with no credible launch date.',
    assumed: 'That it needed more of the same: more months, more bug fixing.',
    hardPart:
      'Web and mobile had drifted apart, the same logic implemented twice and out of sync. Fixes on one side reopened problems on the other, which is why a year of effort had produced no launch. Closing it meant putting both sides back on one source of truth before touching the bug list at all.',
    outcome: 'Committed to three months, and shipped to production in three months.',
  },
  {
    label: 'Standing escalation · Your Digital Resource · WordPress',
    title: 'The changes that would not show up',
    delay: '0.1',
    situation:
      'Developers shipped a change and the site kept serving the old version. It recurred often enough to cost the team real hours.',
    assumed:
      'That their own change had failed. So they re-did work that had been correct the first time.',
    hardPart:
      'There is no single place to look. Any layer in the chain can still be holding the old copy, and each layer has its own rules about when it lets go. Finding it means knowing every layer that can hold a copy instead of guessing at one.',
    outcome:
      'I became the person this got escalated to, then went through the layers and optimized them so it stopped recurring.',
  },
];

export const approachPanels: ApproachPanel[] = [
  {
    num: '01',
    title: 'Diagnose',
    description:
      'When the team is stuck: root-cause debugging, feasibility calls, and the escalation point for unusual WordPress and front-end behavior.',
    items: [
      'Root-cause debugging · Legacy WordPress/PHP',
      'Feasibility calls · build vs. extend',
      'Team escalation point · Code review',
      'Onboarding · Mentoring · Teaching',
    ],
  },
  {
    num: '02',
    title: 'Build',
    description:
      'Webflow and WordPress first—from WordPress Architecture to Custom Theme And Plugin Development—with PHP, CSS, JavaScript, Git, and AI-Assisted Development supporting a reliable delivery flow.',
    items: [
      'Webflow · Client-First',
      'WordPress · Elementor · DIVI · Bricks · Gutenberg · ACF · WooCommerce',
      'Shopify · site administration and edits',
      'WordPress Architecture · Custom Theme And Plugin Development',
      'PHP · Laravel · Git · WordPress theming',
      'Custom application development · AI-assisted coding',
      'CSS · JavaScript · HTML · Responsive',
    ],
  },
  {
    num: '03',
    title: 'Product',
    description:
      'Full-stack products end-to-end, like AIDA — a dental clinic SaaS in production.',
    items: [
      'React · Next.js · Vue · TypeScript',
      'Tailwind CSS · Bootstrap',
      'Node.js · Express · NestJS · REST APIs',
      'PostgreSQL · SQL · MongoDB · Supabase · Insforge',
    ],
  },
  {
    num: '04',
    title: 'Accelerate',
    description:
      'Agentic AI in the loop: days of editing become hours, 90 minutes become 20.',
    items: [
      'Cursor · Claude Code · Opencode · MCP',
      'Custom MCP servers from scratch · personal projects',
      'n8n · AI Agents · GPT Integrations · RAG',
      'Prompt Engineering · Prompt Debugging',
      'Custom AI Harnesses · Agentic Coding',
    ],
  },
  {
    num: '05',
    title: 'Lead',
    description:
      'Delivery when it counts — recovered a year-delayed web + mobile product and shipped it in 3 months.',
    items: [
      'Tech Lead · Project Management',
      'SEO · Core Web Vitals · GTmetrix',
      'Vercel · AWS S3 · Nginx · Proxmox · Playwright · Figma',
    ],
  },
];

export const experiences: ExperienceItem[] = [
  {
    datetime: '2024-01/2026-08',
    period: '2024 – 2026',
    role: 'Web Developer',
    company: 'Your Digital Resource, Florida',
    bullets: [
      'Used multiple Model Context Protocol (MCP) servers with AI tools to troubleshoot technical issues and support development workflows.',
      'Delivered client projects from initial setup through production, including domain, DNS, and server management.',
      "Was the team's reference for WordPress and front-end: unusual WordPress behavior, cache layers that hid shipped changes, and Webflow/CSS blockers got escalated to me; onboarded new developers and coached the team through technical stuck points.",
      'Diagnosed and fixed multi-layer cache issues that made correct deployments look like failed changes, then optimized the layers so the problem stopped recurring.',
      'Pioneered AI-assisted Webflow/WordPress workflows across dozens of landing pages, cutting repetitive editing work from days to a couple of hours.',
      'Diagnosed client-site performance issues and built AI-driven optimization that moved sites from GTmetrix Grade F to A, cutting the process from 90 to 20 minutes.',
      'Created an open-source Client-First Agent Skill that encodes Finsweet Client-First conventions so AI tools can generate Webflow components automatically instead of by hand.',
      'Administered existing Shopify client sites, making platform and content edits.',
    ],
  },
  {
    datetime: '2022/2024',
    period: '2022 – 2024',
    role: 'Software Engineer',
    company: 'Nicasource, Florida, US',
    bullets: [
      'Made the feasibility call that a client seat-reservation system could ship inside WordPress — modeling seats, availability, and bookings with custom post types and meta — instead of a separate application the team would have to sync forever.',
      'Owned web development delivery using React, Vue, and WordPress for international client requirements.',
      'Contributed to frontend architecture, reusable component design, and performance optimization across concurrent projects.',
      'Built configurable WordPress components for Sucuri with ACF and an options page for text, colors, and component variants.',
    ],
  },
  {
    datetime: '2020/2022',
    period: '2020 – 2022',
    role: 'SEO Specialist',
    company: 'Top Floor Marketing, Managua',
    bullets: [
      'Built content automation combined with bot workflows, increasing lead volume across client portfolio sites by 30%.',
      'Built custom WordPress sites and optimized Core Web Vitals and on-page SEO for rankings.',
    ],
  },
  {
    datetime: '2019/2020',
    period: '2019 – 2020',
    role: 'Project Manager and Tech Lead',
    company: 'AIM Services, Managua',
    bullets: [
      'As Project Manager and Tech Lead, recovered a year-delayed web + mobile application: web and mobile had drifted onto duplicated, out-of-sync logic; put both sides back on one source of truth, cleared the backlog, and shipped to production in 3 months.',
      'Owned architecture and delivery for company projects, including a dual web/mobile application built with Ionic.',
    ],
  },
  {
    datetime: '2017/2019',
    period: '2017 – 2019',
    role: 'Web Developer',
    company: 'Target Ogilvy',
    bullets: [
      'Introduced Laravel into projects previously built in plain PHP, expanding the feature set the agency could deliver to clients.',
      'Developed real-time PHP systems for special events and live campaigns, where failures were visible to audiences in the moment.',
      'Implemented and administered WooCommerce sites for agency clients.',
    ],
  },
];

export const moreWorkItems: MoreWorkItem[] = [
  {
    title: 'AIDA',
    blurb: 'Production dental clinic SaaS — full-stack, in production.',
    overview:
      'Production HealthTech SaaS for dental clinics, requested by a practicing dentist. Built end-to-end: patients, odontograms, appointments, clinical records, and payments. Deployed on Vercel with a self-managed Insforge (PostgreSQL) backend. HIPAA-conscious role-based access so clinical data is limited to authorized physicians.',
    stack: 'React|Next.js|TypeScript|Tailwind CSS|PostgreSQL|Insforge|Vercel|Proxmox',
    highlights:
      'Shipped a production dental clinic SaaS end-to-end|Implemented patients, odontograms, appointments, records, and payments|Designed HIPAA-conscious RBAC so clinical data stays limited to authorized physicians|Deployed on Vercel with a self-managed Insforge/PostgreSQL backend on Proxmox',
    img: 'assets/img/portfolio/aida.png',
    url: 'assets/Omar-Dental-Family-Case-Study.pdf',
    cta: 'View case study',
    shortDesc: 'Production dental clinic SaaS — full-stack, in production.',
  },
  {
    title: 'BYD El Salvador',
    blurb: 'WordPress from scratch using Elementor.',
    overview:
      'Marketing site for BYD El Salvador built from scratch in WordPress with Elementor — structured pages for brand presence, vehicle storytelling, and local lead capture.',
    stack: 'WordPress|Elementor|PHP|CSS|JavaScript',
    highlights:
      'Built the site from a blank WordPress install with Elementor|Structured automotive brand pages for El Salvador market|Polished layout and responsive behavior for conversion-focused browsing',
    img: 'assets/img/portfolio/byd.png',
    imgFit: 'contain',
    mediaClass: 'bg-surface-2 p-6 grid place-items-center',
    imgClass: '!object-contain !scale-100',
    url: 'https://bydelsalvador.com/',
    pill: 'WordPress',
    shortDesc: 'Built from scratch using Elementor.',
    delay: '0.05',
  },
  {
    title: 'Somos Iberoamérica',
    blurb: 'Pure PHP code to editable Gutenberg.',
    overview:
      'Migrated a custom pure-PHP site into WordPress so editors could manage content in Gutenberg instead of depending on developer hand-offs for every update.',
    stack: 'WordPress|Gutenberg|PHP|CSS|JavaScript',
    highlights:
      'Rebuilt a hard-coded PHP experience as an editable WordPress site|Moved content ownership into Gutenberg blocks for non-dev editors|Preserved structure and messaging while modernizing the CMS workflow',
    img: 'assets/img/portfolio/somos.png',
    imgFit: 'contain',
    mediaClass: 'bg-white p-6 grid place-items-center',
    imgClass: '!object-contain !scale-100',
    url: 'https://somosiberoamerica.org/',
    pill: 'WordPress',
    shortDesc: 'Pure PHP code to editable Gutenberg.',
    delay: '0.1',
  },
  {
    title: 'M&M Studios',
    blurb: 'Webflow site for a creative studio.',
    overview:
      'Webflow marketing site for a creative studio — clean presentation of services, work, and contact paths with a studio-forward visual system.',
    stack: 'Webflow|Client-First|CMS|CSS|Interactions',
    highlights:
      'Built a polished studio site in Webflow with a clear services narrative|Used CMS patterns so the team can publish work without breaking layout|Tuned interactions and responsive layouts for a portfolio-first feel',
    img: 'assets/img/portfolio/mm.png',
    url: 'https://www.mandmstudios.com/',
    pill: 'Webflow',
    shortDesc: 'Site for a creative studio.',
    delay: '0.1',
  },
  {
    title: 'Park Central Dental',
    blurb: 'Webflow CMS with SEO focus.',
    overview:
      'Professional dental practice site on Webflow with CMS-driven content and an SEO-minded structure for local discovery and patient education.',
    stack: 'Webflow|CMS|SEO|Client-First|HTML/CSS',
    highlights:
      'Implemented Webflow CMS collections for scalable practice content|Structured pages and metadata with local SEO in mind|Built a clean, trustworthy UX suited to dental patient journeys',
    img: 'assets/img/portfolio/central.webp',
    url: 'https://www.parkcentraldentaltx.com/',
    pill: 'Webflow',
    shortDesc: 'CMS with SEO focus.',
  },
  {
    title: 'Wesmark Dentistry',
    blurb: 'Webflow site designed for patient conversion.',
    overview:
      'Webflow corporate site for a family dentistry practice, designed around easy navigation and clear conversion paths for new patients.',
    stack: 'Webflow|CMS|SEO|Client-First|Forms',
    highlights:
      'Designed information architecture for patient conversion|Built appointment-oriented CTAs and scannable service pages|Kept the site maintainable in Webflow for ongoing clinic updates',
    img: 'assets/img/portfolio/wesmark.png',
    url: 'https://www.wesmarkfamilydentistry.com/',
    pill: 'Webflow',
    shortDesc: 'Designed for patient conversion.',
    delay: '0.05',
  },
  {
    title: 'Scalar',
    blurb: 'Custom product component implementation.',
    overview:
      'Custom frontend product UI work for the Scalar platform — implementing product-facing components that had to fit an existing product system and interaction model.',
    stack: 'JavaScript|Frontend|Product UI|CSS|Component design',
    highlights:
      'Implemented custom product components for Scalar’s marketing/product surface|Matched existing product UI patterns and interaction expectations|Delivered frontend work inside a live product context, not a brochure site',
    img: 'assets/img/portfolio/scalar.png',
    url: 'https://scalar.io/product',
    shortDesc: 'Custom product component implementation.',
    delay: '0.1',
  },
  {
    title: 'Sucuri',
    blurb: 'Configurable WordPress components with ACF.',
    overview:
      "At Nicasource, I built new Sucuri Blog components with Advanced Custom Fields (ACF) when the native editor could not support the client's editing needs. An options page and component fields let editors customize text, colors, and variants. I served as the primary client contact.",
    stack: 'WordPress|ACF|Options page|Configurable components',
    highlights:
      'Built new components with ACF|Created an options page for client-controlled settings|Made text, colors, and variants editable|Served as primary client contact',
    img: 'assets/img/portfolio/sucuri.png',
    url: 'https://blog.sucuri.net/',
    pill: 'WordPress',
    shortDesc: 'Configurable components with ACF.',
  },
  {
    title: 'Hope of America',
    blurb: 'Organizational site for events and outreach.',
    overview:
      'Organizational WordPress site for Hope of America — built to support events, community outreach, and ongoing nonprofit communication.',
    stack: 'WordPress|PHP|CMS|CSS|Events content',
    highlights:
      'Delivered a WordPress site suited to nonprofit events and outreach|Made content areas editable for recurring campaigns and updates|Kept navigation simple for visitors discovering programs and events',
    img: 'assets/img/portfolio/hopeofamerica.png',
    url: 'https://hopeofamerica.org/',
    pill: 'WordPress',
    shortDesc: 'Organizational site for events and outreach.',
    delay: '0.05',
  },
  {
    title: 'Elevare Dental',
    blurb: 'Webflow site from scratch, designed in Figma.',
    overview:
      'Dental practice site built in Webflow from scratch from a Figma design — a polished patient-facing presence with CMS-ready structure and conversion-focused layout.',
    stack: 'Webflow|Figma|Client-First|CMS|Interactions',
    highlights:
      'Built the full site in Webflow from a Figma design|Implemented a clean, conversion-oriented patient journey|Set up maintainable Webflow structure for ongoing clinic updates',
    img: 'assets/img/portfolio/elevare-dental.png',
    imgFit: 'contain',
    mediaClass: 'bg-surface-2 p-6 grid place-items-center',
    imgClass: '!object-contain !scale-100',
    url: 'https://www.elevare-dental.com/',
    pill: 'Webflow',
    shortDesc: 'Built from scratch from a Figma design.',
    delay: '0.1',
  },
  {
    title: 'Cardinal Park Family Dental',
    blurb: 'WordPress site built with Elementor.',
    overview:
      'WordPress site for Cardinal Park Family Dental Care, built with Elementor — a patient-facing practice presence for services, trust, and contact.',
    stack: 'WordPress|Elementor|PHP|CSS|JavaScript',
    highlights:
      'Built the practice site in WordPress with Elementor|Structured patient-facing pages for a family dental clinic|Delivered a clean, editable layout the practice can maintain',
    img: 'assets/img/portfolio/cardinal-park.png',
    imgFit: 'contain',
    mediaClass: 'bg-surface-2 p-6 grid place-items-center',
    imgClass: '!object-contain !scale-100',
    url: 'https://cardinalparkfamilydental.com/',
    pill: 'WordPress',
    shortDesc: 'Site built with Elementor.',
  },
  {
    title: 'Nicasource',
    blurb: 'React, Vue, and WordPress for international clients (2022–2024).',
    overview:
      'Software engineering tenure at Nicasource (Florida, US, remote): delivered work across React, Vue, and WordPress, including configurable ACF components for Sucuri.',
    stack: 'React|Vue|WordPress|ACF|JavaScript|Git',
    highlights:
      'Owned web development delivery for international client requirements|Built configurable ACF components for Sucuri|Contributed to reusable components, architecture, and performance work',
    img: 'assets/img/portfolio/nicasource.png',
    imgFit: 'contain',
    mediaClass: 'bg-surface-2 p-6 grid place-items-center',
    imgClass: '!object-contain !scale-100',
    pill: 'WordPress',
    shortDesc: 'React, Vue, and CMS work for international clients (2022–2024).',
    delay: '0.05',
  },
  {
    title: 'This site',
    blurb: 'JSON-LD, resume.json, llms.txt, print-ready PDF. View source.',
    overview:
      'This portfolio itself: an AI-ready resume site with structured data (JSON-LD), machine-readable resume.json and llms.txt, print-ready PDFs, and authored GSAP motion — built to be readable by humans, ATS systems, and LLMs.',
    stack: 'Astro|HTML|CSS|Tailwind|GSAP|JSON-LD',
    highlights:
      'Structured the site for humans, ATS, and LLMs (JSON-LD, resume.json, llms.txt)|Shipped print-ready PDF builds alongside the live portfolio|Authored motion and layout as a production proof of craft, not a template',
    flat: true,
    flatLabel: 'AI-ready|resume site',
    url: 'https://github.com/Omazon/resume',
    shortDesc: 'JSON-LD, resume.json, llms.txt, print-ready PDF. View source.',
    delay: '0.1',
  },
];
