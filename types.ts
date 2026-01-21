export interface Review {
  id: number;
  text: string;
  author: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface PricingTier {
  title: string;
  price: string;
  features: string[];
  highlight?: boolean;
  subtext?: string;
}

export interface Subject {
  name: string;
  levels: string[];
}

export enum LessonType {
  OneOnOne = "1-op-1",
  Group = "Groepsbijles",
  Online = "Online",
  Physical = "Fysiek"
}

export interface FormData {
  studentName: string;
  parentName: string;
  email: string;
  phone: string;
  schoolInfo: string;
  subjects: string;
  typePreference: string;
  availability: string;
  comments: string;
}
