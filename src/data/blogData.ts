export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  comments: number;
  categories: string[];
  image?: string;
  images?: string[];
  type: "standard" | "video" | "gallery";
  content?: string;
  tags: string[];
}

export interface PopularPost {
  id: number;
  title: string;
  date: string;
  image: string;
  comments: number;
}

export interface Category {
  name: string;
  count: number;
}

export interface Tag {
  name: string;
  count: number;
}

// Blog post verileri
export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Lüks Nors Seyahat Çantaları",
    excerpt: "Bu yılın en popüler moda trendlerini keşfedin.",
    date: "Haziran 15, 2023",
    author: "Emma Style",
    comments: 24,
    categories: ["Fashion", "Trends"],
    image:
      "https://static.ticimax.cloud/cdn-cgi/image/width=505,quality=99/61950/uploads/blog/luks-nors-seyahat-cantalari-d354.png",
    type: "standard",
    content: `Lüks Nors Seyahat Çantaları
Lüks Nors Seyahat Çantaları
Lüks seyahat çantaları, seyahat ederken hem stilinizi hem de konforunuzu korumanızı sağlar. Kaliteli malzemelerden üretilen bu çantalar, dayanıklılıklarıyla uzun ömürlü bir kullanım sunar. Seyahatiniz boyunca tüm eşyalarınızı güvenle taşımanıza olanak tanıyan lüks seyahat çantaları, şıklığı ve fonksiyonelliği bir arada sunar. Deri, yüksek kaliteli kumaş ve su geçirmez malzemeler gibi çeşitli materyaller kullanılarak üretilen bu çantalar, her zevke hitap eden tasarımlarıyla dikkat çeker.
Fonksiyonel tasarımlarıyla lüks seyahat çantaları, seyahatinizi daha organize ve keyifli hale getirir. Geniş iç hacimleri, düzenli bölmeleri ve ekstra cepleri sayesinde eşyalarınızı kolayca yerleştirebilir ve ihtiyaç duyduğunuzda hızlıca erişebilirsiniz. Ayrıca, sağlam fermuarları ve dayanıklı yapıları sayesinde uzun yolculuklarda bile eşyalarınızın güvende olduğundan emin olabilirsiniz. Çekçekli modellerden, omuz askılı tasarımlara kadar çeşitli seçeneklerle her tür seyahat ihtiyacına uygun çözümler sunar.

Lüks seyahat çantaları, sadece işlevsellikleri ile değil, aynı zamanda estetik görünümleriyle de öne çıkar. Modern ve zarif tasarımlarıyla seyahat stilinize sofistike bir dokunuş katar. Her detayında kaliteyi ve özeni hissedebileceğiniz bu çantalar, seyahatinizi daha prestijli hale getirir. İster kısa bir hafta sonu kaçamağı, ister uzun bir iş seyahati olsun, lüks seyahat çantaları her durumda mükemmel bir yol arkadaşıdır. Şıklık, konfor ve dayanıklılığı bir arada sunan bu çantalar, seyahatlerinizde vazgeçilmez bir aksesuar olacaktır.`,
    tags: ["Sırt Çantası", "Çanta", "Trends", "Style"],
  },
  {
    id: 2,
    title: "Sırt Çantası Seçerken Nelere Dikkat Edilmelidir?",
    excerpt: "Ekolojik bir cüzdan oluşturmanın pratik ipuçlarını öğrenin.",
    date: "May 28, 2023",
    author: "Olivia Green",
    comments: 18,
    categories: ["Fashion", "Sustainability"],
    image:
      "https://static.ticimax.cloud/cdn-cgi/image/width=525,quality=99/61950/uploads/blog/sirt-cantasi-secerken-nelere-dikkat-edil-c296.png",
    type: "standard",
    content: `Sırt çantaları modern dünyada sadece gençler tarafından değil her yaştan kullanıcı tarafından ihtiyaç duyarak ve beğenerek kullanılan bir ürün. Anaokuluna giden beş yaşındaki bir çocuktan, her yaş grubundaki yetişkinlere kadar kullanılmaktadır.

Peki bu kadar kullanışlı ve popüler bir ürünü seçerken nelere dikkat edilmelidir;

• Kullanılan Malzeme:

Sırt çantasında su geçirmez ve dayanıklı malzemeler kullanıldığından emin olmalıyız. Özellikle sırt çantasında teknolojik aletler taşınıyorsa su geçirmezlik özelliği büyük önem taşımaktadır.

• Sırt Çantasındaki Bölme ve Cep Sayısı:

Sırt çantasında taşıdığımız eşyaların miktarına ve cinsine uygun bölme ve cep bulunmalıdır.

• Sırt Çantasının Boyutları:

Sırt çantasının ebatları, taşıdığınız eşyaların ebatlarıyla ve kullanıcının cüssesiyle uyumlu olmalıdır.

• Estetik:

Sırt çantası kullanıcının kişisel tarzına ve estetik anlayışına uygun renk ve tasarımda olmalıdır.

• Rahatlık:

Sırt çantası ayarlanabilir ve yastıklı omuz askılarına sahip olmalıdır. Sırtı rahatsız etmeyecek yapıda olmalıdır.

• İşlevsellik:

Sırt çantası okula giden bir öğrencinin, sporcunun, gezginin, annenin, kampçının veya gündelik kullanan herkesin ihtiyacına uygun işlevsellikte olmalıdır.

NORS markası olarak;

• Estetik tasarım,

• Büyük ve korumalı plastik fermuar,

• Aerodinamik sap tasarımı,

• Ayarlanabilir omuz askısı,

• Kabartma şeklinde NORS amblemi,

• Su iticilik özelliği,

• Kaliteli malzeme,

• Antik aksesuar gibi özelliklere sahiptir ve aşağıdaki ebatlarda üretilmektedir.

 

NORS Sırt Çantalarının Çeşitleri ve Ebatları
• Mag Mini Sırt Çantası 18x24x10,5 cm – 4,3 Litre

• Gate Laptop Sırt Çantası 30x41x6,5 cm – 7,3 Litre

• Mag Midi Sırt Çantası 22,5x29x9,5 cm – 8 Litre

• Highway Sırt Çantası 30,5x38x9,5 cm – 11,1 Litre

• Snotra Sırt Çantası 27x37x12 cm – 12 Litre

• Brixton Sırt Çantası 31,5x35x9 cm – 12,3 Litre• Norn Sırt Çantası 29x40x11 cm - 12,7 Litre

• Noatun Sırt Çantası 27x42x12 cm – 13 Litre

• Skoolbag Mini Sırt Çantası 21,5x33,5x14 cm - 13,1 Litre

• Mag XL Sırt Çantası 31x42x10,5 cm – 13,6 Litre

• Mag Sırt Çantası 25x37x14,5 cm – 16,6 Litre

• Dorr Sırt Çantası 32x42x15 cm - 20 Litre

• Skoolbag Sırt Çantası 30x40x18,5 cm – 25,2 Litre

 

NORS markası olarak her kullanıcıya uygun tasarım ve ebatta ürettiğimiz kaliteli sırt çantası

ürünlerimize aşağıdaki linke tıklayarak ulaşabilirsiniz.`,
    tags: ["Sırt Çantası", "Sustainable Fashion", "Wardrobe Tips"],
  },
  {
    id: 3,
    title: "Erkeklerin Her Zaman İhtiyaç Duyabileceği Temel Aksesuarlar",
    excerpt:
      "Erkeklerin her zaman ihtiyaç duyabileceği temel aksesuarları keşfedin.",
    date: "May 10, 2023",
    author: "James Sharp",
    comments: 12,
    categories: ["Erkek Modası", "Aksesuarlar"],
    image:
      "https://static.ticimax.cloud/cdn-cgi/image/width=525,quality=99/61950/uploads/blog/canta-hangi-omuza-takilir-a4a7.png",
    type: "gallery",
    content: `Spor çantası, günlük sırt çantaları, seyahat çantası, okul çantası ve bel çantasına kadar tercihiniz hangi tarz olursa olsun, sahip olduğunuz bir çanta size taşıma kolaylığı sağlamalıdır. Bu çantalardan hangisine sahip olursanız olun, her birinin kendine özgü taşıma stilleri bulunur. Spor çantalar genellikle tek omuzda taşınırken, bel çantaları hem bele hem de omuza takılabilirler. Sırt çantaları her iki omuzda taşınıyor olmasına rağmen bazen tek omuzda taşınabilirler. Hangi omzunuzda taşıyacağınıza karar verirken önemli olan, çantanızın ağırlığı ve vücudunuzun hangi tarafıyla daha çok iş yaptığınızdır.

Sağ elini kullanan insanlar, genellikle refleks olarak tek bir el veya omuz kullanmak gerektiğinde sağ taraflarını kullanırken, solak insanlar da aynı şekilde sol taraflarını kullanırlar. Fakat çok ağır olmasa bile bir çantayı uzun süre taşıyorsanız, farkında bile olmadan sık sık omuz değiştirdiğinizi farketmiş olabilirsiniz. Bu, sürekli çanta taşınan omzu rahatlatmak için yaptığımız doğal bir harekettir. Bu nedenle aslında hangi omzunuzda çanta taşıyacağınıza vücudunuz karar verecektir demek yanlış olmaz.

Sırt Çantası Tek Omuzda Taşınabilir Mi?
Sırt çantaları aslında her iki omuzda taşınmak üzere üretilirler. Fakat bazı durumlarda günlük yaşam içerisinde sık sık çantadan eşya almamız gerekiyorsa, sırt çantamızı tek omzumuzda taşımayı tercih ederiz. Bu omuz genellikle sağ omuzdur. Sol elinizle hızlıca çantanızın içinden bir eşya çıkarmak istediğinizde dahi önce sol kolunuzdaki çanta sapını çıkarırsınız. Elbette bu tam tersi şekilde de gerçekleşebilir.

Bel Çantası Omuzda Nasıl Kullanılır?
Bel çantaları, isimlerinden dolayı yalnızca bele takılabilirmiş gibi bir izlenim yaratsa da çevrenize baktığınızda bunun aslında öyle olmadığını kolaylıkla görebilirsiniz. Bel çantaları küçük boyutlarından dolayı elinizde, belinizde veya omzunuzda taşınabilirler. Bir bel çantasını omzunuzda taşımak istiyorsanız sağ veya sol omzunuz üzerinden göğüs altına denk gelecek şekilde çapraz postacı çanta olarak da kullanabilirsiniz.`,
    tags: ["Sırt Çantası", "Aksesuarlar", "Moda İpucu"],
  },
];

// Popüler gönderiler
export const popularPosts: PopularPost[] = [
  {
    id: 1,
    title: "The Latest Fashion Trends for Summer 2023",
    date: "June 15, 2023",
    image: "/assets/site/images/blog/post-1.jpg",
    comments: 24,
  },
  {
    id: 4,
    title: "How to Choose the Perfect Jeans for Your Body Type",
    date: "April 22, 2023",
    image: "/assets/site/images/blog/post-2.jpg",
    comments: 32,
  },
  {
    id: 5,
    title: "The History of Iconic Fashion Houses",
    date: "March 15, 2023",
    image: "/assets/site/images/blog/post-2.jpg",
    comments: 28,
  },
];

// Kategoriler
export const categories: Category[] = [
  { name: "Fashion", count: 15 },
  { name: "Trends", count: 12 },
  { name: "Sustainability", count: 8 },
  { name: "Men's Fashion", count: 6 },
  { name: "Women's Fashion", count: 9 },
  { name: "Accessories", count: 7 },
];

// Etiketler
export const tags: Tag[] = [
  { name: "Fashion", count: 22 },
  { name: "Style", count: 18 },
  { name: "Trends", count: 15 },
  { name: "Sustainable", count: 10 },
  { name: "Summer", count: 8 },
  { name: "Accessories", count: 12 },
  { name: "Eco-friendly", count: 6 },
  { name: "Men's Style", count: 9 },
  { name: "Women's Style", count: 11 },
];
