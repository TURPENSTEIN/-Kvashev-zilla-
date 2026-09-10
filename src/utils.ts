import { VciConstraints } from './types';

export function checkConstraints(solutions: string[], constraints: VciConstraints) {
  let allPopulated = true;
  let allMandatoryWordsUsed = false;
  let noFillerWords = true;
  let conditionalCount = 0;

  const combinedText = solutions.join(' ').toLowerCase();

  // 1. All populated (min 20 chars each)
  if (solutions.some(s => s.trim().length < 20)) {
    allPopulated = false;
  }

  // 2. Mandatory words
  const usedMandatoryWords = constraints.mandatoryWords.filter(word => combinedText.includes(word.toLowerCase()));
  allMandatoryWordsUsed = usedMandatoryWords.length === constraints.mandatoryWords.length;

  // 3. Filler words
  const usedFillerWords = constraints.bannedWords.filter(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(combinedText);
  });
  noFillerWords = usedFillerWords.length === 0;

  // 4. Conditionals
  // At least two solutions must use the "If ... then ... because ..." structure.
  solutions.forEach(s => {
    const text = s.toLowerCase();
    // basic check for transitive conditional logic indicators
    if (text.includes('if ') && text.includes(' then ') && text.includes(' because ')) {
      conditionalCount++;
    }
  });

  return {
    allPopulated,
    allMandatoryWordsUsed,
    usedMandatoryWords,
    noFillerWords,
    usedFillerWords,
    conditionalCount,
    ready: allPopulated && allMandatoryWordsUsed && noFillerWords && conditionalCount >= 2
  };
}
