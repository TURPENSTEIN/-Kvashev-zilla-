import { Problem, VciConstraints } from './types';

export const DOMAINS = ['Physical Constraints', 'Social/Hierarchical Conflicts', 'Resource Scarcity', 'Technical/Abstract Systems'];
export const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export const FALLBACK_PROBLEMS: Problem[] = [
  {
    id: 'p1',
    domain: 'Physical Constraints',
    difficulty: 'Intermediate',
    scenario: 'A team of researchers is trapped in a sub-basement laboratory after an earthquake. The only exit is blocked by a 4-ton steel blast door. The room is slowly filling with water from a ruptured pipe, and they have exactly 45 minutes before it reaches the ceiling. Available items include liquid nitrogen, standard lab glassware, a high-voltage power supply, and 200 meters of copper wire.',
    coreConstraint: 'The blast door cannot be lifted, pushed, or melted using available tools, and the water flow cannot be stopped at the source.',
    obviousTraps: [
      'Trying to build a bomb to blow up the door (will kill the researchers).',
      'Electrifying the water to somehow destroy the door (will electrocute the researchers).',
      'Freezing the entire room (will freeze the researchers).'
    ]
  },
  {
    id: 'p2',
    domain: 'Social/Hierarchical Conflicts',
    difficulty: 'Advanced',
    scenario: 'You are the newly appointed mediator for two warring factions within a massive corporate conglomerate. Faction A controls all R&D and holds the intellectual property. Faction B controls all manufacturing and distribution. They have completely ceased communication and are actively sabotaging each other. The Board demands a unified product launch in 30 days or the company will be liquidated.',
    coreConstraint: 'You cannot fire any executives, you cannot force them into a room together, and you have zero budget to offer financial incentives.',
    obviousTraps: [
      'Appealing to their sense of corporate duty (they do not care).',
      'Threatening them with the liquidation (they both believe the other will cave first).',
      'Creating a compromise committee (takes too long, will stall).'
    ]
  }
];

export const VCI_WORDS = [
  'vicissitude', 'recalcitrant', 'obfuscate', 
  'ephemeral', 'sycophant', 'ubiquitous', 
  'cacophony', 'enervate', 'fastidious',
  'inexorable', 'pedantic', 'prolific',
  'apocryphal', 'idiosyncratic', 'paradigm',
  'empirical', 'esoteric', 'capricious'
];

export const BANNED_FILLER_WORDS = [
  'thing', 'things', 'stuff', 'basically', 'like', 'literally', 'actually', 'obviously', 'just', 'really', 'very'
];

export function getRandomVciWords(count: number): string[] {
  const shuffled = [...VCI_WORDS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getFallbackProblem(domain: string, difficulty: string): Problem {
  const matched = FALLBACK_PROBLEMS.find(p => p.domain === domain && p.difficulty === difficulty);
  return matched || FALLBACK_PROBLEMS[0];
}
