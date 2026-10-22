export interface SampleImage {
  id: string;
  title: string;
  category: string;
  url: string;
  thumbnail: string;
  description: string;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'bengal-rickshaw',
    title: 'রঙিন রিকশা (Dhaka Rickshaw)',
    category: 'যানবাহন ও লোকশিল্প',
    url: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1000&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=300&q=70',
    description: 'ঐতিহ্যবাহী অলঙ্কৃত রিকশা ও লোকশিল্পের দৃশ্য',
  },
  {
    id: 'tiger-nature',
    title: 'রয়েল বেঙ্গল টাইগার (Royal Bengal Tiger)',
    category: 'বন্যপ্রাণী',
    url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1000&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=300&q=70',
    description: 'সবুজ প্রকৃতির মাঝে রয়েল বেঙ্গল টাইগার',
  },
  {
    id: 'tea-culture',
    title: 'গরম চা ও স্ন্যাক্স (Traditional Tea)',
    category: 'খাদ্য ও সংস্কৃতি',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=300&q=70',
    description: 'মাটির ভাঁড়ে ধোঁয়া ওঠা গরম চা',
  },
  {
    id: 'workspace-tech',
    title: 'অফিস ওয়ার্কস্পেস ও গ্যাজেট (Workspace & Tech)',
    category: 'প্রযুক্তি ও বস্তু',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=70',
    description: 'ল্যাপটপ, কফি মগ, নোটবুক ও বিভিন্ন প্রযুক্তিপণ্য',
  },
];
