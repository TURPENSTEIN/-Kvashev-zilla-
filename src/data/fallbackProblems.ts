import { ProblemCard, VCITargetWord } from '../types';
import { VCI_VOCABULARY_BANK } from './vciVocabulary';

export const FALLBACK_PROBLEMS: ProblemCard[] = [
  // --- PHYSICAL CONSTRAINTS ---
  {
    id: 'phys-beg-01',
    domain: 'physical',
    difficulty: 'beginner',
    title: 'The Unyielding Hydro-Seal Bottleneck',
    scenario: 'A subterranean geological research vessel must extract a core sample through a pressurized thermal valve. The extreme hydrostatic pressure (300 atm) causes standard mechanical drills to jam and weld to the casing within seconds. Traditional cooling lubricants freeze solid in the cryogenic ambient mud, while heat-based melting vaporizes the drill bit casing.',
    coreConstraint: 'Extract the core sample without using rotating drill bits or thermal melting elements.',
    obviousTraps: [
      'Applying higher torque or heavier diamond-coated drill tips.',
      'Pumping high-pressure steam or hot glycol down the shaft.',
      'Attempting chemical explosive blast fracturing of the valve.'
    ]
  },
  {
    id: 'phys-int-02',
    domain: 'physical',
    difficulty: 'intermediate',
    title: 'The Vacuum-Welded Solar Array Pivot',
    scenario: 'An orbital weather satellite has suffered cold-welding on its primary solar boom joint in total vacuum. Electric actuators are overheating trying to break the metallic cohesion, threatening solar array tearing. Chemical solvents evaporate instantaneously in microgravity vacuum, and impact hammers risk shattering delicate quartz solar cells.',
    coreConstraint: 'Free the cold-welded metal pivot without applying high kinetic impact or liquid solvents in zero-vacuum.',
    obviousTraps: [
      'Using liquid degreasers or WD-40 spray boosters in space vacuum.',
      'Applying high-energy laser heating directly to the joint.',
      'Force-firing thrusters to wrench the array loose.'
    ]
  },
  {
    id: 'phys-adv-03',
    domain: 'physical',
    difficulty: 'advanced',
    title: 'The High-Velocity Quantum Levitation Cavitation',
    scenario: 'A hyper-loop maglev train operating in a low-pressure tube encounters micro-vibrations that disrupt its superconductive magnetic track gap at 900 km/h. Standard physical dampers add unacceptable friction mass and generate destructive electromagnetic drag. Friction brakes cause instant rail vaporization, and active acoustic cancelers overload sensors.',
    coreConstraint: 'Stabilize the 900 km/h superconductive levitation gap without physical friction contact or active acoustic speaker arrays.',
    obviousTraps: [
      'Deploying physical rubber or ceramic brake shoes along the track.',
      'Increasing magnetic coil voltage to brute-force the vehicle down.',
      'Flooding the low-pressure tube with high-density damping foam.'
    ]
  },

  // --- SOCIAL / HIERARCHICAL CONFLICTS ---
  {
    id: 'soc-beg-01',
    domain: 'social',
    difficulty: 'beginner',
    title: 'The Fractured High-Table Consensus',
    scenario: 'A multi-national scientific commission is paralyzed over allocating emergency research funds for an impending ecological threat. Two rival factions hold equal veto power; Faction A refuses any protocol initiated by Faction B, while Faction B blocks all budgets that mention Faction A\'s methodology. Public panic is rising, and third-party arbitration has been rejected by both chairs.',
    coreConstraint: 'Pass the emergency funding allocation without either faction officially submitting, vetoing, or surrendering their protocol.',
    obviousTraps: [
      'Forcing a majority vote by secret ballot or public shaming.',
      'Replacing the chairs with an external neutral arbitrator.',
      'Splitting the fund 50/50, which renders both research protocols underfunded.'
    ]
  },
  {
    id: 'soc-int-02',
    domain: 'social',
    difficulty: 'intermediate',
    title: 'The Silent Whistleblower Asymmetry',
    scenario: 'An executive auditing team knows corruption is occurring inside a high-security defense contractor, but the corrupt director monitors all corporate communications, metadata, and physical badge access. Any employee seen speaking with auditors is immediately terminated under security non-disclosure agreements. Direct digital leaks trigger automated firewalls.',
    coreConstraint: 'Extract verifiable corruption evidence without any direct interpersonal contact, digital file transfer, or physical badge anomalies.',
    obviousTraps: [
      'Sending encrypted emails or drop-box links from personal phones.',
      'Arranging a secret meeting outside corporate premises.',
      'Filing an anonymous internal tip through the company hotline.'
    ]
  },
  {
    id: 'soc-adv-03',
    domain: 'social',
    difficulty: 'advanced',
    title: 'The Multi-Tiered Sovereign Treaty Gridlock',
    scenario: 'Three neighboring landlocked nations share a vital cross-border river basin under an obsolete 100-year treaty. Nation X controls the upstream headwaters and demands energy tariffs; Nation Y controls the agricultural midstream and demands free irrigation; Nation Z controls the downstream port delta and threatens naval blockades. Military escalation is imminent, and monetary payments are constitutionally forbidden by all three parliaments.',
    coreConstraint: 'Establish equitable water distribution and transit without monetary transactions, land transfers, or military concessions.',
    obviousTraps: [
      'Buying water rights using international debt forgiveness or fiat currency.',
      'Constructing a massive mega-dam that redirects the river entirely.',
      'Enforcing a UN peacekeeping military presence along riverbanks.'
    ]
  },

  // --- RESOURCE SCARCITY ---
  {
    id: 'res-beg-01',
    domain: 'resource',
    difficulty: 'beginner',
    title: 'The Desert Isotope Sterilization Emergency',
    scenario: 'A mobile disaster medical unit in a remote desert region must sterilize surgical instruments for urgent operations. The main diesel generator has burned out, fuel is exhausted, and the backup solar array was destroyed in a sandstorm. Clean distilled water is limited to 2 liters, and open flame sterilizers are prohibited near oxygen tanks.',
    coreConstraint: 'Achieve medical-grade instrument sterilization using zero electrical power, minimal water (<1L), and no open flames.',
    obviousTraps: [
      'Boiling instruments over a wood or gasoline fire.',
      'Washing tools in unfiltered river water or rubbing alcohol substitutes.',
      'Re-routing vehicle battery power which risks total vehicle stranding.'
    ]
  },
  {
    id: 'res-int-02',
    domain: 'resource',
    difficulty: 'intermediate',
    title: 'The Deep-Sea Mining Nitrogen Siphon',
    scenario: 'An underwater research station at 4,000 meters depth is suffering a atmospheric scrub malfunction, resulting in rapid carbon dioxide accumulation. The primary chemical scrubbers are depleted of lithium hydroxide granules. Standard oxygen candles are exhausted, and surfacing takes 18 hours—far longer than the 3 hours of breathable air remaining.',
    coreConstraint: 'Reduce cabin CO2 levels immediately without lithium hydroxide, oxygen candles, or immediate decompression surfacing.',
    obviousTraps: [
      'Venting cabin air directly into the 400 atm ocean abyss.',
      'Exercising rapidly to burn off excess nitrogen gas.',
      'Attempting high-speed ascent without decompression stages.'
    ]
  },
  {
    id: 'res-adv-03',
    domain: 'resource',
    difficulty: 'advanced',
    title: 'The Closed-Loop Lunar Bio-Dome Phosphoric Collapse',
    scenario: 'A permanent lunar greenhouse station has suffered an agricultural crisis: bio-available phosphorus in the hydroponic fluid has bound to insolubilized calcium precipitates. Replacing the nutrient solution is impossible because supply landers are delayed by 6 months. Acidic washing dissolves the crops, and bio-recycling fungi are dormant due to cold.',
    coreConstraint: 'Re-solubilize the bound phosphorus in the hydroponic loop without killing living crops or importing fresh chemical stocks.',
    obviousTraps: [
      'Dumping industrial sulfuric acid into the plant roots.',
      'Incinerating crops to harvest plant ash for raw phosphorus.',
      'Waiting for delayed Earth supply rockets to deliver fresh nutrient powder.'
    ]
  },

  // --- TECHNICAL / ABSTRACT SYSTEMS ---
  {
    id: 'tech-beg-01',
    domain: 'technical',
    difficulty: 'beginner',
    title: 'The Asynchronous Buffer Deadlock',
    scenario: 'A critical financial high-frequency clearing house system is experiencing a recursive thread deadlock between Process A (locking database rows) and Process B (locking transaction logs). Restarting the servers causes unrecoverable loss of $500M in in-flight trades. Increasing thread stack size accelerates the memory leak, and manual process kill drops client sockets.',
    coreConstraint: 'Resolve the thread lock instantly without killing processes, dropping active sockets, or restarting database services.',
    obviousTraps: [
      'Executing `kill -9` on the deadlocked process IDs.',
      'Hard rebooting the server nodes or clearing cache tables.',
      'Manually editing database tables while locks are actively held.'
    ]
  },
  {
    id: 'tech-int-02',
    domain: 'technical',
    difficulty: 'intermediate',
    title: 'The Optical Fiber Signal Dispersion Wall',
    scenario: 'A trans-oceanic quantum key distribution (QKD) fiber cable is suffering severe photon chromatic dispersion over a 2,000 km run, degrading key fidelity below security thresholds. Conventional electronic repeaters destroy the quantum entanglement state upon measurement. Fiber optical amplifiers increase phase noise beyond acceptable margins.',
    coreConstraint: 'Restore quantum key fidelity over 2,000 km without electronic optical measurement repeaters or noisy amplifiers.',
    obviousTraps: [
      'Installing standard opto-electronic conversions at mid-sea hubs.',
      'Turning up laser pulse power to brute-force through fiber attenuation.',
      'Splicing standard Erbium-doped fiber amplifiers directly onto the QKD strand.'
    ]
  },
  {
    id: 'tech-adv-03',
    domain: 'technical',
    difficulty: 'advanced',
    title: 'The Autonomous Grid Cascade Corruption',
    scenario: 'A regional smart electrical grid controlled by decentralized AI micro-nodes has entered an adversarial feedback loop. Micro-node sub-grids are misinterpreting neighboring voltage spikes as cyberattacks, isolating themselves and causing cascading blackout dominoes across 12 cities. High-level override signals are blocked because isolation nodes severed the control plane network.',
    coreConstraint: 'Re-synchronize the isolated autonomous micro-nodes without physical grid shutdowns or central network overrides.',
    obviousTraps: [
      'Sending central administrative SSH commands over disconnected optical lines.',
      'Physically pulling main circuit breakers on whole metropolitan substations.',
      'Flooding grid power lines with high-voltage EMP bursts.'
    ]
  }
];

export function getRandomVCIWords(count: number = 3): VCITargetWord[] {
  const shuffled = [...VCI_VOCABULARY_BANK].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
