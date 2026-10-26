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
  studentFirstName: string;
  studentLastName: string;
  parentFirstName: string;
  parentLastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  schoolInfo: string;
  subjects: string;
  locaPreference: string;
  typePreference: string;
  availability: string;
  time: string;
  comments: string;
}
