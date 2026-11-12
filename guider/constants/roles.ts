export type RoleGroup = {
  name: string;
  roles: string[];
};

export type RoleCategory = {
  id: string;
  emoji: string;
  heading: string;
  subtitle?: string;
  groups: RoleGroup[];
  keyStates?: string[];
  active: boolean;
  lockedLabel?: string;
};

export const ACTIVE_VERTICAL_ID = 'facilities-maintenance-services';
export const LOCKED_VERTICAL_LABEL = 'Coming in v2 🔥';

export const ROLE_CATEGORIES: RoleCategory[] = [
  {
    id: 'construction-trades',
    emoji: '🏗',
    heading: '1. Construction & Trades',
    subtitle: 'Residential & Commercial Construction',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Residential & Commercial Construction',
        roles: [
          'Labourer',
          'Carpenter',
          'Formworker',
          'Concreter',
          'Scaffolder',
          'Rigger',
          'Crane operator',
          'Site supervisor',
          'Construction manager'
        ]
      },
      {
        name: 'Electrical',
        roles: ['Electrician', 'Linesperson', 'Electrical apprentice', 'Solar installer']
      },
      {
        name: 'Plumbing',
        roles: ['Plumber', 'Gas fitter', 'Drainage specialist', 'Roof plumber']
      },
      {
        name: 'Mechanical Trades',
        roles: [
          'Diesel mechanic',
          'Fitter & turner',
          'Boilermaker',
          'Metal fabricator',
          'Refrigeration mechanic'
        ]
      },
      {
        name: 'Finishing Trades',
        roles: ['Painter', 'Tiler', 'Plasterer', 'Cabinet maker', 'Glazier']
      }
    ]
  },
  {
    id: 'mining-resources',
    emoji: '⛏',
    heading: '2. Mining & Resources',
    subtitle: 'Huge in Australia',
    keyStates: ['Western Australia', 'Queensland'],
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Drill operator',
          'Excavator operator',
          'Dump truck operator',
          'Shotfirer',
          'Underground miner',
          'FIFO technician',
          'Heavy diesel mechanic',
          'Field service technician',
          'Process plant operator'
        ]
      }
    ]
  },
  {
    id: 'agriculture-farming',
    emoji: '🚜',
    heading: '3. Agriculture & Farming',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Farmhand',
          'Station hand',
          'Livestock worker',
          'Shearer',
          'Crop harvester operator',
          'Irrigation technician',
          'Agricultural mechanic',
          'Horticulture worker'
        ]
      }
    ]
  },
  {
    id: 'hospitality-physical',
    emoji: '🍳',
    heading: '4. Hospitality',
    subtitle: 'Physical Roles',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Chef',
          'Line cook',
          'Kitchen hand',
          'Butcher',
          'Baker',
          'Barista',
          'Bartender',
          'Venue setup crew'
        ]
      }
    ]
  },
  {
    id: 'transport-logistics',
    emoji: '🚚',
    heading: '5. Transport & Logistics',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Truck driver (HC/MC)',
          'Delivery driver',
          'Forklift operator',
          'Warehouse picker/packer',
          'Storeperson',
          'Logistics yard coordinator',
          'Maritime deckhand',
          'Aircraft ground crew'
        ]
      }
    ]
  },
  {
    id: 'manufacturing-industrial',
    emoji: '🏭',
    heading: '6. Manufacturing & Industrial',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Machine operator',
          'CNC operator',
          'Assembly line worker',
          'Production worker',
          'Quality control inspector',
          'Maintenance fitter',
          'Industrial cleaner'
        ]
      }
    ]
  },
  {
    id: 'healthcare-physical',
    emoji: '🏥',
    heading: '7. Healthcare',
    subtitle: 'Physically Demanding Roles',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Aged care worker',
          'Disability support worker',
          'Orderly',
          'Ambulance officer',
          'Hospital porter'
        ]
      }
    ]
  },
  {
    id: 'facilities-maintenance-services',
    emoji: '🧰',
    heading: '8. Facilities, Maintenance & Services',
    active: true,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Property maintenance worker',
          'HVAC technician',
          'Lift technician',
          'Fire systems technician',
          'Pest control technician',
          'Cleaner',
          'Groundskeeper'
        ]
      }
    ]
  },
  {
    id: 'emergency-protective-services',
    emoji: '🚓',
    heading: '9. Emergency & Protective Services',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: ['Firefighter', 'Paramedic', 'Police officer', 'SES volunteer', 'Correctional officer']
      }
    ]
  },
  {
    id: 'marine-outdoor-work',
    emoji: '🏖',
    heading: '10. Marine & Outdoor Work',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Commercial fisherman',
          'Dive technician',
          'Marine mechanic',
          'Lifeguard',
          'Civil landscaping crew'
        ]
      }
    ]
  },
  {
    id: 'energy-utilities',
    emoji: '🛢',
    heading: '11. Energy & Utilities',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Gas pipeline technician',
          'Wind turbine technician',
          'Solar farm technician',
          'Water treatment operator',
          'Sewer technician',
          'Powerline worker'
        ]
      }
    ]
  },
  {
    id: 'waste-environmental-services',
    emoji: '🗑',
    heading: '12. Waste & Environmental Services',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Garbage truck driver',
          'Recycling plant worker',
          'Hazardous waste technician',
          'Environmental field technician'
        ]
      }
    ]
  },
  {
    id: 'events-entertainment-setup',
    emoji: '🎭',
    heading: '13. Events & Entertainment',
    subtitle: 'Physical Setup Roles',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: ['Stage rigger', 'AV technician', 'Lighting technician', 'Event setup crew']
      }
    ]
  },
  {
    id: 'retail-floor-roles',
    emoji: '🛒',
    heading: '14. Retail',
    subtitle: 'Physical Floor Roles',
    active: false,
    lockedLabel: LOCKED_VERTICAL_LABEL,
    groups: [
      {
        name: 'Core Roles',
        roles: [
          'Stock replenisher',
          'Store warehouse handler',
          'Supermarket butcher',
          'Hardware floor staff'
        ]
      }
    ]
  }
];

export const ACTIVE_VERTICAL = ROLE_CATEGORIES.find((category) => category.id === ACTIVE_VERTICAL_ID) ?? ROLE_CATEGORIES[0];

export const ACTIVE_VERTICAL_ROLES = ACTIVE_VERTICAL.groups.flatMap((group) => group.roles);
export const DEFAULT_ACTIVE_ROLE = ACTIVE_VERTICAL_ROLES[0] ?? 'Property maintenance worker';

export const QUICK_CATEGORY_IDS = [ACTIVE_VERTICAL_ID] as const;

export const flattenRoles = () =>
  ROLE_CATEGORIES.flatMap((category) =>
    category.groups.flatMap((group) =>
      group.roles.map((role) => ({
        categoryId: category.id,
        categoryHeading: category.heading,
        role,
        active: category.active
      }))
    )
  );
