import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Home,
  FileText,
  LayoutGrid,
  CalendarDays,
  Camera,
  Eye,
  Send,
  UploadCloud,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Film,
  TrendingUp,
  Users,
  MessageSquare,
  DollarSign,
  ArrowRight,
  Shield,
  Target,
  BarChart3,
  X,
  Zap,
  Quote,
  Download,
} from 'lucide-react';

/* =====================================================
   BRAND COMPONENTS
   ===================================================== */

const LunimLogo = ({ className = "text-xl" }) => (
  <div className={`font-bold tracking-tight text-accent flex items-baseline select-none ${className}`}>
    lun<span style={{ textShadow: '0 0 8px #67D9FF', color: '#67D9FF' }}>i</span>m
  </div>
);

/* =====================================================
   BENCHMARK SCRIPT DATA
   ===================================================== */

const SCRIPTS = {
  whiplash: {
    title: 'Whiplash',
    logline:
      "A promising young drummer at a competitive music conservatory finds himself under the wing of a terrifying instructor who will stop at nothing to realize a student's potential.",
    genres: ['Drama', 'Music'],
    writer: 'Damien Chazelle',
    pages: 106,
    format: 'Feature Film',
    scores: [
      { label: 'Pacing', value: 9, icon: TrendingUp },
      { label: 'Characterization', value: 10, icon: Users },
      { label: 'Dialogue', value: 9, icon: MessageSquare },
      { label: 'Commercial Potential', value: 8, icon: DollarSign },
    ],
    strengths: [
      'Relentless escalating dramatic tension \u2014 the script maintains a near-suffocating forward momentum from the opening scene through the final performance.',
      'Masterclass antagonist dynamic between Andrew and Fletcher; their psychological push-pull is the structural spine of the entire screenplay and never loses force.',
      'Sharp rhythmic dialogue cadence \u2014 Chazelle mirrors the musicality of jazz in his scene construction, using tempo shifts and staccato exchanges to sustain visceral energy.',
      'The final nine-page performance sequence is an exceptional example of purely visual/kinetic storytelling that resolves both internal and external conflict simultaneously.',
    ],
    weaknesses: [
      "Secondary relationship subplot (Nicole) feels underdeveloped in Act II \u2014 her exit at the midpoint lacks the dramatic weight it needs because the relationship was never given adequate page time.",
      'Rapid pacing leaves little room for emotional decompression \u2014 the relentless intensity, while effective, risks audience fatigue without brief moments of release.',
      "Andrew's family dynamics (particularly the dinner scene) are efficiently drawn but could benefit from one additional beat to ground his motivations beyond pure ambition.",
    ],
    revisions: [
      {
        priority: '01',
        area: 'Character Development',
        title: "Deepen Nicole's Character Motivations in Mid-Act II",
        description:
          "Expand the Nicole subplot with 2\u20133 additional pages of development before the breakup scene. Give her a perspective on ambition that directly mirrors or challenges Andrew's obsession, so the separation carries thematic weight rather than feeling like a plot convenience.",
      },
      {
        priority: '02',
        area: 'Pacing & Rhythm',
        title: 'Allow Breathing Room After Psychological Confrontations',
        description:
          "Insert brief beats of silence or stillness after the major Fletcher/Andrew confrontations (particularly the chair-throwing sequence and the car crash). These pauses let dramatic weight settle and prevent the script's intensity from becoming numbing.",
      },
      {
        priority: '03',
        area: 'Supporting Cast',
        title: 'Develop the Conservatory Ensemble',
        description:
          "Give one or two of the other band members (Connolly, Tanner) a single defining scene that establishes them beyond their functional roles. This deepens the world and raises the emotional stakes of Fletcher's psychological warfare on the group.",
      },
    ],
  },

  socialNetwork: {
    title: 'The Social Network',
    logline:
      'The story of the founding of Facebook and the resulting lawsuits, told through the lens of ambition, betrayal, and the loneliness of connection in the digital age.',
    genres: ['Drama', 'Biography'],
    writer: 'Aaron Sorkin',
    pages: 162,
    format: 'Feature Film',
    scores: [
      { label: 'Pacing', value: 10, icon: TrendingUp },
      { label: 'Characterization', value: 9, icon: Users },
      { label: 'Dialogue', value: 10, icon: MessageSquare },
      { label: 'Commercial Potential', value: 9, icon: DollarSign },
    ],
    strengths: [
      'Exceptional non-linear framing structure \u2014 the dual-deposition timeline creates an inherently dramatic engine that propels every scene with built-in irony and tension.',
      "Brilliant multi-layered dialogue pacing \u2014 Sorkin's rapid-fire exchanges carry exposition, character development, and thematic commentary simultaneously without ever feeling didactic.",
      'Clear thematic focus on power and isolation \u2014 Mark\u2019s trajectory is a masterful study of how success and connection can be inversely proportional, resolved perfectly in the final Erica beat.',
      'The Winklevoss twins and Eduardo each function as distinct thematic mirrors to Mark, giving the ensemble depth while maintaining the protagonist\u2019s centrality.',
    ],
    weaknesses: [
      'Dense dialogue density risks pacing exhaustion in Act I \u2014 the Henley Regatta and early Harvard sequences pile on information rapidly, which may challenge audiences not already invested.',
      "Rapid timeline transitions between depositions and flashbacks require tight visual cues; on the page, these jumps occasionally create momentary disorientation before the reader orients.",
      "Erica Albright\u2019s limited screen time, while thematically intentional, means her final scene carries symbolic weight that her actual presence in the story hasn\u2019t fully earned.",
    ],
    revisions: [
      {
        priority: '01',
        area: 'Structural Transitions',
        title: 'Smooth Deposition-to-Flashback Transitions in Early Pages',
        description:
          'Add clearer temporal anchoring in the first 20 pages. Brief slug-line markers or a consistent visual motif (lighting shift, sound design cue) would ease the audience into the non-linear rhythm before the structure becomes intuitive.',
      },
      {
        priority: '02',
        area: 'Narrative Clarity',
        title: 'Clarify Secondary Equity Dispute Timelines in Act II',
        description:
          "The Eduardo dilution subplot and the Winklevoss settlement run in parallel, but their legal timelines blur in the mid-script. Adding one or two orienting lines of dialogue in the deposition scenes (e.g., referencing specific dates) would prevent the audience from conflating the two disputes.",
      },
      {
        priority: '03',
        area: 'Character Presence',
        title: 'Establish Erica with One Additional Early Scene',
        description:
          "Consider adding a single brief scene (1\u20132 pages) in early Act II where Mark encounters or references Erica outside the opening context. This would give the film\u2019s closing beat \u2014 Mark refreshing her Facebook page \u2014 deeper emotional resonance.",
      },
    ],
  },

  custom: {
    title: 'Untitled Project',
    logline: 'Custom screenplay uploaded for diagnostic coverage analysis.',
    genres: ['Unclassified'],
    writer: 'Unknown',
    pages: '\u2014',
    format: 'Screenplay',
    scores: [
      { label: 'Pacing', value: 7, icon: TrendingUp },
      { label: 'Characterization', value: 6, icon: Users },
      { label: 'Dialogue', value: 7, icon: MessageSquare },
      { label: 'Commercial Potential', value: 5, icon: DollarSign },
    ],
    strengths: [
      'The opening sequence establishes a clear tonal identity and effectively anchors the reader in the story world within the first five pages.',
      'Dialogue voice is consistent across the principal cast, with each character maintaining a distinct speech pattern that supports identification.',
      'Act II midpoint creates a genuine reversal that reframes the central dramatic question in a compelling direction.',
    ],
    weaknesses: [
      'Act I setup extends beyond the expected threshold, delaying the inciting incident and risking early disengagement.',
      'The antagonist\u2019s motivations remain opaque through the second act, weakening the central conflict\u2019s dramatic urgency.',
      'Several exposition-heavy scenes in the B-story could be condensed or dramatized to maintain pacing consistency.',
    ],
    revisions: [
      {
        priority: '01',
        area: 'Act Structure',
        title: 'Tighten Act I Entry Point',
        description:
          'Move the inciting incident closer to page 12\u201315. Consider opening in medias res or cutting the preliminary setup scenes that duplicate information delivered more effectively through later dialogue.',
      },
      {
        priority: '02',
        area: 'Antagonist Arc',
        title: 'Surface Antagonist Motivation Earlier',
        description:
          'Introduce a revealing beat for the antagonist in the first act that hints at their underlying motivation. This creates dramatic irony and raises the stakes before the midpoint confrontation.',
      },
      {
        priority: '03',
        area: 'Pacing',
        title: 'Condense Expository B-Story Scenes',
        description:
          'Identify the two longest B-story scenes and either merge them into a single, more dynamic sequence or convert the exposition into visual storytelling that can play under the main action.',
      },
    ],
  },
};

/* =====================================================
   PIPELINE SEQUENCE DEFINITION
   ===================================================== */

const PIPELINE_STAGES = [
  { key: 'Script',    label: 'Parsing Courier formatting and scene headers\u2026',       skeletonType: 'script' },
  { key: 'Breakdown', label: 'Extracting characters, props, and locations\u2026',        skeletonType: 'breakdown' },
  { key: 'Plan',      label: 'Structuring stripboard and day-out-of-days\u2026',         skeletonType: 'plan' },
  { key: 'Shot',      label: 'Generating camera coverage and shot lists\u2026',           skeletonType: 'shot' },
  { key: 'Review',    label: 'Aligning post-production metadata\u2026',                  skeletonType: 'review' },
  { key: 'Deliver',   label: 'Finalizing export packages\u2026',                          skeletonType: 'deliver' },
];

/* =====================================================
   SIDEBAR
   ===================================================== */

const NAV_ITEMS = [
  { icon: Home, label: 'Home', isHome: true },
  { icon: FileText, label: 'Script' },
  { icon: LayoutGrid, label: 'Breakdown' },
  { icon: CalendarDays, label: 'Plan' },
  { icon: Camera, label: 'Shot' },
  { icon: Eye, label: 'Review' },
  { icon: Send, label: 'Deliver' },
];

function Sidebar({ activeTab, pipelineActive, completedTabs, onHome }) {
  return (
    <aside className="flex flex-col items-center w-[76px] min-w-[76px] bg-surface border-r border-border py-5 gap-1 relative">
      <div className="flex flex-col items-center justify-center mb-6">
        <LunimLogo className="text-xl" />
        <span className="text-[8px] text-tertiary tracking-widest uppercase mt-1 text-center leading-none">
          Studio<br/>Suite
        </span>
      </div>

      <nav className="flex flex-col justify-start gap-3 flex-1 py-4">
        {NAV_ITEMS.map(({ icon: Icon, label, isHome }) => {
          const isActive = activeTab === label;
          const isCompleted = completedTabs.includes(label);

          return (
            <div key={label} className="relative">
              <button
                onClick={isHome ? onHome : undefined}
                className={`group flex flex-col items-center justify-center w-12 h-12 rounded-lg transition-colors duration-200
                  ${isHome ? 'cursor-pointer' : 'cursor-default'}
                  ${isActive
                    ? 'bg-elevated text-accent'
                    : isCompleted
                    ? 'text-success-muted'
                    : isHome
                    ? 'text-tertiary hover:bg-elevated hover:text-secondary'
                    : 'text-tertiary'
                  }`}
                title={label}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2 : 1.5} />
                <span className={`text-[9px] mt-1 font-medium tracking-wide uppercase
                  ${isActive ? 'text-accent' : isCompleted ? 'text-success-muted' : 'text-tertiary'}`}>
                  {label}
                </span>
              </button>
              {/* Completed check indicator */}
              {isCompleted && !isActive && (
                <div className="absolute -right-0.5 top-1 w-3 h-3 rounded-full bg-surface flex items-center justify-center">
                  <CheckCircle2 className="w-2.5 h-2.5 text-success-muted" />
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-4">
        <div className="w-8 h-8 rounded-full bg-elevated flex items-center justify-center text-[10px] font-semibold text-secondary border border-border tracking-wider">
          LM
        </div>
      </div>
    </aside>
  );
}

/* =====================================================
   SCORE METRIC CARD
   ===================================================== */

function ScoreMetric({ label, value, max = 10, icon: Icon, delay = 0 }) {
  const pct = (value / max) * 100;
  let barColor, textColor;
  if (value >= 9)      { barColor = 'bg-success'; textColor = 'text-success'; }
  else if (value >= 7) { barColor = 'bg-accent';  textColor = 'text-accent'; }
  else if (value >= 5) { barColor = 'bg-warning'; textColor = 'text-warning'; }
  else                 { barColor = 'bg-critical'; textColor = 'text-critical'; }

  return (
    <div className="stagger-child space-y-2" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-tertiary" strokeWidth={1.5} />
          <span className="text-xs font-medium text-secondary">{label}</span>
        </div>
        <span className={`text-sm font-semibold ${textColor}`}>
          {value}<span className="text-tertiary font-normal text-xs">/{max}</span>
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-elevated overflow-hidden">
        <div className={`h-full rounded-full ${barColor} animate-fill-bar`} style={{ width: `${pct}%`, opacity: 0.85 }} />
      </div>
    </div>
  );
}

/* =====================================================
   ONBOARDING DASHBOARD
   ===================================================== */

const ONBOARDING_STEPS = [
  { num: '1', label: 'Ingest Script' },
  { num: '2', label: 'Analyze Narrative' },
  { num: '3', label: 'Generate Breakdown' },
  { num: '4', label: 'Build Pipeline' },
];

function OnboardingView({ onInitialize }) {
  return (
    <div className="flex flex-col h-full w-full bg-app relative overflow-hidden">
      
      {/* Decorative Background Telemetry Cards */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        
        {/* Card 1 — Top Left */}
        <div className="absolute top-16 lg:top-24 left-[3%] lg:left-[8%] -rotate-6 bg-[#181A1F]/40 border border-[#262930]/50 backdrop-blur-sm rounded-lg p-3 lg:p-4 max-w-[180px] lg:max-w-[220px] text-tertiary shadow-2xl animate-float">
          <div className="text-accent text-[9px] lg:text-[10px] font-mono uppercase mb-1.5">COVERAGE MATCH</div>
          <div className="font-ui text-xs lg:text-sm italic text-tertiary/60 leading-relaxed">
            "Exceptional pacing and dialogue flow."
          </div>
        </div>

        {/* Card 2 — Bottom Left */}
        <div className="absolute bottom-12 lg:bottom-32 left-[3%] lg:left-[12%] rotate-3 bg-[#181A1F]/40 border border-[#262930]/50 backdrop-blur-sm rounded-lg p-3 lg:p-4 max-w-[180px] lg:max-w-[220px] text-tertiary shadow-2xl animate-float-delayed">
          <div className="text-critical text-[9px] lg:text-[10px] font-mono uppercase mb-1.5">FORMAT REJECTED</div>
          <div className="font-ui text-xs lg:text-sm text-tertiary/60 leading-relaxed">
            "Error: Please upload standard screenplay formatting."
          </div>
        </div>

        {/* Card 3 — Middle Right */}
        <div className="absolute top-[30%] lg:top-1/3 right-[3%] lg:right-[8%] -rotate-2 bg-[#181A1F]/40 border border-[#262930]/50 backdrop-blur-sm rounded-lg p-3 lg:p-4 max-w-[180px] lg:max-w-[220px] text-tertiary shadow-2xl animate-float">
          <div className="text-tertiary text-[9px] lg:text-[10px] font-mono uppercase mb-1.5">NARRATIVE OVERLAP</div>
          <div className="font-ui text-xs lg:text-sm text-tertiary/60 leading-relaxed">
            "Tracing inspiration sources and thematic overlap."
          </div>
        </div>

        {/* Card 4 — Bottom Right */}
        <div className="absolute bottom-8 lg:bottom-16 right-[3%] lg:right-[6%] -rotate-6 bg-[#181A1F]/40 border border-[#262930]/50 backdrop-blur-sm rounded-lg p-3 lg:p-4 max-w-[180px] lg:max-w-[220px] text-tertiary shadow-2xl animate-float-delayed">
          <div className="text-success text-[9px] lg:text-[10px] font-mono uppercase mb-1.5">ACT III PACING</div>
          <div className="font-ui text-xs lg:text-sm italic text-tertiary/60 leading-relaxed">
            "Tempo aligns perfectly with thriller benchmarks."
          </div>
        </div>

        {/* Card 5 — Top Right */}
        <div className="absolute top-16 lg:top-24 right-[2%] lg:right-[4%] rotate-2 bg-[#181A1F]/40 border border-[#262930]/50 backdrop-blur-sm rounded-lg p-3 lg:p-4 max-w-[180px] lg:max-w-[220px] text-tertiary shadow-2xl animate-float">
          <div className="text-warning text-[9px] lg:text-[10px] font-mono uppercase mb-1.5">DIALOGUE DENSITY</div>
          <div className="font-ui text-xs lg:text-sm text-tertiary/60 leading-relaxed">
            "Unbroken dialogue chains on pages 45-52."
          </div>
        </div>

        {/* Card 7 — Mid Left */}
        <div className="absolute top-[52%] lg:top-[48%] left-[2%] lg:left-[5%] -rotate-2 bg-[#181A1F]/40 border border-[#262930]/50 backdrop-blur-sm rounded-lg p-3 lg:p-4 max-w-[180px] lg:max-w-[220px] text-tertiary shadow-2xl animate-float">
          <div className="text-[#FFBF66] text-[9px] lg:text-[10px] font-mono uppercase mb-1.5">SCENE EXTRACTION</div>
          <div className="font-ui text-xs lg:text-sm text-tertiary/60 leading-relaxed">
            "114 scenes. Night shoots: 40% of schedule."
          </div>
        </div>

      </div>

      {/* Top Header Bar */}
      <header className="flex-none h-12 bg-surface border-b border-border flex items-center justify-between px-6 z-10 relative">
        <div className="flex items-center gap-2">
          <LunimLogo className="text-base mr-1" />
          <span className="text-xs text-secondary font-ui tracking-wide">
            Studio / Script Analysis Engine
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-tertiary">
          System Status: Active
          <span className="text-tertiary/50">•</span>
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            Engine Ready
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto relative z-20">
        <div className="stagger-child bg-surface border border-border rounded-2xl p-8 w-full max-w-2xl shadow-2xl flex flex-col items-center text-center space-y-8" style={{ animationDelay: '0ms' }}>
          
          {/* Top Section: Icon & Badges */}
          <div className="flex flex-col items-center gap-4">
            {/* Branded Logo Container */}
            <div className="bg-app border border-border rounded-xl py-4 px-6 shadow-inner flex items-center justify-center">
              <LunimLogo className="text-3xl" />
            </div>
            
            {/* Tagline Badge */}
            <div className="bg-app text-accent text-[11px] font-mono px-3 py-1 rounded-full border border-border tracking-wide uppercase">
              LUNIM STUDIO • FROM IDEA TO AUDIENCE
            </div>
          </div>

          {/* Headline & Subtitle */}
          <div className="space-y-3 max-w-xl mx-auto">
            <h1 className="text-2xl font-semibold text-primary tracking-tight font-ui">
              Intelligent Infrastructure for Film & IP Creators
            </h1>
            <p className="text-sm text-tertiary leading-relaxed">
              Transform raw screenplays into structured, fundable, and production-ready assets. The engine analyzes narrative architecture, extracts production elements, and builds execution pipelines.
            </p>
          </div>

          {/* Workflow Steps Row */}
          <div className="flex flex-row items-center justify-center flex-nowrap w-full gap-2">
            {ONBOARDING_STEPS.map((step, i) => (
              <div key={step.num} className="flex items-center gap-2 whitespace-nowrap">
                <div className="bg-app text-secondary border border-border text-xs rounded-md px-3 py-1.5 font-mono flex items-center gap-2 shadow-sm">
                  <span className="text-accent">{step.num}</span>
                  {step.label}
                </div>
                {i < ONBOARDING_STEPS.length - 1 && (
                  <ArrowRight className="w-3 h-3 text-tertiary/50 shrink-0" />
                )}
              </div>
            ))}
          </div>

          {/* Value Pillars Grid */}
          <div className="grid grid-cols-3 gap-4 w-full text-left">
            <div className="bg-app/60 border border-border p-3.5 rounded-lg flex flex-col gap-1.5">
              <h3 className="text-xs font-medium text-primary">Structural Integrity</h3>
              <p className="text-[11px] text-tertiary leading-relaxed">
                Automated Act, Pacing & Character Arc Diagnostics
              </p>
            </div>
            <div className="bg-app/60 border border-border p-3.5 rounded-lg flex flex-col gap-1.5">
              <h3 className="text-xs font-medium text-primary">Execution Strategy</h3>
              <p className="text-[11px] text-tertiary leading-relaxed">
                Instant Scene Extraction & Production Scheduling
              </p>
            </div>
            <div className="bg-app/60 border border-border p-3.5 rounded-lg flex flex-col gap-1.5">
              <h3 className="text-xs font-medium text-primary">Commercial Viability</h3>
              <p className="text-[11px] text-tertiary leading-relaxed">
                Objective Coverage Scorecards for Investors & Partners
              </p>
            </div>
          </div>

          {/* CTA & Footer */}
          <div className="w-full space-y-3 pt-2">
            <button
              onClick={onInitialize}
              className="w-full bg-accent hover:bg-[#52c7ee] text-app font-semibold rounded-lg py-3 px-6 text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-accent/10"
            >
              Initialize Workspace & Ingest Script
            </button>
            <p className="text-[11px] text-tertiary/70 text-center tracking-wide">
              Supported Formats: .PDF, .TXT • Industry Standard Screenplay Intake • End-to-End Encryption
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

/* =====================================================
   UPLOAD ZONE (Custom files only)
   ===================================================== */

function UploadZone({ onUpload }) {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileAction = useCallback((file) => {
    if (file) onUpload(file);
  }, [onUpload]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFileAction(file);
  }, [handleFileAction]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) handleFileAction(file);
  }, [handleFileAction]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="flex items-center justify-center h-full animate-fade-up">
      <div className="w-full max-w-xl px-4">
        <button
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          className={`upload-zone group relative flex flex-col items-center justify-center gap-4 w-full p-14 rounded-xl border border-dashed cursor-pointer transition-all
            ${dragOver ? 'border-accent/40 bg-elevated/60' : 'border-border bg-surface/30'}`}
        >
          <UploadCloud className="w-10 h-10 text-tertiary group-hover:text-secondary transition-colors" strokeWidth={1.25} />
          <div className="text-center space-y-1.5">
            <h2 className="text-base font-medium text-primary">
              Upload Screenplay for Coverage Analysis
            </h2>
            <p className="text-sm text-tertiary">
              Drop your <span className="text-secondary">.pdf</span> or <span className="text-secondary">.txt</span> file, or click to browse
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-tertiary text-[11px]">
            <ArrowRight className="w-3 h-3" />
            Script Coverage &amp; Narrative Analysis
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.fdx,.fountain"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    </div>
  );
}

/* =====================================================
   PIPELINE PROCESSING — Skeleton Wireframes
   ===================================================== */

function SkeletonBlock({ width = 'w-full', height = 'h-3', className = '' }) {
  return <div className={`${width} ${height} rounded bg-elevated animate-skeleton ${className}`} />;
}

function SkeletonScript() {
  return (
    <div className="animate-fade-in space-y-6 max-w-2xl mx-auto">
      <div className="bg-surface rounded-xl border border-border p-6 space-y-4">
        <SkeletonBlock width="w-48" height="h-3" />
        <div className="space-y-2 pl-4 font-script">
          <SkeletonBlock width="w-32" height="h-2.5" />
          <SkeletonBlock width="w-full" height="h-2" />
          <SkeletonBlock width="w-5/6" height="h-2" />
          <div className="h-3" />
          <SkeletonBlock width="w-40" height="h-2.5" />
          <SkeletonBlock width="w-full" height="h-2" />
          <SkeletonBlock width="w-3/4" height="h-2" />
          <SkeletonBlock width="w-full" height="h-2" />
          <div className="h-3" />
          <SkeletonBlock width="w-36" height="h-2.5" />
          <SkeletonBlock width="w-2/3" height="h-2" />
        </div>
      </div>
    </div>
  );
}

function SkeletonBreakdown() {
  return (
    <div className="animate-fade-in grid grid-cols-3 gap-4 max-w-3xl mx-auto">
      {['Characters', 'Props', 'Locations'].map((cat) => (
        <div key={cat} className="bg-surface rounded-xl border border-border p-5 space-y-3">
          <span className="text-[10px] font-medium text-tertiary uppercase tracking-wider">{cat}</span>
          <div className="space-y-2">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-elevated animate-skeleton" />
                <SkeletonBlock width={i % 2 === 0 ? 'w-20' : 'w-16'} height="h-2" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonPlan() {
  return (
    <div className="animate-fade-in max-w-3xl mx-auto space-y-3">
      <div className="bg-surface rounded-xl border border-border p-5 space-y-3">
        <span className="text-[10px] font-medium text-tertiary uppercase tracking-wider">Stripboard</span>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5 border-b border-border/50 last:border-0">
            <SkeletonBlock width="w-8" height="h-2" />
            <SkeletonBlock width="w-6" height="h-5" />
            <SkeletonBlock width={i % 2 === 0 ? 'w-40' : 'w-52'} height="h-2" />
            <div className="flex-1" />
            <SkeletonBlock width="w-12" height="h-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonShot() {
  return (
    <div className="animate-fade-in grid grid-cols-2 gap-4 max-w-3xl mx-auto">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="bg-surface rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Camera className="w-3 h-3 text-tertiary/40" />
            <SkeletonBlock width="w-16" height="h-2" />
          </div>
          <div className="w-full aspect-[16/9] rounded-lg bg-elevated animate-skeleton" />
          <div className="space-y-1.5">
            <SkeletonBlock width="w-24" height="h-2" />
            <SkeletonBlock width="w-32" height="h-1.5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkeletonReview() {
  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-4">
      <div className="bg-surface rounded-xl border border-border p-5 space-y-4">
        <span className="text-[10px] font-medium text-tertiary uppercase tracking-wider">Post-Production Metadata</span>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <div className="flex items-center gap-3">
              <SkeletonBlock width="w-20" height="h-2" />
            </div>
            <SkeletonBlock width="w-24" height="h-5" className="rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonDeliver() {
  return (
    <div className="animate-fade-in max-w-2xl mx-auto space-y-4">
      <div className="bg-surface rounded-xl border border-border p-5 space-y-3">
        <span className="text-[10px] font-medium text-tertiary uppercase tracking-wider">Export Packages</span>
        {['Coverage Report (.pdf)', 'Breakdown Sheet (.csv)', 'Shooting Schedule (.xlsx)'].map((item) => (
          <div key={item} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
            <span className="text-xs text-secondary">{item}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-16 h-1 rounded-full bg-elevated overflow-hidden">
                <div className="h-full rounded-full bg-accent/50 animate-fill-bar" style={{ width: '100%' }} />
              </div>
              <Loader2 className="w-3 h-3 text-tertiary animate-spin-slow" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const SKELETON_MAP = {
  script: SkeletonScript,
  breakdown: SkeletonBreakdown,
  plan: SkeletonPlan,
  shot: SkeletonShot,
  review: SkeletonReview,
  deliver: SkeletonDeliver,
};

/* =====================================================
   PIPELINE PROCESSING VIEW
   ===================================================== */

function PipelineView({ stageIndex, stageLabel, skeletonType, progress }) {
  const SkeletonComponent = SKELETON_MAP[skeletonType] || SkeletonScript;

  return (
    <div className="h-full flex flex-col px-6 py-6 overflow-hidden">
      {/* Pipeline status header */}
      <div className="mb-6 space-y-3 animate-fade-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Loader2 className="w-4 h-4 text-accent animate-spin-slow" />
            <span className="text-sm font-medium text-primary">{stageLabel}</span>
          </div>
          <span className="text-[11px] font-mono text-tertiary">
            Stage {stageIndex + 1} / {PIPELINE_STAGES.length}
          </span>
        </div>
        <div className="relative h-1 w-full rounded-full bg-elevated overflow-hidden">
          <div
            className="h-full rounded-full bg-accent/60 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 animate-shimmer rounded-full" />
        </div>
      </div>

      {/* Skeleton wireframe area */}
      <div className="flex-1 overflow-hidden flex items-start justify-center pt-4" key={skeletonType}>
        <SkeletonComponent />
      </div>
    </div>
  );
}

/* =====================================================
   FORMAT ERROR MODAL
   ===================================================== */

function ErrorModal({ error, onClose }) {
  if (!error) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface border border-border rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-tertiary hover:text-primary transition-colors cursor-pointer">
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-critical/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-critical" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-primary">Format Rejected</h3>
            <p className="text-[11px] text-tertiary font-mono uppercase tracking-wide">{error.error}</p>
          </div>
        </div>
        <p className="text-sm text-secondary leading-relaxed mb-4">{error.message}</p>
        {error.details && (
          <div className="bg-app rounded-lg border border-border p-4 text-[13px] text-tertiary font-script leading-relaxed">
            {error.details}
          </div>
        )}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-elevated hover:bg-border text-primary font-medium rounded-lg py-2.5 text-sm transition-colors cursor-pointer"
        >
          Upload Different File
        </button>
      </div>
    </div>
  );
}

/* =====================================================
   RADIAL SCORE RING
   ===================================================== */

function RadialScore({ score, size = 120 }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? 'var(--color-success)' : score >= 60 ? 'var(--color-accent)' : score >= 40 ? 'var(--color-warning)' : 'var(--color-critical)';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-primary">{score}</span>
        <span className="text-[10px] text-tertiary uppercase tracking-wide">/ 100</span>
      </div>
    </div>
  );
}

/* =====================================================
   WEIGHTED METRIC BAR
   ===================================================== */

function WeightedMetric({ label, value, weight, icon: Icon, color }) {
  return (
    <div className="bg-elevated/40 border border-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4" style={{ color }} />
          <span className="text-sm font-medium text-primary">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-bold text-primary">{value}</span>
          <span className="text-[10px] text-tertiary">/100</span>
        </div>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-app overflow-hidden">
        <div
          className="h-full rounded-full animate-fill-bar"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[10px] text-tertiary mt-1.5 block">{weight}% weight in coverage score</span>
    </div>
  );
}

/* =====================================================
   DIALOGUE DOCTOR CARD
   ===================================================== */

function DialogueCard({ issue, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="stagger-child bg-elevated/40 border border-border rounded-lg overflow-hidden" style={{ animationDelay: `${600 + index * 100}ms` }}>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-[10px] font-mono text-tertiary uppercase tracking-wide">
          <Users className="w-3 h-3 text-accent" />
          {issue.character || 'Character'}
          <span className="text-tertiary/50">•</span>
          {issue.location || 'Script'}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-app rounded-lg p-3 border border-border">
            <span className="text-[9px] text-critical font-mono uppercase tracking-wide block mb-1.5">Original</span>
            <p className="text-[13px] text-secondary font-script leading-relaxed italic">"{issue.original_dialogue}"</p>
          </div>
          <div className="bg-app rounded-lg p-3 border border-accent/20">
            <span className="text-[9px] text-success font-mono uppercase tracking-wide block mb-1.5">Suggested Rewrite</span>
            <p className="text-[13px] text-primary font-script leading-relaxed">"{issue.suggested_rewrite}"</p>
          </div>
        </div>
      </div>
      {issue.diagnosis && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full px-4 py-2 flex items-center gap-2 text-[11px] text-tertiary hover:text-secondary transition-colors border-t border-border bg-surface/30 cursor-pointer"
          >
            <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
            Diagnosis
          </button>
          {expanded && (
            <div className="px-4 pb-4 text-[13px] text-secondary font-script leading-relaxed animate-fade-in">
              {issue.diagnosis}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* =====================================================
   STRUCTURAL DEFECT ACCORDION
   ===================================================== */

function StructuralIssue({ issue, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="stagger-child bg-elevated/40 border border-border rounded-lg overflow-hidden" style={{ animationDelay: `${700 + index * 80}ms` }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-elevated/60 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-6 h-6 rounded bg-warning/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-3.5 h-3.5 text-warning" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-mono text-tertiary uppercase tracking-wide block">{issue.location}</span>
            <span className="text-sm text-primary block truncate">{issue.issue}</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-tertiary shrink-0 ml-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>
      {expanded && (
        <div className="px-4 pb-4 pt-0 animate-fade-in">
          <div className="bg-app rounded-lg p-4 border border-border">
            <span className="text-[9px] text-accent font-mono uppercase tracking-wide block mb-2">Fix Recommendation</span>
            <p className="text-[13px] text-secondary font-script leading-relaxed">{issue.fix_recommendation}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   FORMAT DOCTOR CARD
   ===================================================== */

function FormatIssue({ issue, index }) {
  return (
    <div className="stagger-child bg-elevated/40 border border-border rounded-lg overflow-hidden p-4" style={{ animationDelay: `${400 + index * 80}ms` }}>
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded bg-warning/10 flex items-center justify-center shrink-0 mt-0.5">
          <AlertTriangle className="w-3.5 h-3.5 text-warning" />
        </div>
        <div className="flex-1 space-y-3">
          <span className="text-sm text-primary block">{issue.issue}</span>
          {issue.fix_recommendation && (
            <div className="bg-app rounded-lg p-3 border border-accent/20">
              <span className="text-[9px] text-accent font-mono uppercase tracking-wide block mb-1.5">Fix Recommendation</span>
              <p className="text-[13px] text-secondary font-script leading-relaxed">{issue.fix_recommendation}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   REPORT VIEW — Full Dashboard
   ===================================================== */

function ReportView({ data }) {
  // Determine score color
  const scoreColor = data.coverage_score >= 80 ? 'text-success' : data.coverage_score >= 60 ? 'text-accent' : data.coverage_score >= 40 ? 'text-warning' : 'text-critical';

  return (
    <div className="h-full overflow-y-auto px-6 py-6 space-y-5">

      {/* Format Warning Banner */}
      {data.metadata?.needs_format_correction && (
        <div className="stagger-child bg-warning/10 border border-warning/30 rounded-xl p-4 flex items-start gap-3" style={{ animationDelay: '0ms' }}>
          <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-warning mb-1">⚠️ Draft Formatting Detected</h3>
            <p className="text-[13px] text-warning/80 font-script leading-relaxed">
              We analyzed your script, but identified non-standard formatting. Check the Format Doctor panel below for immediate improvements to make this studio-ready.
            </p>
          </div>
        </div>
      )}

      {/* Executive Overview */}
      <div className="stagger-child bg-surface rounded-xl p-6 border border-border" style={{ animationDelay: '0ms' }}>
        <div className="flex items-start gap-8 flex-wrap">
          {/* Score Ring */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <RadialScore score={data.coverage_score} />
            <span className="text-[10px] font-mono text-tertiary uppercase tracking-wide">Coverage Score</span>
          </div>
          {/* Title & Meta */}
          <div className="flex-1 min-w-0 space-y-3">
            <p className="text-[11px] font-medium text-tertiary uppercase tracking-[0.15em]">
              Script Coverage &amp; Narrative Analysis
            </p>
            <h1 className="text-2xl font-semibold text-primary tracking-tight">{data.title}</h1>
            <p className="text-sm text-secondary font-script leading-relaxed max-w-2xl">
              &ldquo;{data.logline}&rdquo;
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {data.metadata?.format_verified && (
                <span className="px-2.5 py-1 rounded text-[10px] font-medium text-accent border border-accent/20 bg-accent/5">
                  {data.metadata.format_verified}
                </span>
              )}
              {data.budget_tier && (
                <span className="px-2.5 py-1 rounded text-[10px] font-medium text-warning border border-warning/20 bg-warning/5">
                  Budget: {data.budget_tier}
                </span>
              )}
              {data.metadata?.total_scenes_detected > 0 && (
                <span className="px-2.5 py-1 rounded text-[10px] font-medium text-tertiary border border-border bg-elevated/50">
                  {data.metadata.total_scenes_detected} Scenes
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="stagger-child" style={{ animationDelay: '80ms' }}>
        <h2 className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.15em] mb-3">Weighted Analysis Metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <WeightedMetric label="Structure" value={data.metrics?.structure ?? 0} weight={35} icon={BarChart3} color="var(--color-accent)" />
          <WeightedMetric label="Character" value={data.metrics?.character ?? 0} weight={25} icon={Users} color="#B99CFF" />
          <WeightedMetric label="Dialogue" value={data.metrics?.dialogue ?? 0} weight={25} icon={MessageSquare} color="var(--color-success)" />
          <WeightedMetric label="Commercial" value={data.metrics?.commercial ?? 0} weight={15} icon={DollarSign} color="var(--color-warning)" />
        </div>
      </div>

      {/* Executive Pitch */}
      {(data.target_audience || data.marketability_notes) && (
        <div className="stagger-child bg-surface rounded-xl p-6 border border-border" style={{ animationDelay: '160ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-accent" />
            <h2 className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.15em]">Market & Audience</h2>
          </div>
          {data.target_audience && (
            <p className="text-[13px] text-secondary font-script leading-relaxed mb-3">{data.target_audience}</p>
          )}
          {data.marketability_notes && (
            <p className="text-[13px] text-tertiary font-script leading-relaxed italic">{data.marketability_notes}</p>
          )}
        </div>
      )}

      {/* Pacing & Inciting Incident */}
      {(data.pacing_evaluation || data.inciting_incident) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {data.pacing_evaluation && (
            <div className="stagger-child bg-surface rounded-xl p-6 border border-border" style={{ animationDelay: '240ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-warning" />
                <h2 className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.15em]">Pacing Evaluation</h2>
              </div>
              <p className="text-[13px] text-secondary font-script leading-relaxed">{data.pacing_evaluation}</p>
            </div>
          )}
          {data.inciting_incident && (
            <div className="stagger-child bg-surface rounded-xl p-6 border border-border" style={{ animationDelay: '320ms' }}>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4 text-accent" />
                <h2 className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.15em]">Inciting Incident</h2>
              </div>
              <p className="text-[13px] text-secondary font-script leading-relaxed">{data.inciting_incident}</p>
            </div>
          )}
        </div>
      )}

      {/* Dialogue Doctor */}
      {data.actionable_feedback?.character_issues?.length > 0 && (
        <div className="stagger-child" style={{ animationDelay: '400ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-4 h-4 text-[#B99CFF]" />
            <h2 className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.15em]">Dialogue Doctor</h2>
          </div>
          <div className="space-y-3">
            {data.actionable_feedback.character_issues.map((issue, i) => (
              <DialogueCard key={i} issue={issue} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Format Doctor */}
      {data.actionable_feedback?.format_issues?.length > 0 && (
        <div className="stagger-child" style={{ animationDelay: '450ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h2 className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.15em]">Format Doctor</h2>
          </div>
          <div className="space-y-3">
            {data.actionable_feedback.format_issues.map((issue, i) => (
              <FormatIssue key={i} issue={issue} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Structural Defects */}
      {data.actionable_feedback?.structure_issues?.length > 0 && (
        <div className="stagger-child" style={{ animationDelay: '500ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <h2 className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.15em]">Structural Notes</h2>
          </div>
          <div className="space-y-3">
            {data.actionable_feedback.structure_issues.map((issue, i) => (
              <StructuralIssue key={i} issue={issue} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Dialogue Analysis */}
      {data.dialogue_analysis && (
        <div className="stagger-child bg-surface rounded-xl p-6 border border-border" style={{ animationDelay: '580ms' }}>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-success" />
            <h2 className="text-[11px] font-semibold text-tertiary uppercase tracking-[0.15em]">Dialogue Analysis</h2>
          </div>
          <p className="text-[13px] text-secondary font-script leading-relaxed">{data.dialogue_analysis}</p>
        </div>
      )}

      {/* Footer */}
      <div className="text-center py-3">
        <p className="text-[10px] text-tertiary/50">Lunim Studio Coverage System &middot; Intelligent Infrastructure</p>
      </div>
    </div>
  );
}

/* =====================================================
   WORKSPACE — State Machine
   ===================================================== */

function Workspace({ activeTab, setActiveTab, pipelineActive, setPipelineActive, completedTabs, setCompletedTabs, goHomeSignal }) {
  const [stage, setStage] = useState('onboarding'); // 'onboarding' | 'upload' | 'pipeline' | 'report'
  const [reportData, setReportData] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Pipeline state
  const [pipelineIndex, setPipelineIndex] = useState(0);
  const [pipelineProgress, setPipelineProgress] = useState(0);

  // React to Home button signal from sidebar
  const prevSignal = useRef(goHomeSignal);
  useEffect(() => {
    if (goHomeSignal !== prevSignal.current) {
      prevSignal.current = goHomeSignal;
      setStage('onboarding');
      setReportData(null);
      setApiError(null);
    }
  }, [goHomeSignal]);

  const handleInitialize = useCallback(() => {
    setActiveTab('Script');
    setStage('upload');
  }, [setActiveTab]);

  // Real API call + pipeline animation running in parallel
  const handleUpload = useCallback(async (file) => {
    // Start pipeline animation
    setStage('pipeline');
    setPipelineActive(true);
    setPipelineIndex(0);
    setPipelineProgress(0);
    setCompletedTabs([]);
    setActiveTab(PIPELINE_STAGES[0].key);
    setApiError(null);

    // Call real API in background
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/analyze-script', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // Format rejected or other error
        setPipelineActive(false);
        setCompletedTabs([]);
        setActiveTab('Script');
        setStage('upload');
        setApiError(data);
        return;
      }

      // Success — store data; pipeline animation will transition to report when done
      setReportData(data);
    } catch (err) {
      setPipelineActive(false);
      setCompletedTabs([]);
      setActiveTab('Script');
      setStage('upload');
      setApiError({
        error: 'NETWORK_ERROR',
        message: 'Could not connect to the analysis engine.',
        details: err.message,
      });
    }
  }, [setActiveTab, setPipelineActive, setCompletedTabs]);

  // Pipeline auto-progression (visual animation)
  useEffect(() => {
    if (stage !== 'pipeline') return;

    const STAGE_DURATION = 3500; // Slower to give API time
    const TICK_INTERVAL = 40;
    const totalStages = PIPELINE_STAGES.length;

    const ticker = setInterval(() => {
      setPipelineProgress((prev) => {
        const newVal = prev + (100 / (STAGE_DURATION / TICK_INTERVAL) / totalStages);
        return Math.min(newVal, 100);
      });
    }, TICK_INTERVAL);

    const stageTimer = setInterval(() => {
      setPipelineIndex((prev) => {
        const next = prev + 1;
        if (next >= totalStages) {
          clearInterval(stageTimer);
          clearInterval(ticker);
          // Check if API data is ready, otherwise wait
          const checkAndTransition = () => {
            // We'll use a small poll — reportData is set by the API callback
            setTimeout(() => {
              setPipelineActive(false);
              setActiveTab('Deliver');
              setCompletedTabs(PIPELINE_STAGES.map(s => s.key));
              setStage('report');
            }, 500);
          };
          checkAndTransition();
          return prev;
        }
        setCompletedTabs((c) => [...c, PIPELINE_STAGES[prev].key]);
        setActiveTab(PIPELINE_STAGES[next].key);
        return next;
      });
    }, STAGE_DURATION);

    return () => {
      clearInterval(ticker);
      clearInterval(stageTimer);
    };
  }, [stage, setActiveTab, setPipelineActive, setCompletedTabs]);

  const handleReset = useCallback(() => {
    setStage('upload');
    setReportData(null);
    setApiError(null);
    setActiveTab('Script');
    setPipelineActive(false);
    setCompletedTabs([]);
  }, [setActiveTab, setPipelineActive, setCompletedTabs]);

  const handleExport = useCallback(() => {
    if (!reportData) return;
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.title || 'Coverage'}_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [reportData]);

  const currentTitle = reportData?.title || 'Script';

  return (
    <main className="flex-1 bg-app overflow-hidden relative">
      {/* Error Modal */}
      <ErrorModal error={apiError} onClose={() => { setApiError(null); }} />

      {/* Top bar — hidden during onboarding */}
      {stage !== 'onboarding' && (
        <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-surface/30">
          <div className="flex items-center gap-2.5">
            <LunimLogo className="text-base mr-1" />
            <span className="text-sm font-medium text-secondary">Studio</span>
            <span className="text-[10px] text-tertiary mx-0.5">/</span>
            <span className="text-sm text-tertiary">Script Analysis Engine</span>
            {stage === 'report' && (
              <>
                <span className="text-[10px] text-tertiary mx-0.5">/</span>
                <span className="text-sm text-secondary">{currentTitle}</span>
              </>
            )}
            {stage === 'pipeline' && (
              <>
                <span className="text-[10px] text-tertiary mx-0.5">/</span>
                <span className="text-sm text-accent">Analyzing...</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-app text-xs text-tertiary border border-border rounded px-2 py-0.5">
              Workspace: Production IP
            </div>
            {stage === 'report' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 text-[11px] text-accent hover:text-accent border border-accent/20 hover:border-accent/40 bg-accent/5 transition-colors px-3 py-1.5 rounded-md cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export JSON
                </button>
                <button
                  onClick={handleReset}
                  className="text-[11px] text-tertiary hover:text-secondary transition-colors px-3 py-1.5 rounded-md hover:bg-elevated cursor-pointer"
                >
                  New Analysis
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className={stage === 'onboarding' ? 'h-full' : 'h-[calc(100%-44px)]'}>
        {stage === 'onboarding' && <OnboardingView onInitialize={handleInitialize} />}
        {stage === 'upload' && (
          <UploadZone onUpload={handleUpload} />
        )}
        {stage === 'pipeline' && (
          <PipelineView
            stageIndex={pipelineIndex}
            stageLabel={PIPELINE_STAGES[pipelineIndex]?.label || ''}
            skeletonType={PIPELINE_STAGES[pipelineIndex]?.skeletonType || 'script'}
            progress={pipelineProgress}
          />
        )}
        {stage === 'report' && reportData && <ReportView data={reportData} />}
      </div>
    </main>
  );
}

/* =====================================================
   APP — Root
   ===================================================== */

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const [pipelineActive, setPipelineActive] = useState(false);
  const [completedTabs, setCompletedTabs] = useState([]);
  const [goHomeSignal, setGoHomeSignal] = useState(0);

  const handleHome = useCallback(() => {
    setGoHomeSignal((s) => s + 1);
    setActiveTab('Home');
    setPipelineActive(false);
    setCompletedTabs([]);
  }, []);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-app font-ui">
      <Sidebar
        activeTab={activeTab}
        pipelineActive={pipelineActive}
        completedTabs={completedTabs}
        onHome={handleHome}
      />
      <Workspace
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pipelineActive={pipelineActive}
        setPipelineActive={setPipelineActive}
        completedTabs={completedTabs}
        setCompletedTabs={setCompletedTabs}
        goHomeSignal={goHomeSignal}
      />
      {/* Footer Brand Signature */}
      <div className="absolute bottom-4 right-6 pointer-events-none z-50">
        <span className="text-[10px] text-tertiary tracking-tight font-medium">
          Powered by Lunim Intelligent Infrastructure
        </span>
      </div>
    </div>
  );
}

