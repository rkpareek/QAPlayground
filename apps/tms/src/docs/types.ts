export interface DocCalloutData {
  type: 'note' | 'tip' | 'warning' | 'important';
  title?: string;
  content: string;
}

export interface DocTableColumn {
  header: string;
  accessor: string;
  width?: string;
}

export interface DocTableData {
  headers: string[];
  rows: string[][];
}

export interface DocCodeSnippet {
  language: 'typescript' | 'javascript' | 'xml' | 'json' | 'yaml' | 'bash';
  code: string;
  caption?: string;
}

export interface DocSection {
  id: string;
  title: string;
  content?: string;
  callout?: DocCalloutData;
  codeSnippet?: DocCodeSnippet;
  table?: DocTableData;
  subsections?: {
    id: string;
    title: string;
    content?: string;
    codeSnippet?: DocCodeSnippet;
    table?: DocTableData;
    callout?: DocCalloutData;
  }[];
}

export interface DocArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  categoryTitle: string;
  order: number;
  keywords: string[];
  lastUpdated: string;
  version?: string;
  overview: string;
  whenToUse?: string;
  howItWorks?: string;
  sections: DocSection[];
  relatedSlugs: string[];
}

export interface DocCategory {
  id: string;
  title: string;
  description: string;
  iconName: string;
  order: number;
  articles: DocArticle[];
}

export interface DocSearchResult {
  slug: string;
  title: string;
  categoryTitle: string;
  snippet: string;
  matchType: 'title' | 'keyword' | 'heading' | 'content';
}

export interface DocTOCItem {
  id: string;
  title: string;
  level: 2 | 3;
}
