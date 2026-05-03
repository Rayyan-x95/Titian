export const MARKETING_COPY = {
  brandName: 'Titan',
  tagline: 'The Professional Personal Life Operating System',
  description:
    'Titan is a premium, unified workspace for your tasks, finances, and thoughts. Experience absolute clarity with our offline-first Personal Life Operating System.',
  keywords:
    'personal life operating system, life os, ai task manager, expense tracker, note taking app, productivity system, offline-first pwa, unified workspace, split expenses app',

  hero: {
    headline: 'Titan is a Personal Life Operating System',
    subheadline:
      'Unify your tasks, expenses, and notes into one connected system. Build for clarity, speed, and privacy.',
    ctaPrimary: 'Try Titan for Free',
    ctaSecondary: 'Explore Features',
  },

  problem: {
    headline: 'Why productivity apps are failing you.',
    description:
      'Most of us use 5 different apps to manage our daily lives. A task manager, a budget tracker, a notes app, a calendar, and a bill-splitting tool. The results are always the same:',
    points: [
      "Data Fragmentation: Your money doesn't know what your time is doing.",
      'Context Switching: You lose focus jumping between interfaces.',
      "No Big Picture: You can't see the relationship between your habits and your bank account.",
    ],
  },

  solution: {
    headline: 'One system. Zero friction.',
    description:
      'Titan brings everything together. By connecting your tasks to your finances and your notes to your timeline, we eliminate the mental overhead of fragmented organization.',
    points: [
      'Unified Architecture: Every data point is connected.',
      'Timeline Insights: See your entire life flow in one chronology.',
      'Offline-First Privacy: Your data stays on your device, always fast, always private.',
    ],
  },

  outcomes: [
    {
      title: 'Understand how your actions shape your day',
      desc: "Our AI Task Manager doesn't just list to-dos; it categorizes and prioritizes them based on your life goals.",
      icon: 'Zap',
      link: '/ai-task-manager',
    },
    {
      title: 'See where your money goes and why',
      desc: 'Precision expense tracking that links directly to your activities. No more guessing what that charge was for.',
      icon: 'Wallet',
      link: '/expense-tracker',
    },
    {
      title: 'Capture ideas in context',
      desc: 'Notion-style notes that connect to your tasks and transactions. Your digital brain, finally organized.',
      icon: 'Sparkles',
      link: '/notes',
    },
    {
      title: 'Visualize your entire life flow',
      desc: 'The Life Timeline provides a high-fidelity snapshot of your productivity and spending patterns.',
      icon: 'Clock',
      link: '/life-timeline',
    },
  ],

  useCases: [
    {
      name: 'Students',
      desc: 'Track assignments, study notes, and campus spending in one mobile-first app.',
    },
    {
      name: 'Freelancers',
      desc: 'Manage client tasks, business expenses, and project notes without the overhead.',
    },
    {
      name: 'Finance Focused',
      desc: 'Maintain strict budgets and clear financial history with cents-precision tracking.',
    },
    {
      name: 'Productivity Experts',
      desc: 'Implement GTD and Life OS methodologies with a tool that actually supports them.',
    },
  ],

  faqs: [
    {
      question: 'What is Titan?',
      answer:
        'Titan is a Personal Life Operating System—a unified digital workspace that connects your tasks, expenses, notes, and shared finances into one cohesive interface designed for clarity and speed.',
    },
    {
      question: 'How is Titan different from Notion?',
      answer:
        'Unlike Notion, which is a generic document tool, Titan is purpose-built for life management. It includes specialized engines for precision financial tracking and AI-powered task recurrence that Notion lacks, all while being offline-first.',
    },
    {
      question: 'Can Titan manage tasks and expenses together?',
      answer:
        'Yes. Titan is designed specifically to connect these two worlds. You can link any expense directly to a task or note, allowing you to see exactly how much your projects or habits are costing you.',
    },
    {
      question: 'Is Titan free?',
      answer:
        'Yes, Titan is free to use for individuals. It is a Progressive Web App (PWA) that runs entirely on your device, meaning there are no server costs we pass on to you.',
    },
    {
      question: 'Who is Titan for?',
      answer:
        'Titan is for anyone who feels overwhelmed by using multiple disconnected apps. It is especially popular with students, freelancers, and individuals who want a professional, private way to manage their time and money.',
    },
    {
      question: 'Is my data safe?',
      answer:
        'Absolutely. Titan uses an offline-first architecture. All your tasks, notes, and financial data are stored locally on your device using IndexedDB. We never see your data, and it never leaves your control.',
    },
  ],
};
