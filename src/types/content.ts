export interface TipArticle {
  id: string;
  title: string;
  slug: string;
  category: 'Tips CV & ATS' | 'Wawancara Kerja' | 'Negosiasi Gaji' | 'Portofolio' | 'Karir & Fresh Graduate';
  author: string;
  date: string;
  readTime: string;
  summary: string;
  content: string;
  tags: string[];
  isFeatured?: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  sourceUrl: string;
  category: 'BUMN & CPNS' | 'Ketenagakerjaan' | 'Tren Karir & Gaji' | 'Bursa Kerja';
  date: string;
  summary: string;
  imageUrl?: string;
}
