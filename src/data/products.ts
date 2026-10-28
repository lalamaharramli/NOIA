import type { LocalizedText, Product } from '../types/product'

/**
 * ============================================================
 *  EXAMPLE CATALOGUE — replace with real products
 * ============================================================
 *
 * Everything below is example content, not real NOIA inventory.
 * The UI labels these items as examples while `showExampleNotice`
 * is true in src/config/site.ts.
 *
 * TO ADD A PRODUCT
 * ----------------
 * 1. Copy one object from the array.
 * 2. Give it a unique `slug` (lowercase, hyphens, no spaces).
 * 3. Translate the text into all three languages with `localized(...)`.
 * 4. Put two images in public/images/products/ and reference them
 *    from `images`.
 * 5. Save the file — the shop, product page, sitemap test and
 *    related products update automatically.
 *
 * TO CHANGE A PRICE
 * -----------------
 * Edit `priceAzn`. Use `null` when the price should read
 * "Price on request". This is a number, so write 85, not "85 AZN".
 */

/** Small helper that keeps the three translations together and readable. */
const localized = (az: string, en: string, ru: string): LocalizedText => ({ az, en, ru })

export const products: Product[] = [
  {
    slug: 'square-motif-tote',
    name: localized('Kvadrat motivli çanta', 'Square Motif Tote', 'Сумка из квадратных мотивов'),
    category: 'accessories',
    shortDescription: localized(
      'Gündəlik istifadə üçün geniş, yumşaq əl işi çanta.',
      'A soft, roomy handmade bag for everyday use.',
      'Мягкая вместительная сумка ручной работы на каждый день.',
    ),
    description: localized(
      'Kvadrat motivlərdən yığılan bu çanta gündəlik alış-veriş və kitablar üçün nəzərdə tutulub. Daxili astarı yoxdur, buna görə də yüngül qalır. Rəng kombinasiyası sifariş zamanı seçilir.',
      'Built from square motifs, this tote is meant for everyday errands and books. It is unlined, which keeps it light. The colour combination is chosen when you order.',
      'Эта сумка собрана из квадратных мотивов и рассчитана на повседневные дела и книги. Без подкладки, поэтому остаётся лёгкой. Сочетание цветов выбирается при заказе.',
    ),
    priceAzn: 85,
    availability: 'made-to-order',
    featured: true,
    options: [
      {
        id: 'colour',
        label: localized('Rəng', 'Colour', 'Цвет'),
        values: [
          {
            id: 'cream',
            label: localized('Krem', 'Cream', 'Кремовый'),
            swatch: '#EDE2D1',
          },
          {
            id: 'blush',
            label: localized('Solğun çəhrayı', 'Soft blush', 'Пудрово-розовый'),
            swatch: '#E3C3B6',
          },
          {
            id: 'olive',
            label: localized('Zeytun', 'Olive', 'Оливковый'),
            swatch: '#8E9479',
          },
        ],
      },
    ],
    images: [
      {
        src: '/images/products/square-motif-tote-1.svg',
        alt: localized(
          'Kvadrat motivli toxunma çantanın nümunə təsviri',
          'Illustrative image of a crocheted square motif tote',
          'Иллюстрация вязаной сумки из квадратных мотивов',
        ),
      },
      {
        src: '/images/products/square-motif-tote-2.svg',
        alt: localized(
          'Çantanın toxunma detallarının nümunə təsviri',
          'Illustrative close-up of the bag’s crochet details',
          'Иллюстрация крупным планом: детали вязания сумки',
        ),
      },
    ],
    materials: localized('Pambıq iplik', 'Cotton yarn', 'Хлопковая пряжа'),
    care: localized(
      'Əl ilə, sərin suda yuyun. Yastı formada qurudun.',
      'Hand wash in cool water. Dry flat.',
      'Ручная стирка в прохладной воде. Сушить в расправленном виде.',
    ),
  },

  {
    slug: 'ripple-baby-blanket',
    name: localized('Dalğalı uşaq yorğanı', 'Ripple Baby Blanket', 'Детское одеяло «волны»'),
    category: 'home',
    shortDescription: localized(
      'Yumşaq, yüngül və isti saxlayan toxunma yorğan.',
      'A soft, light blanket that still keeps the warmth in.',
      'Мягкое и лёгкое одеяло, которое при этом сохраняет тепло.',
    ),
    description: localized(
      'Dalğalı naxışlı bu yorğan uşaq arabası və ya çarpayı üçün ölçüləndirilir. İki rəngli zolaqlar sifariş zamanı dəyişdirilə bilər. Kənarları möhkəm bağlanır ki, tez-tez yuyulmaya dözsün.',
      'This ripple-pattern blanket is sized for a pram or cot. The two-tone stripes can be changed when you order. Edges are finished securely so it can handle frequent washing.',
      'Одеяло с узором «волны» подходит для коляски или детской кроватки. Двухцветные полосы можно изменить при заказе. Края обработаны прочно, чтобы выдерживать частую стирку.',
    ),
    priceAzn: 150,
    availability: 'made-to-order',
    featured: true,
    options: [
      {
        id: 'colour',
        label: localized('Rəng', 'Colour', 'Цвет'),
        values: [
          {
            id: 'cream-blush',
            label: localized('Krem və çəhrayı', 'Cream and blush', 'Кремовый и пудровый'),
          },
          {
            id: 'cream-sage',
            label: localized('Krem və adaçayı', 'Cream and sage', 'Кремовый и шалфейный'),
          },
        ],
      },
      {
        id: 'size',
        label: localized('Ölçü', 'Size', 'Размер'),
        values: [
          {
            id: 'pram',
            label: localized(
              'Araba üçün (80 × 90 sm)',
              'Pram size (80 × 90 cm)',
              'Для коляски (80 × 90 см)',
            ),
          },
          {
            id: 'cot',
            label: localized(
              'Çarpayı üçün (100 × 120 sm)',
              'Cot size (100 × 120 cm)',
              'Для кроватки (100 × 120 см)',
            ),
          },
        ],
      },
    ],
    images: [
      {
        src: '/images/products/ripple-baby-blanket-1.svg',
        alt: localized(
          'Dalğalı naxışlı toxunma uşaq yorğanının nümunə təsviri',
          'Illustrative image of a ripple-pattern crochet baby blanket',
          'Иллюстрация вязаного детского одеяла с узором «волны»',
        ),
      },
      {
        src: '/images/products/ripple-baby-blanket-2.svg',
        alt: localized(
          'Yorğanın kənar və naxış detallarının nümunə təsviri',
          'Illustrative close-up of the blanket’s edge and pattern',
          'Иллюстрация крупным планом: край и узор одеяла',
        ),
      },
    ],
    materials: localized(
      'Pambıq və akril qarışığı',
      'Cotton and acrylic blend',
      'Смесь хлопка и акрила',
    ),
    care: localized(
      'Zərif rejimdə, 30°C-də yuyun. Sıxmayın, yastı qurudun.',
      'Machine wash on a gentle cycle at 30°C. Do not wring; dry flat.',
      'Машинная стирка на деликатном режиме при 30°C. Не отжимать, сушить в расправленном виде.',
    ),
  },

  {
    slug: 'blush-bucket-hat',
    name: localized('Çəhrayı papaq', 'Blush Bucket Hat', 'Шляпа пудрового оттенка'),
    category: 'accessories',
    shortDescription: localized(
      'Yay üçün yüngül, forma saxlayan toxunma papaq.',
      'A light crochet hat that keeps its shape through summer.',
      'Лёгкая вязаная шляпа, которая держит форму всё лето.',
    ),
    description: localized(
      'Sıx toxunmuş bu papaq günəşdən qoruyur və formada qalır. Kənarı yumşaq, buna görə çantada yer tutmur. Ölçü sifariş zamanı baş ətrafına uyğunlaşdırılır.',
      'A firmly crocheted hat that shades the face and holds its shape. The brim is soft, so it packs easily. The size is matched to your head measurement when you order.',
      'Плотно связанная шляпа защищает от солнца и держит форму. Поля мягкие, поэтому она легко складывается. Размер подбирается по обхвату головы при заказе.',
    ),
    priceAzn: 45,
    availability: 'in-stock',
    featured: true,
    options: [
      {
        id: 'size',
        label: localized('Ölçü', 'Size', 'Размер'),
        values: [
          { id: 's-m', label: localized('S / M', 'S / M', 'S / M') },
          { id: 'm-l', label: localized('M / L', 'M / L', 'M / L') },
        ],
      },
    ],
    images: [
      {
        src: '/images/products/blush-bucket-hat-1.svg',
        alt: localized(
          'Çəhrayı toxunma papağın nümunə təsviri',
          'Illustrative image of a blush crochet bucket hat',
          'Иллюстрация пудровой вязаной шляпы',
        ),
      },
      {
        src: '/images/products/blush-bucket-hat-2.svg',
        alt: localized(
          'Papağın toxunma toxumasının nümunə təsviri',
          'Illustrative close-up of the hat’s crochet texture',
          'Иллюстрация крупным планом: фактура вязания шляпы',
        ),
      },
    ],
    materials: localized('Pambıq iplik', 'Cotton yarn', 'Хлопковая пряжа'),
    care: localized(
      'Əl ilə, sərin suda yuyun. Forma verib qurudun.',
      'Hand wash in cool water. Reshape and dry flat.',
      'Ручная стирка в прохладной воде. Придать форму и сушить в расправленном виде.',
    ),
  },

  {
    slug: 'coaster-set',
    name: localized('Altlıq dəsti (4 ədəd)', 'Coaster Set (4 pieces)', 'Набор подставок (4 шт.)'),
    category: 'home',
    shortDescription: localized(
      'Stolüstü üçün sadə, sıx toxunmuş altlıqlar.',
      'Simple, tightly crocheted coasters for the table.',
      'Простые плотные подставки под посуду для стола.',
    ),
    description: localized(
      'Dörd altlıqdan ibarət dəst isti fincan və stəkanlar üçün nəzərdə tutulub. İkiqat toxunur, buna görə stolun üstündə sürüşmür. Rəngləri ayrıca seçmək olar.',
      'A set of four coasters for warm cups and glasses. They are worked double, so they do not slide on the table. Colours can be chosen separately.',
      'Набор из четырёх подставок для горячих чашек и стаканов. Вяжутся в два слоя, поэтому не скользят по столу. Цвета можно выбрать отдельно.',
    ),
    priceAzn: 30,
    availability: 'in-stock',
    options: [
      {
        id: 'colour',
        label: localized('Rəng', 'Colour', 'Цвет'),
        values: [
          { id: 'natural', label: localized('Təbii', 'Natural', 'Натуральный'), swatch: '#DCCBB4' },
          {
            id: 'terracotta',
            label: localized('Terrakot', 'Terracotta', 'Терракота'),
            swatch: '#B57A56',
          },
        ],
      },
    ],
    images: [
      {
        src: '/images/products/coaster-set-1.svg',
        alt: localized(
          'Toxunma altlıq dəstinin nümunə təsviri',
          'Illustrative image of a crocheted coaster set',
          'Иллюстрация набора вязаных подставок',
        ),
      },
      {
        src: '/images/products/coaster-set-2.svg',
        alt: localized(
          'Altlıqların toxunma detallarının nümunə təsviri',
          'Illustrative close-up of the coasters’ crochet detail',
          'Иллюстрация крупным планом: детали вязания подставок',
        ),
      },
    ],
    materials: localized('Pambıq iplik', 'Cotton yarn', 'Хлопковая пряжа'),
    care: localized(
      'Əl ilə yuyun, yastı qurudun. Ütüləməyin.',
      'Hand wash and dry flat. Do not iron.',
      'Ручная стирка, сушить в расправленном виде. Не гладить.',
    ),
  },

  {
    slug: 'amigurumi-bunny',
    name: localized('Amigurumi dovşan', 'Amigurumi Bunny', 'Амигуруми-зайчик'),
    category: 'gifts',
    shortDescription: localized(
      'Kiçik, yumşaq və tamamilə əllə toxunmuş oyuncaq.',
      'A small, soft toy made entirely by hand.',
      'Небольшая мягкая игрушка, полностью связанная вручную.',
    ),
    description: localized(
      'Bu dovşan amigurumi üsulu ilə toxunur: sıx, bərabər sıralar və sadə forma. Gözlər təhlükəsizlik detalları ilə bərkidilir. Hədiyyə üçün lentlə qablaşdırıla bilər.',
      'This bunny is crocheted in the amigurumi style: tight, even rounds and a simple shape. The eyes are fixed with safety fittings. It can be gift-wrapped with a ribbon.',
      'Этот зайчик связан в технике амигуруми: плотные ровные ряды и простая форма. Глаза закреплены безопасным креплением. Можно упаковать как подарок с лентой.',
    ),
    priceAzn: 55,
    availability: 'made-to-order',
    options: [
      {
        id: 'colour',
        label: localized('Rəng', 'Colour', 'Цвет'),
        values: [
          { id: 'oat', label: localized('Yulaf', 'Oat', 'Овсяный'), swatch: '#E5D7C3' },
          {
            id: 'blush',
            label: localized('Solğun çəhrayı', 'Soft blush', 'Пудрово-розовый'),
            swatch: '#E3C3B6',
          },
        ],
      },
    ],
    images: [
      {
        src: '/images/products/amigurumi-bunny-1.svg',
        alt: localized(
          'Amigurumi dovşan oyuncağının nümunə təsviri',
          'Illustrative image of an amigurumi bunny toy',
          'Иллюстрация игрушки амигуруми-зайчик',
        ),
      },
      {
        src: '/images/products/amigurumi-bunny-2.svg',
        alt: localized(
          'Oyuncağın üz və tikiş detallarının nümunə təsviri',
          'Illustrative close-up of the toy’s face and stitching',
          'Иллюстрация крупным планом: мордочка и швы игрушки',
        ),
      },
    ],
    materials: localized(
      'Pambıq iplik, hipoallergen dolğu',
      'Cotton yarn, hypoallergenic filling',
      'Хлопковая пряжа, гипоаллергенный наполнитель',
    ),
    care: localized(
      'Səth təmizliyi və ya 30°C-də zərif yuma. Sıxmayın.',
      'Surface clean, or gentle wash at 30°C. Do not wring.',
      'Поверхностная чистка или деликатная стирка при 30°C. Не отжимать.',
    ),
  },

  {
    slug: 'ribbed-scarf',
    name: localized('Damar örgülü şərf', 'Ribbed Scarf', 'Шарф резинкой'),
    category: 'accessories',
    shortDescription: localized(
      'Yumşaq, ucları saçaqlı və isti saxlayan şərf.',
      'A soft, fringed scarf that holds warmth well.',
      'Мягкий шарф с бахромой, который хорошо сохраняет тепло.',
    ),
    description: localized(
      'Damar toxuması şərfə elastiklik verir və boyuna rahat oturur. Ucları sadə saçaqla tamamlanır. Uzunluq sifariş zamanı dəyişdirilə bilər.',
      'The ribbed stitch gives the scarf stretch and a comfortable drape. Simple fringe finishes the ends. Length can be adjusted when you order.',
      'Рельефная вязка даёт шарфу эластичность и удобно ложится. Концы завершены простой бахромой. Длину можно изменить при заказе.',
    ),
    priceAzn: 70,
    availability: 'sold-out',
    options: [
      {
        id: 'colour',
        label: localized('Rəng', 'Colour', 'Цвет'),
        values: [
          { id: 'sand', label: localized('Qum', 'Sand', 'Песочный'), swatch: '#CDBEA9' },
          {
            id: 'charcoal',
            label: localized('Tünd boz', 'Charcoal', 'Тёмно-серый'),
            swatch: '#6B625C',
          },
        ],
      },
    ],
    images: [
      {
        src: '/images/products/ribbed-scarf-1.svg',
        alt: localized(
          'Damar örgülü toxunma şərfin nümunə təsviri',
          'Illustrative image of a ribbed crochet scarf',
          'Иллюстрация вязаного шарфа резинкой',
        ),
      },
      {
        src: '/images/products/ribbed-scarf-2.svg',
        alt: localized(
          'Şərfin toxuma və saçaq detallarının nümunə təsviri',
          'Illustrative close-up of the scarf’s texture and fringe',
          'Иллюстрация крупным планом: фактура и бахрома шарфа',
        ),
      },
    ],
    materials: localized('Yun qarışığı iplik', 'Wool blend yarn', 'Шерстяная смесовая пряжа'),
    care: localized(
      'Yalnız əl ilə, sərin suda yuyun. Yastı qurudun.',
      'Hand wash only in cool water. Dry flat.',
      'Только ручная стирка в прохладной воде. Сушить в расправленном виде.',
    ),
  },

  {
    slug: 'flower-keychain',
    name: localized('Çiçək breloku', 'Flower Keychain', 'Брелок-цветок'),
    category: 'gifts',
    shortDescription: localized(
      'Kiçik hədiyyə üçün sadə, işıqlı toxunma brelok.',
      'A small, bright crochet keychain for a little gift.',
      'Небольшой яркий вязаный брелок для маленького подарка.',
    ),
    description: localized(
      'Altı ləçəkli çiçək formasında toxunan brelok çanta və ya açar üçün nəzərdə tutulub. Metal halqa paslanmayan materialdan seçilir. Rəngi ayrıca sifariş etmək olar.',
      'Crocheted as a six-petal flower, this keychain is meant for a bag or keys. The metal ring is chosen to resist tarnishing. A different colour can be ordered.',
      'Брелок в форме шестилепесткового цветка подойдёт для сумки или ключей. Металлическое кольцо выбрано устойчивым к потускнению. Цвет можно заказать другой.',
    ),
    priceAzn: 15,
    availability: 'in-stock',
    options: [
      {
        id: 'colour',
        label: localized('Rəng', 'Colour', 'Цвет'),
        values: [
          { id: 'blush', label: localized('Çəhrayı', 'Blush', 'Пудровый'), swatch: '#E0B9AC' },
          { id: 'sage', label: localized('Adaçayı', 'Sage', 'Шалфейный'), swatch: '#9AA68B' },
          { id: 'ochre', label: localized('Oxra', 'Ochre', 'Охра'), swatch: '#C6A05B' },
        ],
      },
    ],
    images: [
      {
        src: '/images/products/flower-keychain-1.svg',
        alt: localized(
          'Çiçək formasında toxunma brelokun nümunə təsviri',
          'Illustrative image of a crocheted flower keychain',
          'Иллюстрация вязаного брелока-цветка',
        ),
      },
      {
        src: '/images/products/flower-keychain-2.svg',
        alt: localized(
          'Brelokun ləçək və halqa detallarının nümunə təsviri',
          'Illustrative close-up of the keychain’s petals and ring',
          'Иллюстрация крупным планом: лепестки и кольцо брелока',
        ),
      },
    ],
    materials: localized(
      'Pambıq iplik, metal halqa',
      'Cotton yarn, metal ring',
      'Хлопковая пряжа, металлическое кольцо',
    ),
    care: localized(
      'Nəm parça ilə silin. Uzun müddət suda saxlamayın.',
      'Wipe with a damp cloth. Do not soak.',
      'Протирать влажной тканью. Не замачивать.',
    ),
  },

  {
    slug: 'string-market-bag',
    name: localized('Torba market çantası', 'String Market Bag', 'Сетчатая сумка'),
    category: 'accessories',
    shortDescription: localized(
      'Qatlanan, yüngül və gündəlik alış-veriş üçün torba.',
      'A foldable, lightweight string bag for everyday shopping.',
      'Складная лёгкая сетчатая сумка для повседневных покупок.',
    ),
    description: localized(
      'Torba naxışlı bu çanta yığılanda ovuc boyda olur, buna görə çantada saxlanıla bilər. Uzanan qulplar çiyində rahat daşınır. Meyvə, kitab və kiçik alışlar üçün uyğundur.',
      'This mesh bag folds down to palm size, so it can live in another bag. The long handles sit comfortably on the shoulder. Suitable for fruit, books and small errands.',
      'Эта сетчатая сумка складывается до размера ладони и помещается в другую сумку. Длинные ручки удобно ложатся на плечо. Подходит для фруктов, книг и небольших покупок.',
    ),
    priceAzn: 60,
    availability: 'made-to-order',
    options: [
      {
        id: 'colour',
        label: localized('Rəng', 'Colour', 'Цвет'),
        values: [
          { id: 'natural', label: localized('Təbii', 'Natural', 'Натуральный'), swatch: '#E7DDCB' },
          { id: 'olive', label: localized('Zeytun', 'Olive', 'Оливковый'), swatch: '#8E9479' },
        ],
      },
    ],
    images: [
      {
        src: '/images/products/string-market-bag-1.svg',
        alt: localized(
          'Torba naxışlı toxunma market çantasının nümunə təsviri',
          'Illustrative image of a crocheted string market bag',
          'Иллюстрация вязаной сетчатой сумки',
        ),
      },
      {
        src: '/images/products/string-market-bag-2.svg',
        alt: localized(
          'Çantanın torba naxışının nümunə təsviri',
          'Illustrative close-up of the bag’s mesh pattern',
          'Иллюстрация крупным планом: сетчатый узор сумки',
        ),
      },
    ],
    materials: localized('Pambıq iplik', 'Cotton yarn', 'Хлопковая пряжа'),
    care: localized(
      'Əl ilə, sərin suda yuyun. Yastı qurudun.',
      'Hand wash in cool water. Dry flat.',
      'Ручная стирка в прохладной воде. Сушить в расправленном виде.',
    ),
  },
]
