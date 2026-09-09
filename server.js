import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

app.use(cors());
app.use(express.json());

// Serve static React files in production
app.use(express.static(path.join(__dirname, 'dist')));

// ── Groq Configuration ──
// We are using Environment Variables here so GitHub doesn't block the upload!
const GROQ_KEYS = {
  main: process.env.GROQ_API_KEY_MAIN,
  structure: process.env.GROQ_API_KEY_STRUCTURE,
  character: process.env.GROQ_API_KEY_CHARACTER
};
const GROQ_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const MAX_SLICE = 12000;

// ── Exponential Backoff Wrapper ──
async function groqChat(model, systemPrompt, userContent, temperature = 0.2, maxRetries = 3, apiKey = GROQ_KEYS.main) {
  let delay = 3000;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(GROQ_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          temperature,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent },
          ],
        }),
      });

      if (res.status === 429) {
        if (attempt === maxRetries) throw new Error('Rate limit exceeded after max retries');
        console.warn(`Rate limited on ${model}, retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        delay *= 2;
        continue;
      }

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`Groq API error (${res.status}): ${errBody}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || '';
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.warn(`Attempt ${attempt + 1} failed for ${model}: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 2;
    }
  }
}

// ── JSON Parsing Helper ──
function parseAgentJSON(raw) {
  if (!raw) return null;
  try {
    // Strip markdown code fences if present
    let cleaned = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    return JSON.parse(cleaned);
  } catch {
    console.error('Failed to parse agent JSON:', String(raw).slice(0, 200));
    return null;
  }
}

// ── Scene Splitter ──
function countScenes(text) {
  const primaryPattern = /(?:\n|^)(?=(?:INT\.|EXT\.|INT\/EXT\.|EXT\/INT\.)\s+[A-Z0-9\s\-\.\,\']+)/g;
  let matches = text.match(primaryPattern);
  
  if (!matches || matches.length === 0) {
    // Soft Fallback Regex: detect scenes by capitalized block headers or double line breaks
    const fallbackPattern = /\n{2,}(?=[A-Z0-9\s\-\.]{3,}\n)/g;
    matches = text.match(fallbackPattern);
  }
  
  return matches ? matches.length : 0;
}

// ── Agent Prompts ──
const STRUCTURE_SYSTEM = `You are an elite studio coverage executive evaluating narrative architecture. Analyze the script text for 3-act structure, pacing momentum, plot beat placement, inciting incident timing, and midpoint escalation.

Return ONLY a raw JSON object matching this schema:
{
  "agent_type": "structure",
  "structure_score": number (0-100),
  "pacing_evaluation": "Detailed breakdown of script pacing and momentum...",
  "inciting_incident": "Analysis of inciting incident timing and effectiveness...",
  "structure_issues": [
    {
      "location": "Scene/Page reference",
      "issue": "Description of structural flaw",
      "fix_recommendation": "Actionable guidance to fix the issue"
    }
  ]
}`;

const CHARACTER_SYSTEM = `You are an expert character supervisor and dialogue doctor. Evaluate character arcs, emotional subtext, voice differentiation, on-the-nose exposition, and dialogue realism.

Return ONLY a raw JSON object matching this schema:
{
  "agent_type": "character",
  "dialogue_score": number (0-100),
  "character_score": number (0-100),
  "dialogue_analysis": "Comprehensive assessment of character voices and subtext...",
  "character_issues": [
    {
      "character": "CHARACTER NAME",
      "location": "Scene/Line reference",
      "original_dialogue": "Original dialogue snippet",
      "diagnosis": "Why this dialogue feels weak or on-the-nose",
      "suggested_rewrite": "Cinematic, subtext-rich rewritten line"
    }
  ]
}`;

const COMMERCIAL_SYSTEM = `You are a film producer and box-office strategist. Assess high-concept logline synthesis, marketability, target demographic appeal, comparable titles (comps), and budget tiering (Low: <$5M, Medium: $5M-$25M, High: $25M-$80M, Blockbuster: $80M+).

Return ONLY a raw JSON object matching this schema:
{
  "agent_type": "commercial",
  "commercial_score": number (0-100),
  "logline": "Single compelling pitch sentence",
  "budget_tier": "Low" | "Medium" | "High" | "Blockbuster",
  "target_audience": "Demographic profiling and comparable titles",
  "marketability_notes": "Strategic market position and commercial notes"
}`;

const GUARDRAIL_SYSTEM = `You are an adaptive screenplay format validator and triage officer.

**ACCEPTANCE CRITERIA:**
Set \`is_script: true\` if the document exhibits ANY intent to tell a scene-based story through character dialogue or visual actions—even if formatting is non-standard, sloppy, or improperly aligned (e.g., missing formal INT./EXT. sluglines, unindented dialogue, rough table reads, or informal script drafts).

**REJECTION CRITERIA:**
Set \`is_script: false\` ONLY if the document is strictly and unambiguously NOT a screenplay (e.g., academic essays, legal contracts, business pitch decks, prose novels, resume/CVs, source code, shopping lists, or technical manuals).

**OUTPUT FORMAT:**
Return ONLY a raw JSON object matching this schema (no markdown code blocks):
{
  "is_script": boolean,
  "detected_format": "Standard Screenplay" | "Rough Script Draft" | "Sloppy/Unformatted Script" | "Non-Script Document",
  "needs_format_correction": boolean,
  "formatting_flaws": [
    "List specific formatting issues detected, such as missing INT./EXT. headers, unindented dialogue, or missing scene breaks."
  ],
  "rejection_reason": string | null
}`;

// ══════════════════════════════════════════════
//  POST /api/analyze-script
// ══════════════════════════════════════════════
app.post('/api/analyze-script', upload.single('file'), async (req, res) => {
  console.log('\n══════════════════════════════════════');
  console.log('  PIPELINE START');
  console.log('══════════════════════════════════════');

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'NO_FILE', message: 'No file uploaded.' });
    }

    const fileName = req.file.originalname || 'Untitled';
    const title = fileName.replace(/\.(pdf|txt|fdx|fountain)$/i, '').replace(/[_-]/g, ' ');
    console.log(`[Stage 0] File received: ${fileName} (${(req.file.size / 1024).toFixed(1)} KB)`);

    // ── Stage 1: Text Extraction ──
    console.log('[Stage 1] Extracting text...');
    let fullText = '';
    if (req.file.mimetype === 'application/pdf') {
      const pdfData = await pdfParse(req.file.buffer);
      fullText = pdfData.text;
    } else {
      fullText = req.file.buffer.toString('utf-8');
    }
    fullText = fullText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
    const slicedText = fullText.slice(0, MAX_SLICE);
    console.log(`[Stage 1] Extracted ${fullText.length} chars, sliced to ${slicedText.length}`);

    // ── Stage 2: Guardrail Validation ──
    console.log('[Stage 2] Format validation...');
    const guardrailRaw = await groqChat(
      'groq/compound-mini',
      GUARDRAIL_SYSTEM,
      slicedText,
      0.1
    );
    const guardrail = parseAgentJSON(guardrailRaw);

    if (!guardrail || guardrail.is_script === false) {
      console.log('[Stage 2] ✗ FORMAT REJECTED');
      return res.status(400).json({
        error: 'FORMAT_REJECTED',
        message: 'This document does not follow standard screenplay formatting.',
        details: guardrail?.rejection_reason || 'Unable to detect standard screenplay structure.',
      });
    }

    const detectedFormat = guardrail.detected_format || 'Feature Screenplay';
    console.log(`[Stage 2] ✓ Format verified: ${detectedFormat}`);

    // ── Stage 3: Scene Splitting ──
    console.log('[Stage 3] Counting scenes...');
    const totalScenes = countScenes(fullText);
    console.log(`[Stage 3] Detected ${totalScenes} scenes`);

    // ── Stage 4: Parallel Agent Execution (Multi-Key) ──
    console.log('[Stage 4] Launching parallel agents with dedicated API keys...');
    
    const [structureRaw, characterRaw, commercialRaw] = await Promise.all([
      groqChat('openai/gpt-oss-120b', STRUCTURE_SYSTEM, slicedText, 0.2, 3, GROQ_KEYS.structure)
        .then(r => { console.log('  [Agent] Structure ✓'); return r; })
        .catch(err => { console.error('  [Agent] Structure ✗', err.message); return null; }),
        
      groqChat('qwen/qwen3.8-27b', CHARACTER_SYSTEM, slicedText, 0.3, 3, GROQ_KEYS.character)
        .then(r => { console.log('  [Agent] Character ✓'); return r; })
        .catch(err => { console.error('  [Agent] Character ✗', err.message); return null; }),
        
      groqChat('groq/compound', COMMERCIAL_SYSTEM, slicedText, 0.2, 3, GROQ_KEYS.main)
        .then(r => { console.log('  [Agent] Commercial ✓'); return r; })
        .catch(err => { console.error('  [Agent] Commercial ✗', err.message); return null; }),
    ]);

    const structure = parseAgentJSON(structureRaw) || {};
    const character = parseAgentJSON(characterRaw) || {};
    const commercial = parseAgentJSON(commercialRaw) || {};

    // ── Stage 5: Score Aggregation ──
    console.log('[Stage 5] Aggregating scores...');
    const structureScore = structure.structure_score ?? 70;
    const characterScore = character.character_score ?? 70;
    const dialogueScore = character.dialogue_score ?? 70;
    const commercialScore = commercial.commercial_score ?? 70;

    const coverageScore = Math.round(
      (0.35 * structureScore) +
      (0.25 * characterScore) +
      (0.25 * dialogueScore) +
      (0.15 * commercialScore)
    );

    const payload = {
      status: 'COMPLETE',
      title,
      coverage_score: coverageScore,
      metadata: {
        total_scenes_detected: totalScenes,
        format_verified: detectedFormat,
        needs_format_correction: guardrail.needs_format_correction || false,
      },
      logline: commercial.logline || 'Analysis complete — logline synthesis unavailable.',
      budget_tier: commercial.budget_tier || 'Medium',
      target_audience: commercial.target_audience || 'General audience.',
      marketability_notes: commercial.marketability_notes || '',
      metrics: {
        structure: structureScore,
        character: characterScore,
        dialogue: dialogueScore,
        commercial: commercialScore,
      },
      pacing_evaluation: structure.pacing_evaluation || '',
      inciting_incident: structure.inciting_incident || '',
      dialogue_analysis: character.dialogue_analysis || '',
      actionable_feedback: {
        format_issues: guardrail.formatting_flaws?.map(flaw => ({ issue: flaw })) || [],
        structure_issues: structure.structure_issues || [],
        character_issues: character.character_issues || [],
      },
    };

    if (guardrail.needs_format_correction) {
      payload.format_improvement_notice = {
        alert: "FORMATTING IMPROVEMENT RECOMMENDED",
        summary: "This document was processed as a screenplay draft, but its formatting deviates from studio standards. Standardizing scene headings and indentation will significantly improve industry readability.",
        detected_flaws: guardrail.formatting_flaws || [],
      };
    }

    console.log(`\n══════════════════════════════════════`);
    console.log(`  PIPELINE COMPLETE — Score: ${coverageScore}/100`);
    console.log(`══════════════════════════════════════\n`);

    return res.json(payload);

  } catch (err) {
    console.error('Pipeline error:', err);
    return res.status(500).json({
      error: 'PIPELINE_ERROR',
      message: 'An error occurred during script analysis.',
      details: err.message,
    });
  }
});

// ── Frontend Catch-All ──
// Any request that isn't /api/... gets the React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n  Lunim Script Analysis Engine`);
  console.log(`  ➜  Server listening on port ${PORT}`);
  console.log(`  ➜  Frontend served from /dist`);
  console.log(`  ➜  API Endpoint: POST /api/analyze-script\n`);
});
