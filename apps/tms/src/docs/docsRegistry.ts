import { DocArticle, DocCategory, DocSearchResult } from './types';
import { gettingStartedArticles } from './content/gettingStartedDocs';
import { platformOverviewArticles } from './content/platformOverviewDocs';
import { testManagementArticles } from './content/testManagementDocs';
import { testPlanningArticles, testExecutionArticles } from './content/testPlanningAndExecutionDocs';
import { automationArticles } from './content/automationDocs';
import { ciCdArticles } from './content/ciCdDocs';
import { analyticsArticles, requirementsDefectsArticles } from './content/analyticsAndDefectsDocs';
import { usersAccessArticles } from './content/usersAccessDocs';
import { administrationArticles, referenceArticles } from './content/adminAndReferenceDocs';

export const allArticles: DocArticle[] = [
  ...gettingStartedArticles,
  ...platformOverviewArticles,
  ...testManagementArticles,
  ...testPlanningArticles,
  ...testExecutionArticles,
  ...automationArticles,
  ...ciCdArticles,
  ...analyticsArticles,
  ...requirementsDefectsArticles,
  ...usersAccessArticles,
  ...administrationArticles,
  ...referenceArticles,
];

export const docCategories: DocCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    description: 'Core concepts, onboarding guides, first test cases, and runs.',
    iconName: 'Rocket',
    order: 1,
    articles: gettingStartedArticles,
  },
  {
    id: 'overview',
    title: 'Platform Overview',
    description: 'Dashboard metrics, global navigation, and search shortcuts.',
    iconName: 'LayoutDashboard',
    order: 2,
    articles: platformOverviewArticles,
  },
  {
    id: 'test-management',
    title: 'Test Management',
    description: 'Test repository, quick add, full editor, suites, custom fields, and labels.',
    iconName: 'FolderGit2',
    order: 3,
    articles: testManagementArticles,
  },
  {
    id: 'test-planning',
    title: 'Test Planning',
    description: 'Test plans, milestones, scope selection, and configuration matrices.',
    iconName: 'CalendarRange',
    order: 4,
    articles: testPlanningArticles,
  },
  {
    id: 'test-execution',
    title: 'Test Execution',
    description: 'Test runs, execution cockpit, verdicts, timers, and run ID triad.',
    iconName: 'PlayCircle',
    order: 5,
    articles: testExecutionArticles,
  },
  {
    id: 'automation',
    title: 'Automation & AST Sync',
    description: 'Playwright, Mocha, hybrid runners, @T and @S identifiers, and sync diffs.',
    iconName: 'Cpu',
    order: 6,
    articles: automationArticles,
  },
  {
    id: 'ci-cd',
    title: 'CI / CD & Ingestion',
    description: 'GitLab CI integration, JUnit XML ingestion, and result deduplication.',
    iconName: 'GitMerge',
    order: 7,
    articles: ciCdArticles,
  },
  {
    id: 'analytics',
    title: 'Reporting & Analytics',
    description: 'Velocity trends, automation coverage, flaky tests, and traceability.',
    iconName: 'BarChart3',
    order: 8,
    articles: analyticsArticles,
  },
  {
    id: 'requirements-defects',
    title: 'Requirements & Defects',
    description: 'User stories coverage, failure contexts, and defect lifecycle.',
    iconName: 'Bug',
    order: 9,
    articles: requirementsDefectsArticles,
  },
  {
    id: 'users-access',
    title: 'Users & Access Control',
    description: 'Team management, built-in and custom roles, grants, and access inspector.',
    iconName: 'ShieldCheck',
    order: 10,
    articles: usersAccessArticles,
  },
  {
    id: 'administration',
    title: 'Administration',
    description: 'Project settings, custom fields engine, label dictionary, and audit logs.',
    iconName: 'Settings',
    order: 11,
    articles: administrationArticles,
  },
  {
    id: 'reference',
    title: 'Reference & Glossary',
    description: 'Status state machines, permission catalog, and QA terminology.',
    iconName: 'BookOpen',
    order: 12,
    articles: referenceArticles,
  },
];

export function getArticleBySlug(slug: string): DocArticle | undefined {
  const normalized = slug.startsWith('/docs/')
    ? slug.replace('/docs/', '')
    : slug.startsWith('docs/')
    ? slug.replace('docs/', '')
    : slug;
  return allArticles.find((a) => a.slug === normalized);
}

export function getCategoryById(categoryId: string): DocCategory | undefined {
  return docCategories.find((c) => c.id === categoryId);
}

export function getPrevNextArticles(currentSlug: string): {
  prev: DocArticle | null;
  next: DocArticle | null;
} {
  const index = allArticles.findIndex((a) => a.slug === currentSlug);
  if (index === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: index > 0 ? allArticles[index - 1] : null,
    next: index < allArticles.length - 1 ? allArticles[index + 1] : null,
  };
}

export function searchDocumentation(query: string): DocSearchResult[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase().trim();
  const results: DocSearchResult[] = [];

  for (const article of allArticles) {
    // 1. Check title
    if (article.title.toLowerCase().includes(q)) {
      results.push({
        slug: article.slug,
        title: article.title,
        categoryTitle: article.categoryTitle,
        snippet: article.description,
        matchType: 'title',
      });
      continue;
    }

    // 2. Check keywords
    const matchedKeyword = article.keywords.find((k) => k.toLowerCase().includes(q));
    if (matchedKeyword) {
      results.push({
        slug: article.slug,
        title: article.title,
        categoryTitle: article.categoryTitle,
        snippet: `Tagged with "${matchedKeyword}": ${article.description}`,
        matchType: 'keyword',
      });
      continue;
    }

    // 3. Check section headings
    const matchedSection = article.sections.find((s) => (s.title || '').toLowerCase().includes(q));
    if (matchedSection) {
      results.push({
        slug: article.slug,
        title: article.title,
        categoryTitle: article.categoryTitle,
        snippet: `Section "${matchedSection.title}": ${(matchedSection.content || '').slice(0, 140)}...`,
        matchType: 'heading',
      });
      continue;
    }

    // 4. Check body content or overview
    if ((article.overview || '').toLowerCase().includes(q)) {
      const idx = article.overview.toLowerCase().indexOf(q);
      const start = Math.max(0, idx - 40);
      const end = Math.min(article.overview.length, idx + 100);
      results.push({
        slug: article.slug,
        title: article.title,
        categoryTitle: article.categoryTitle,
        snippet: `...${article.overview.slice(start, end)}...`,
        matchType: 'content',
      });
      continue;
    }

    for (const section of article.sections) {
      const content = section.content || '';
      if (content.toLowerCase().includes(q)) {
        const idx = content.toLowerCase().indexOf(q);
        const start = Math.max(0, idx - 40);
        const end = Math.min(content.length, idx + 100);
        results.push({
          slug: article.slug,
          title: article.title,
          categoryTitle: article.categoryTitle,
          snippet: `...${content.slice(start, end)}...`,
          matchType: 'content',
        });
        break;
      }
    }
  }

  return results.slice(0, 15);
}
