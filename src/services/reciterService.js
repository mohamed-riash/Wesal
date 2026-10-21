// Service to handle reciter data and audio URLs

export const RECITERS_LIST = [
  {
    id: 'maher',
    name: 'الشيخ ماهر المعيقلي',
    rewaya: 'حفص عن عاصم',
    server: 'https://server12.mp3quran.net/maher',
    image: '/الشيخ-ماهر-المعيقلي.jpg',
    featured: true,
  },
  {
    id: 'abdulbasit',
    name: 'الشيخ عبد الباسط عبد الصمد',
    rewaya: 'المصحف المرتل',
    server: 'https://server7.mp3quran.net/basit',
    image: '/عبد الباسط.jpg',
    featured: true,
  },
  {
    id: 'husary',
    name: 'الشيخ محمود خليل الحصري',
    rewaya: 'المصحف المرتل',
    server: 'https://server13.mp3quran.net/husr',
    image: '/الحصري.jpg',
    featured: true,
  },
  {
    id: 'sudais',
    name: 'الشيخ عبد الرحمن السديس',
    rewaya: 'حفص عن عاصم',
    server: 'https://server11.mp3quran.net/sds',
    image: '/السديس.jpg',
    featured: true,
  },
  {
    id: 'dosari',
    name: 'الشيخ ياسر الدوسري',
    rewaya: 'حفص عن عاصم',
    server: 'https://server11.mp3quran.net/yasser',
    image: '/الدوسري.jpg',
    featured: true,
  },
  {
    id: 'ajmi',
    name: 'الشيخ أحمد بن علي العجمي',
    rewaya: 'حفص عن عاصم',
    server: 'https://server10.mp3quran.net/ajm',
    image: '/العجمي.jpg',
    featured: false,
  },
  {
    id: 'qatami',
    name: 'الشيخ ناصر القطامي',
    rewaya: 'حفص عن عاصم',
    server: 'https://server6.mp3quran.net/qtm',
    image: '/القطامي.jpg',
    featured: false,
  },
  {
    id: 'ghamdi',
    name: 'الشيخ سعد الغامدي',
    rewaya: 'حفص عن عاصم',
    server: 'https://server7.mp3quran.net/s_gmd',
    image: '/الغامدي.jpeg',
    featured: false,
  }
];

export function getSurahAudioUrl(serverUrl, surahNumber) {
  const formattedNum = String(surahNumber).padStart(3, '0');
  return `${serverUrl}/${formattedNum}.mp3`;
}
