/** Official clinic price list (May 2026). Source: clinic narxnoma Excel. */

export type PriceTier = 'Layt' | 'Standart' | 'Premium'

export type CheckupTier = {
  tier: PriceTier
  price: number
  includes: string[]
  notes: string[]
}

export type CheckupDirection = {
  id: string
  title: string
  accent: string
  tiers: CheckupTier[]
}

export type CatalogItem = {
  id: number
  name: string
  citizen: number
  foreign: number | null
  location: string | null
  category: string
}

export const CHECKUP_DIRECTIONS: CheckupDirection[] = [
  {
    "id": "gastro",
    "title": "Gastroenterologiya",
    "accent": "#0EA5E9",
    "tiers": [
      {
        "tier": "Layt",
        "price": 300000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "Umumiy qon taxlili",
          "Qorin bo'shlig'ining ultratovush tekshiruv"
        ],
        "notes": [
          "Biokimyoviy qon testi (yorug'lik): ALT, AST (jigar testlari), bilirubin (jami, to'g'ridan-to'g'ri), gidroksidi fosfataza (ALP)).",
          "Biokimyoviy qon testi"
        ]
      },
      {
        "tier": "Standart",
        "price": 400000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "Umumiy qon taxlili",
          "Qorin bo'shlig'ining ultratovush tekshiruv",
          "FGDS"
        ],
        "notes": [
          "Biokimyoviy qon testi (asosiy): ALT, AST (jigar testlari), bilirubin (jami, bevosita), gidroksidi fosfataza (ALP), GGT, alfa-amilaza (oshqozon osti bezi), kreatinin, glyukoza.",
          "Biokimyoviy qon testi"
        ]
      },
      {
        "tier": "Premium",
        "price": 505000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "Umumiy qon taxlili+Umumiy siydik taxlili",
          "Qorin bo'shlig'ining ultratovush tekshiruv",
          "FGDS",
          "koprogramma",
          "Najasda yashirin qon testi"
        ],
        "notes": [
          "Biokimyoviy qon testi (asosiy): ALT, AST (jigar testlari), bilirubin (jami, bevosita), gidroksidi fosfataza (ALP), GGT, alfa-amilaza (oshqozon osti bezi), kreatinin, glyukoza.",
          "Biokimyoviy qon testi"
        ]
      }
    ]
  },
  {
    "id": "cardio",
    "title": "Kardiologiya",
    "accent": "#EF4444",
    "tiers": [
      {
        "tier": "Layt",
        "price": 110000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "EKG",
          "Umumiy qon taxlili",
          "Xolestirin"
        ],
        "notes": []
      },
      {
        "tier": "Standart",
        "price": 230000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "EKG",
          "Umumiy qon taxlili+Umumiy siydik taxlili",
          "Xolestirin",
          "EXO-KG"
        ],
        "notes": []
      },
      {
        "tier": "Premium",
        "price": 370000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Lipid profili - LDL, VLDL, HDL, triglitseridlar, aterogenlik indeksi",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "EKG",
          "Umumiy qon taxlili+Umumiy siydik taxlili",
          "Xolestirin",
          "EXO-KG"
        ],
        "notes": [
          "Lipid profil"
        ]
      }
    ]
  },
  {
    "id": "gyno",
    "title": "Ginekologiya",
    "accent": "#EC4899",
    "tiers": [
      {
        "tier": "Layt",
        "price": 130000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "Surtma olish",
          "Tos a'zolarining ultratovush tekshiruvi"
        ],
        "notes": []
      },
      {
        "tier": "Standart",
        "price": 180000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "Surtma olish",
          "Tos a'zolarining ultratovush tekshiruvi",
          "Pap testi"
        ],
        "notes": []
      },
      {
        "tier": "Premium",
        "price": 900000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "Surtma olish",
          "Tos a'zolarining ultratovush tekshiruvi",
          "Pap testi",
          "Femoflor surtma olish",
          "Mammografiya"
        ],
        "notes": []
      }
    ]
  },
  {
    "id": "uro",
    "title": "Urologiya",
    "accent": "#8B5CF6",
    "tiers": [
      {
        "tier": "Layt",
        "price": 190000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "Siydik tizimi ultratovush tekshiruvi",
          "Umumiy siydik taxlili",
          "PSA umumiy"
        ],
        "notes": []
      },
      {
        "tier": "Standart",
        "price": 310000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "Siydik tizimi ultratovush tekshiruvi",
          "Transabdominal prostata ultratovush tekshiruvi",
          "Umumiy qon taxlili+Umumiy siydik taxlili",
          "PSA umumiy"
        ],
        "notes": []
      },
      {
        "tier": "Premium",
        "price": 460000,
        "includes": [
          "Umumiy amaliyot shifokori",
          "Gastroenterolog",
          "Kardiolog",
          "Pulmonolog",
          "Akusher-ginekolog",
          "Nevrolog",
          "Otorinolaringolog",
          "Oftalmolog",
          "Proktolog",
          "Flebolog",
          "Travmatolog-ortoped",
          "Davolash ishlari bo`yicha bosh vrach o'rinbosari :",
          "Iqtisodchi:",
          "Dermatovenerolog",
          "Jarroh",
          "Urolog",
          "Siydik tizimi ultratovush tekshiruvi",
          "Transrektal prostata ultratovush tekshiruvi",
          "Yorg`oqning ultratovush tekshiruvi",
          "Umumiy qon taxlili+Umumiy siydik taxlili",
          "PSA umumiy+PSA b.",
          "S.S.Askarov",
          "F.I.Abdullajonov"
        ],
        "notes": [
          "Biokimyoviy qon testi Mochavina-Kreatin"
        ]
      }
    ]
  }
]

export const PRICE_CATALOG: CatalogItem[] = [
  {
    "id": 1,
    "name": "1-darajalik operatsiya 1 soat uchun",
    "citizen": 802000,
    "foreign": 1042600,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Yangi texnologiya jarrohlik"
  },
  {
    "id": 2,
    "name": "2 darajalik operatsiya 1 soat uchun",
    "citizen": 1088000,
    "foreign": 1414400,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Yangi texnologiya jarrohlik"
  },
  {
    "id": 3,
    "name": "3 darajalik operatsiya 1 soat uchun",
    "citizen": 1374000,
    "foreign": 1786200,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Yangi texnologiya jarrohlik"
  },
  {
    "id": 4,
    "name": "1-darajalik operatsiya 1 soat uchun",
    "citizen": 758000,
    "foreign": 985400,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Jarrohlik operatsiyasi"
  },
  {
    "id": 5,
    "name": "2 darajalik operatsiya 1 soat uchun",
    "citizen": 1044000,
    "foreign": 1357200,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Jarrohlik operatsiyasi"
  },
  {
    "id": 6,
    "name": "3 darajalik operatsiya 1 soat uchun",
    "citizen": 1330000,
    "foreign": 1729000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Jarrohlik operatsiyasi"
  },
  {
    "id": 7,
    "name": "SMА spinomozgovoy Vrach Anestiziya 1 soat uchun",
    "citizen": 702000,
    "foreign": 912600,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Anesteziya"
  },
  {
    "id": 8,
    "name": "ETN endotraxialiniy Vrach Anestiziya 1 soat uchun",
    "citizen": 702000,
    "foreign": 912600,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Anesteziya"
  },
  {
    "id": 9,
    "name": "VV vnutri venniy anesteziya 1 soat uchun",
    "citizen": 702000,
    "foreign": 912600,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Anesteziya"
  },
  {
    "id": 10,
    "name": "1 darajalik operatsiya 1 soat uchun",
    "citizen": 635000,
    "foreign": 825500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Ginekologik operatsiya"
  },
  {
    "id": 11,
    "name": "2 darajalik operatsiya 1 soat uchun",
    "citizen": 921000,
    "foreign": 1197300,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Ginekologik operatsiya"
  },
  {
    "id": 12,
    "name": "3 darajalik operatsiya 1 soat uchun",
    "citizen": 1207000,
    "foreign": 1569100,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Ginekologik operatsiya"
  },
  {
    "id": 13,
    "name": "1 darajalik operatsiya 1 soat uchun",
    "citizen": 635000,
    "foreign": 825500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR operatsiyasi"
  },
  {
    "id": 14,
    "name": "2 darajalik operatsiya 1 soat uchun",
    "citizen": 921000,
    "foreign": 1197300,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR operatsiyasi"
  },
  {
    "id": 15,
    "name": "3 darajalik operatsiya 1 soat uchun",
    "citizen": 1207000,
    "foreign": 1569100,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR operatsiyasi"
  },
  {
    "id": 16,
    "name": "Vrach ginekolog koʼrigi",
    "citizen": 81000,
    "foreign": 105300,
    "location": null,
    "category": "Ginekologiya"
  },
  {
    "id": 17,
    "name": "Surtma olish",
    "citizen": 40000,
    "foreign": 52000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Ginekologiya"
  },
  {
    "id": 18,
    "name": "Tampon qoʼyish",
    "citizen": 24000,
    "foreign": 31200,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Ginekologiya"
  },
  {
    "id": 19,
    "name": "Biopsiya olish",
    "citizen": 65000,
    "foreign": 84500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Ginekologiya"
  },
  {
    "id": 20,
    "name": "Bachadon boʼshligʼidan aspirat olish",
    "citizen": 43000,
    "foreign": 55900,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Ginekologiya"
  },
  {
    "id": 20,
    "name": "Kolposkopiya",
    "citizen": 120000,
    "foreign": 156000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Ginekologiya"
  },
  {
    "id": 21,
    "name": "Bogʼlov xona xizmati (Jaroxat bogʼlamini alishtirish) dori-darmonsiz",
    "citizen": 65000,
    "foreign": 84500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Jarrohlik qabul"
  },
  {
    "id": 22,
    "name": "Bogʼlov xona xizmati (Jaroxat bogʼlamini alishtirish) dori-darmon bilan",
    "citizen": 90000,
    "foreign": 117000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Jarrohlik qabul"
  },
  {
    "id": 23,
    "name": "Burunni Proets usulda yuvish",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR"
  },
  {
    "id": 24,
    "name": "Lakuna yuvish",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR"
  },
  {
    "id": 25,
    "name": "Quloqni yuvish",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR"
  },
  {
    "id": 26,
    "name": "Quoloq ortiga inektsiya",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR"
  },
  {
    "id": 27,
    "name": "Tomoqqa inektsiya",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR"
  },
  {
    "id": 28,
    "name": "Yuqori jag` bo`shlig`i punksiyasi",
    "citizen": 100000,
    "foreign": 130000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR"
  },
  {
    "id": 29,
    "name": "Yevstaxiy truba kateterizatsiyasi",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "LOR"
  },
  {
    "id": 30,
    "name": "Xoltir EKG 24 soat",
    "citizen": 250000,
    "foreign": 325000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Qabul / diagnostika"
  },
  {
    "id": 31,
    "name": "Multispiral kompyuter tomografiyasi",
    "citizen": 250000,
    "foreign": 325000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Qabul / diagnostika"
  },
  {
    "id": 32,
    "name": "Vrach fizioterapevt maslaxati",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 33,
    "name": "Toki Bernara,ampli -pulus,",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 34,
    "name": "Darsenval,UZK",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 35,
    "name": "Darsenval,UZK joylariga borib",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 36,
    "name": "Solyuks,MT",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 37,
    "name": "El.farez",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 38,
    "name": "Svetovaya vanna",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 39,
    "name": "Kvarts,KUF",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 40,
    "name": "Elektrouyqu",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 41,
    "name": "UVCh, Ranet",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 42,
    "name": "Parafin 2 birlik",
    "citizen": 25000,
    "foreign": 32500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 43,
    "name": "Parafin.trusi 4 birlik",
    "citizen": 40000,
    "foreign": 52000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 44,
    "name": "Massaj 1 dona (10 daqiqa)",
    "citizen": 25000,
    "foreign": 32500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 45,
    "name": "LFK",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 46,
    "name": "Elektrofarez,Toki Bernara joylariga borib",
    "citizen": 25000,
    "foreign": 32500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 47,
    "name": "Parafin 2 birlik .joylariga borib",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 48,
    "name": "Parafin.trusi 4 birlik. joylariga borib",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 49,
    "name": "Joylariga borib Massaj 1 dona.",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Fizioterapiya"
  },
  {
    "id": 50,
    "name": "EKG xizmati",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "EKG"
  },
  {
    "id": 51,
    "name": "EKG xizmati boʼlimga borib",
    "citizen": 40000,
    "foreign": 52000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "EKG"
  },
  {
    "id": 52,
    "name": "EXO EG xizmati",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "EKG"
  },
  {
    "id": 53,
    "name": "UZI xizmati boʼlimga borganda har bir ko`ruv uchun qo`shimcha",
    "citizen": 19000,
    "foreign": 24700,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 54,
    "name": "O't pufagi + jigar",
    "citizen": 70000,
    "foreign": 91000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 55,
    "name": "Oshqozon osti bezi",
    "citizen": 55000,
    "foreign": 71500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 56,
    "name": "Taloq",
    "citizen": 55000,
    "foreign": 71500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 57,
    "name": "Murakkab: jigar + o't pufagi + oshqozon osti bezi + taloq",
    "citizen": 150000,
    "foreign": 195000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 58,
    "name": "Siydik pufagi bilan qoldiq siydik",
    "citizen": 55000,
    "foreign": 71500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 59,
    "name": "Buyraklar",
    "citizen": 70000,
    "foreign": 91000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 60,
    "name": "Kompleks:buyraklar, siydik pufagi, prostata bezi,",
    "citizen": 170000,
    "foreign": 221000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 61,
    "name": "Kompleks:buyraklar, siydik pufagi, bilan.",
    "citizen": 100000,
    "foreign": 130000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 62,
    "name": "Plevra qavati",
    "citizen": 60000,
    "foreign": 78000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 63,
    "name": "ExoKG",
    "citizen": 100000,
    "foreign": 130000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 64,
    "name": "Ginekologik kasalliklar uchun",
    "citizen": 70000,
    "foreign": 91000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 65,
    "name": "Prostata bezi, tuxumdonlar",
    "citizen": 70000,
    "foreign": 91000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 66,
    "name": "Bo`g`im 1 dona oyoq (tizza bo`g`im)",
    "citizen": 80000,
    "foreign": 104000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 67,
    "name": "Bo`g`im bir juft (tizza bo`g`im)",
    "citizen": 140000,
    "foreign": 182000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 68,
    "name": "Homiladorlik 3 oygacha",
    "citizen": 60000,
    "foreign": 78000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 69,
    "name": "Homiladorlik 3 oydan keyin",
    "citizen": 80000,
    "foreign": 104000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 70,
    "name": "Sut Bezi",
    "citizen": 60000,
    "foreign": 78000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 71,
    "name": "Qalqonsimon bez",
    "citizen": 60000,
    "foreign": 78000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 72,
    "name": "Vaginal tekshiruv",
    "citizen": 80000,
    "foreign": 104000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 73,
    "name": "BSA tomirlari tekshiruvi",
    "citizen": 80000,
    "foreign": 104000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 74,
    "name": "Yumshoq to`qima",
    "citizen": 60000,
    "foreign": 78000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "UZI"
  },
  {
    "id": 75,
    "name": "Entorka plyonka (bez kontrast)",
    "citizen": 150000,
    "foreign": 195000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 76,
    "name": "Entorka foto qogʼoz",
    "citizen": 130000,
    "foreign": 169000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 77,
    "name": "Uretra grafiya plyonka (bez kontrast)",
    "citizen": 150000,
    "foreign": 195000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 78,
    "name": "Uretra grafiya foto qogʼoz",
    "citizen": 130000,
    "foreign": 169000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 79,
    "name": "Аntrogratka plyonka (bez kontrast)",
    "citizen": 150000,
    "foreign": 195000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 80,
    "name": "Аntrogratka plyonka foto qogʼoz",
    "citizen": 130000,
    "foreign": 169000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 81,
    "name": "Getro solpingo grafiya plyonka (bez kontrast)",
    "citizen": 200000,
    "foreign": 260000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 82,
    "name": "Getro solpingo grafiya foto qogʼoz",
    "citizen": 170000,
    "foreign": 221000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 83,
    "name": "Irigo grafiya plyonka (bez kontrast)",
    "citizen": 200000,
    "foreign": 260000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 84,
    "name": "Irigo grafiya foto qogʼoz",
    "citizen": 170000,
    "foreign": 221000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 85,
    "name": "Tana aʼzosi 1 koʼrinishi plyonka",
    "citizen": 90000,
    "foreign": 117000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 86,
    "name": "Tana aʼzosi 2 koʼrinishi plyonka",
    "citizen": 110000,
    "foreign": 143000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 87,
    "name": "Flyurografiya plyonka",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 88,
    "name": "Tana aʼzosi 1 koʼrinishi foto qogʼoz",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 89,
    "name": "Tana aʼzosi 2 koʼrinishi foto qogʼoz",
    "citizen": 90000,
    "foreign": 117000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 90,
    "name": "Flyurografiya foto qogʼoz",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Rentgen"
  },
  {
    "id": 91,
    "name": "Qondagi SRB ( «S» reaktiv oqsil) tekshiruvi",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 92,
    "name": "Umumiy siydik tahlili",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 93,
    "name": "Qondagi kreatinini aniqlash",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 94,
    "name": "АLT ni aniqlash",
    "citizen": 35000,
    "foreign": 45500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 95,
    "name": "АST ni aniqlash",
    "citizen": 35000,
    "foreign": 45500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 96,
    "name": "Qondagi glyukozani aniqlash",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 97,
    "name": "Qondagi mochevini aniqlash",
    "citizen": 40000,
    "foreign": 52000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 98,
    "name": "Qondagi bilirubinni aniqlash",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 99,
    "name": "Ca+1 tekshiruvi",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 100,
    "name": "Qondagi xolesterinni aniqlash",
    "citizen": 35000,
    "foreign": 45500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 101,
    "name": "Аyollar surtmasini tekshirish",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 102,
    "name": "Umumiy oqsil tekshiruvi",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 103,
    "name": "Qondagi timolni aniqlash",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 104,
    "name": "Qondagi Аlfa Аmilaza tekshiruvi (diastaza)",
    "citizen": 40000,
    "foreign": 52000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 105,
    "name": "Qondagi PTI tekshiruvi + MNO",
    "citizen": 40000,
    "foreign": 52000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 106,
    "name": "Fibrinogen tekshiruvi +MNO",
    "citizen": 40000,
    "foreign": 52000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 107,
    "name": "Qondagi mochavaya kislotasini aniqlash",
    "citizen": 35000,
    "foreign": 45500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 108,
    "name": "Umumiy qon taxlili",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 109,
    "name": "Qondagi gemoglobinni aniqlash",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 110,
    "name": "Qondagi leykotsitlarni aniqlash",
    "citizen": 25000,
    "foreign": 32500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 111,
    "name": "Qondagi EChV(SOE)ni aniqlash",
    "citizen": 25000,
    "foreign": 32500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 112,
    "name": "Qonni ivish tezligini aniqlash",
    "citizen": 25000,
    "foreign": 32500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 113,
    "name": "Gepatit B (HBs Ag) antigenini aniqlash (ekspress test)",
    "citizen": 45000,
    "foreign": 58500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 114,
    "name": "Gepatit S antigenini aniqlash (ekspress test)",
    "citizen": 45000,
    "foreign": 58500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 115,
    "name": "Qon guruxini aniqlash (rezus faktor)",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 116,
    "name": "Qondagi revma-faktorni aniqlash",
    "citizen": 25000,
    "foreign": 32500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 117,
    "name": "АSLO tekshiruvi (Revmaproba)",
    "citizen": 40000,
    "foreign": 52000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 118,
    "name": "Tekshiruv Covit-19 Ekspress test + MG %",
    "citizen": 60000,
    "foreign": 78000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 119,
    "name": "Xolesterin LPVP aniqlash",
    "citizen": 35000,
    "foreign": 45500,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 120,
    "name": "Xolesterin LPNP aniqlash",
    "citizen": 30000,
    "foreign": 39000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 121,
    "name": "Trigliseridlar",
    "citizen": 20000,
    "foreign": 26000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 122,
    "name": "Express-test sifilis (TP)",
    "citizen": 40000,
    "foreign": 52000,
    "location": "Diagnostika binosi 1-2 qavat",
    "category": "Laboratoriya"
  },
  {
    "id": 123,
    "name": "Oliy toifali shifokor maslaxati",
    "citizen": 122000,
    "foreign": 158600,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — jarrohlik"
  },
  {
    "id": 124,
    "name": "Birinchi toifali shifokor maslaxati",
    "citizen": 110000,
    "foreign": 143000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — jarrohlik"
  },
  {
    "id": 125,
    "name": "Ikkinchi toifali shifokor maslaxati",
    "citizen": 95000,
    "foreign": 123500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — jarrohlik"
  },
  {
    "id": 126,
    "name": "Toifasiz shifokor maslaxati",
    "citizen": 86000,
    "foreign": 111800,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — jarrohlik"
  },
  {
    "id": 127,
    "name": "Oliy toifali shifokor maslaxati",
    "citizen": 113000,
    "foreign": 146900,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — anesteziologiya"
  },
  {
    "id": 128,
    "name": "Birinchi toifali shifokor maslaxati",
    "citizen": 102000,
    "foreign": 132600,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — anesteziologiya"
  },
  {
    "id": 129,
    "name": "Ikkinchi toifali shifokor maslaxati",
    "citizen": 88000,
    "foreign": 114400,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — anesteziologiya"
  },
  {
    "id": 130,
    "name": "Toifasiz shifokor maslaxati",
    "citizen": 79000,
    "foreign": 102700,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — anesteziologiya"
  },
  {
    "id": 131,
    "name": "Oliy toifali shifokor maslaxati",
    "citizen": 65000,
    "foreign": 84500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — terapiya"
  },
  {
    "id": 132,
    "name": "Birinchi toifali shifokor maslaxati",
    "citizen": 60000,
    "foreign": 78000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — terapiya"
  },
  {
    "id": 133,
    "name": "Ikkinchi toifali shifokor maslaxati",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — terapiya"
  },
  {
    "id": 134,
    "name": "Toifasiz shifokor maslaxati",
    "citizen": 45000,
    "foreign": 58500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Stasionar — terapiya"
  },
  {
    "id": 128,
    "name": "Oliy toifali shifokor",
    "citizen": 66000,
    "foreign": 82500,
    "location": null,
    "category": "Stasionar — pediatriya"
  },
  {
    "id": 129,
    "name": "Birinchi toifali shifokor",
    "citizen": 60000,
    "foreign": 75000,
    "location": null,
    "category": "Stasionar — pediatriya"
  },
  {
    "id": 130,
    "name": "Ikkinchi toifali shifokor",
    "citizen": 56000,
    "foreign": 70000,
    "location": null,
    "category": "Stasionar — pediatriya"
  },
  {
    "id": 131,
    "name": "Toifasiz shifokor",
    "citizen": 50000,
    "foreign": 62500,
    "location": null,
    "category": "Stasionar — pediatriya"
  },
  {
    "id": 132,
    "name": "Oliy toifali jarrox shifokor",
    "citizen": 85000,
    "foreign": 106250,
    "location": null,
    "category": "Stasionar — jarrohlik"
  },
  {
    "id": 133,
    "name": "Birinchi toifali jarrox shifokor",
    "citizen": 77000,
    "foreign": 96250,
    "location": null,
    "category": "Stasionar — jarrohlik"
  },
  {
    "id": 134,
    "name": "Ikkinchi toifali jarrox shifokor",
    "citizen": 68000,
    "foreign": 85000,
    "location": null,
    "category": "Stasionar — jarrohlik"
  },
  {
    "id": 135,
    "name": "Toifasiz jarrox shifokor",
    "citizen": 56000,
    "foreign": 70000,
    "location": null,
    "category": "Stasionar — jarrohlik"
  },
  {
    "id": 136,
    "name": "Oliy toifali anesteziolog shifokor",
    "citizen": 86000,
    "foreign": 107500,
    "location": null,
    "category": "Stasionar — anesteziologiya"
  },
  {
    "id": 137,
    "name": "Birinchi toifali anesteziolog shifokor",
    "citizen": 77000,
    "foreign": 96250,
    "location": null,
    "category": "Stasionar — anesteziologiya"
  },
  {
    "id": 138,
    "name": "Ikkinchi toifali anesteziolog shifokor",
    "citizen": 66000,
    "foreign": 82500,
    "location": null,
    "category": "Stasionar — anesteziologiya"
  },
  {
    "id": 139,
    "name": "Toifasiz anesteziolog shifokor",
    "citizen": 60000,
    "foreign": 75000,
    "location": null,
    "category": "Stasionar — anesteziologiya"
  },
  {
    "id": 135,
    "name": "Yoqish xizmati 1 kg uchun (mufel pech) da",
    "citizen": 40000,
    "foreign": 52000,
    "location": null,
    "category": "Yoqish"
  },
  {
    "id": 136,
    "name": "Аnaliz SPID",
    "citizen": 60000,
    "foreign": 118000,
    "location": "OITS markazi binosi",
    "category": "Tahlil olib borish"
  },
  {
    "id": 137,
    "name": "Kir yuvish xizmati bir (kg) uchun",
    "citizen": 10000,
    "foreign": 13000,
    "location": null,
    "category": "Kir yuvish"
  },
  {
    "id": 138,
    "name": "Tibbiy asbob uskunalarni sterilizatsiyalash (1 dona biks tuplami uchun)",
    "citizen": 120000,
    "foreign": 156000,
    "location": "Sterilizatsiya binosi 1 qavat",
    "category": "MSB"
  },
  {
    "id": 139,
    "name": "Sariflangan dori-darmon uchun oʼrtacha (dez modda, spirt va paxta) xirurgik bo`limlar uchun",
    "citizen": 12000,
    "foreign": 12000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Dori-darmon"
  },
  {
    "id": 140,
    "name": "Sariflangan dori-darmon uchun oʼrtacha (dez modda, spirt va paxta) terapevtik bo`limlar uchun",
    "citizen": 10000,
    "foreign": 10000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Dori-darmon"
  },
  {
    "id": 141,
    "name": "Gistologik tekshiruv",
    "citizen": 190000,
    "foreign": 237500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Gistologiya"
  },
  {
    "id": 142,
    "name": "Gistologik tekshiruv 1 ta boʼlak uchun",
    "citizen": 10000,
    "foreign": 12500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Gistologiya"
  },
  {
    "id": 143,
    "name": "Jarroxlik boʼlimida bir oʼrin-joy xizmati lyuks jixozlangan xona uchun (xojatxona,televizor, Muzlatgich, va boshqalar )",
    "citizen": 480000,
    "foreign": 624000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Yotoq joy"
  },
  {
    "id": 144,
    "name": "Terapiya boʼlimida bir oʼrin-joy xizmati uchun lyuks jixozlangan xona uchun (xojatxona,televizor, Muzlatgich, va boshqalar )",
    "citizen": 440000,
    "foreign": 572000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Yotoq joy"
  },
  {
    "id": 145,
    "name": "Kunduzgi o`rin-joy 10 soatgacha",
    "citizen": 150000,
    "foreign": 195000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Yotoq joy"
  },
  {
    "id": 146,
    "name": "Kunduzgi o`rin-joy 5 soatgacha",
    "citizen": 75000,
    "foreign": 97500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Yotoq joy"
  },
  {
    "id": 147,
    "name": "Kunduzgi o`rin-joy bir marotaba muolaja uchun",
    "citizen": 50000,
    "foreign": 65000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Yotoq joy"
  },
  {
    "id": 148,
    "name": "Intensiv reanimatsiya boʼlimida bir kunlik oʼrin-joy xizmati",
    "citizen": 660000,
    "foreign": 858000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Yotoq joy"
  },
  {
    "id": 149,
    "name": "Kislorod konsentratorida foydalanish tibbiy xizmat 1 soat uchun",
    "citizen": 5000,
    "foreign": 6500,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Konsentrator"
  },
  {
    "id": 150,
    "name": "Bir kunlik ovqatlanish (nonushta,tushlik 1-2 taom va kechki ovqat)",
    "citizen": 40000,
    "foreign": 40000,
    "location": "Davolash binosi 1-2 qavat",
    "category": "Ovqatlanish"
  },
  {
    "id": 151,
    "name": "Kserokopiya (1 list A5 yoki A4 format)",
    "citizen": 1000,
    "foreign": 1000,
    "location": "Ma`muriyat binosi 1 qavat",
    "category": "Servis"
  }
]

export const PRICE_CATEGORIES: string[] = [
  "Anesteziya",
  "Dori-darmon",
  "EKG",
  "Fizioterapiya",
  "Ginekologik operatsiya",
  "Ginekologiya",
  "Gistologiya",
  "Jarrohlik operatsiyasi",
  "Jarrohlik qabul",
  "Kir yuvish",
  "Konsentrator",
  "LOR",
  "LOR operatsiyasi",
  "Laboratoriya",
  "MSB",
  "Ovqatlanish",
  "Qabul / diagnostika",
  "Rentgen",
  "Servis",
  "Stasionar — anesteziologiya",
  "Stasionar — jarrohlik",
  "Stasionar — pediatriya",
  "Stasionar — terapiya",
  "Tahlil olib borish",
  "UZI",
  "Yangi texnologiya jarrohlik",
  "Yoqish",
  "Yotoq joy"
]

export const PRICE_LIST_UPDATED = '2026-05-12'

export function formatSom(amount: number): string {
  return String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}
