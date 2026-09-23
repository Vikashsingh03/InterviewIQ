import { test } from "node:test";
import assert from "node:assert/strict";
import {
  INTERVIEW_LANGUAGES,
  sanitizeInterviewLanguage,
  sanitizeSttLanguage,
  buildLanguageInstruction,
  spokenStyleFor,
  firstQuestionFor,
  neutralAcksFor,
  neutralAckFor,
  isJudgementalAck,
  fixedLineFor,
} from "./language.js";

test("sanitizeInterviewLanguage keeps the three valid values", () => {
  assert.equal(sanitizeInterviewLanguage("english"), "english");
  assert.equal(sanitizeInterviewLanguage("hinglish"), "hinglish");
  assert.equal(sanitizeInterviewLanguage("hindi"), "hindi");
});

test("sanitizeInterviewLanguage defaults to english on bad input", () => {
  assert.equal(sanitizeInterviewLanguage(undefined), "english");
  assert.equal(sanitizeInterviewLanguage(null), "english");
  assert.equal(sanitizeInterviewLanguage(""), "english");
  assert.equal(sanitizeInterviewLanguage("french"), "english");
  assert.equal(sanitizeInterviewLanguage("ENGLISH"), "english");
});

test("INTERVIEW_LANGUAGES lists exactly english, hinglish, hindi", () => {
  assert.deepEqual(INTERVIEW_LANGUAGES, ["english", "hinglish", "hindi"]);
});

test("buildLanguageInstruction is empty for english", () => {
  assert.equal(buildLanguageInstruction("english"), "");
  assert.equal(buildLanguageInstruction(undefined), "");
  assert.equal(buildLanguageInstruction("german"), "");
});

test("buildLanguageInstruction hinglish mentions Roman script, never Devanagari", () => {
  const s = buildLanguageInstruction("hinglish");
  assert.match(s, /Hinglish/);
  assert.match(s, /Roman/);
  assert.match(s, /Never use Devanagari/);
  assert.match(s, /JSON keys/);
});

test("buildLanguageInstruction hindi mentions Devanagari script", () => {
  const s = buildLanguageInstruction("hindi");
  assert.match(s, /Hindi/);
  assert.match(s, /Devanagari/);
  assert.match(s, /JSON keys/);
});

test("spokenStyleFor covers all three languages", () => {
  assert.match(spokenStyleFor("english"), /English/);
  assert.match(spokenStyleFor("hinglish"), /Hinglish/);
  assert.match(spokenStyleFor("hinglish"), /Roman/);
  assert.match(spokenStyleFor("hindi"), /Hindi/);
  assert.match(spokenStyleFor("hindi"), /Devanagari/);
});

test("firstQuestionFor greets by name in each language", () => {
  const en = firstQuestionFor("Ujjwal", "english");
  assert.match(en, /Ujjwal/);
  assert.match(en, /introduce yourself/);
  const hg = firstQuestionFor("Ujjwal", "hinglish");
  assert.match(hg, /Ujjwal/);
  assert.match(hg, /apne baare me batao/);
  assert.doesNotMatch(hg, /[\u0900-\u097F]/);
  const hi = firstQuestionFor("Ujjwal", "hindi");
  assert.match(hi, /Ujjwal/);
  assert.match(hi, /परिचय/);
});

test("firstQuestionFor falls back to english for unknown language", () => {
  assert.match(firstQuestionFor("Ujjwal", "spanish"), /introduce yourself/);
});

test("neutralAcksFor returns a non-empty list per language", () => {
  for (const lang of ["english", "hinglish", "hindi"]) {
    const list = neutralAcksFor(lang);
    assert.ok(Array.isArray(list) && list.length > 0);
  }
  assert.doesNotMatch(neutralAcksFor("hinglish").join(" "), /[\u0900-\u097F]/);
  assert.match(neutralAcksFor("hindi").join(" "), /[\u0900-\u097F]/);
});

test("neutralAckFor picks from the right list and sanitizes input", () => {
  assert.ok(neutralAcksFor("english").includes(neutralAckFor("english")));
  assert.ok(neutralAcksFor("english").includes(neutralAckFor("junk")));
});

test("isJudgementalAck catches english, hindi and hinglish praise", () => {
  assert.equal(isJudgementalAck("Great answer!"), true);
  assert.equal(isJudgementalAck("okay got it"), false);
  assert.equal(isJudgementalAck("बहुत बढ़िया जवाब!"), true);
  assert.equal(isJudgementalAck("ठीक है, समझ गया।"), false);
  assert.equal(isJudgementalAck("shabash, bahut badhiya!"), true);
  assert.equal(isJudgementalAck("okay, samajh gaya."), false);
  assert.equal(isJudgementalAck(null), false);
});

test("sanitizeSttLanguage allowlists en and hi", () => {
  assert.equal(sanitizeSttLanguage("hi", "en"), "hi");
  assert.equal(sanitizeSttLanguage("en", "en"), "en");
  assert.equal(sanitizeSttLanguage("fr", "en"), "en");
  assert.equal(sanitizeSttLanguage(undefined, "en"), "en");
});

test("fixedLineFor returns per-language fixed strings", () => {
  assert.equal(fixedLineFor("skippedFeedback", "english"), "Skipped by the candidate.");
  assert.equal(fixedLineFor("skippedFeedback", "hinglish"), "Candidate ne skip kar diya.");
  assert.match(fixedLineFor("skippedFeedback", "hindi"), /छोड़/);
  assert.match(fixedLineFor("coachOpening", "hindi"), /नमस्ते/);
  assert.equal(fixedLineFor("coachReply", "junk"), fixedLineFor("coachReply", "english"));
  assert.equal(fixedLineFor("nope", "english"), "");
});
