import type { KanjiChar } from '../../entities/kanji/types';

export const kanjiList: KanjiChar[] = [
  {
    id: '1',
    char: '一',
    onyomi: ['イチ', 'イツ'],
    kunyomi: ['ひと', 'ひと.つ'],
    meaning: 'Один',
    jlptLevel: 'N5',
    strokeCount: 1,
    radical: '一',
    learned: true,
    examples: [
      { word: '一つ', reading: 'ひとつ', meaning: 'один (предмет)' },
      { word: '一人', reading: 'ひとり', meaning: 'один человек / одинокий' },
      { word: '一年', reading: 'いちねん', meaning: 'один год' }
    ]
  },
  {
    id: '2',
    char: '二',
    onyomi: ['ニ', 'ジ'],
    kunyomi: ['ふた', 'ふた.つ'],
    meaning: 'Два',
    jlptLevel: 'N5',
    strokeCount: 2,
    radical: '二',
    learned: true,
    examples: [
      { word: '二つ', reading: 'ふたつ', meaning: 'два (предмета)' },
      { word: '二人', reading: 'ふたり', meaning: 'два человека' },
      { word: '二月', reading: 'にがつ', meaning: 'февраль' }
    ]
  },
  {
    id: '3',
    char: '三',
    onyomi: ['サン'],
    kunyomi: ['み', 'み.つ', 'みっ.つ'],
    meaning: 'Три',
    jlptLevel: 'N5',
    strokeCount: 3,
    radical: '一',
    learned: true,
    examples: [
      { word: '三つ', reading: 'みっつ', meaning: 'три (предмета)' },
      { word: '三人', reading: 'さんにん', meaning: 'три человека' },
      { word: '三月', reading: 'さんがつ', meaning: 'март' }
    ]
  },
  {
    id: '4',
    char: '四',
    onyomi: ['シ'],
    kunyomi: ['よ', 'よ.つ', 'よっ.つ', 'よん'],
    meaning: 'Четыре',
    jlptLevel: 'N5',
    strokeCount: 5,
    radical: '囗',
    learned: false,
    examples: [
      { word: '四つ', reading: 'よっつ', meaning: 'четыре (предмета)' },
      { word: '四人', reading: 'よにん', meaning: 'четыре человека' },
      { word: '四月', reading: 'しがつ', meaning: 'апрель' }
    ]
  },
  {
    id: '5',
    char: '五',
    onyomi: ['ゴ'],
    kunyomi: ['いつ', 'いつ.つ'],
    meaning: 'Пять',
    jlptLevel: 'N5',
    strokeCount: 4,
    radical: '二',
    learned: false,
    examples: [
      { word: '五つ', reading: 'いつつ', meaning: 'пять (предметы)' },
      { word: '五人', reading: 'ごにん', meaning: 'пять человек' },
      { word: '五月', reading: 'ごがつ', meaning: 'май' }
    ]
  },
  {
    id: '6',
    char: '六',
    onyomi: ['ロク'],
    kunyomi: ['む', 'む.つ', 'むっ.つ', 'むい'],
    meaning: 'Шесть',
    jlptLevel: 'N5',
    strokeCount: 4,
    radical: '八',
    learned: false,
    examples: [
      { word: '六つ', reading: 'むっつ', meaning: 'шесть (предметов)' },
      { word: '六月', reading: 'ろくがつ', meaning: 'июнь' },
      { word: '六日', reading: 'むいか', meaning: 'шестое число' }
    ]
  },
  {
    id: '7',
    char: '七',
    onyomi: ['シチ'],
    kunyomi: ['なな', 'なな.つ', 'なの'],
    meaning: 'Семь',
    jlptLevel: 'N5',
    strokeCount: 2,
    radical: '一',
    learned: false,
    examples: [
      { word: '七つ', reading: 'ななつ', meaning: 'семь (предметов)' },
      { word: '七月', reading: 'しちがつ', meaning: 'июль' },
      { word: '七日', reading: 'なのか', meaning: 'седьмое число' }
    ]
  },
  {
    id: '8',
    char: '八',
    onyomi: ['ハチ'],
    kunyomi: ['や', 'や.つ', 'やっ.つ', 'よう'],
    meaning: 'Восемь',
    jlptLevel: 'N5',
    strokeCount: 2,
    radical: '八',
    learned: false,
    examples: [
      { word: '八つ', reading: 'やっつ', meaning: 'восемь (предметов)' },
      { word: '八月', reading: 'hachigatsu', meaning: 'август' },
      { word: '八日', reading: 'ようか', meaning: 'восьмое число' }
    ]
  },
  {
    id: '9',
    char: '九',
    onyomi: ['キュウ', 'ク'],
    kunyomi: ['ここの', 'ここの.つ'],
    meaning: 'Девять',
    jlptLevel: 'N5',
    strokeCount: 2,
    radical: '乙',
    learned: false,
    examples: [
      { word: '九つ', reading: 'ここのつ', meaning: 'девять (предметы)' },
      { word: '九月', reading: 'くがつ', meaning: 'сентябрь' },
      { word: '九日', reading: 'ここのか', meaning: 'девятое число' }
    ]
  },
  {
    id: '10',
    char: '十',
    onyomi: ['ジュウ'],
    kunyomi: ['とお', 'と'],
    meaning: 'Десять',
    jlptLevel: 'N5',
    strokeCount: 2,
    radical: '十',
    learned: false,
    examples: [
      { word: '十', reading: 'とお', meaning: 'десять (предметов)' },
      { word: '十月', reading: 'じゅうがつ', meaning: 'октябрь' },
      { word: '十日', reading: 'とおか', meaning: 'десятое число' }
    ]
  },
  {
    id: '11',
    char: '日',
    onyomi: ['ニチ', 'ジツ'],
    kunyomi: ['ひ', '-び', '-か'],
    meaning: 'День / Солнце',
    jlptLevel: 'N5',
    strokeCount: 4,
    radical: '日',
    learned: true,
    examples: [
      { word: '日本', reading: 'にほん', meaning: 'Япония' },
      { word: '今日', reading: 'きょう', meaning: 'сегодня' },
      { word: '日曜日', reading: 'にちようび', meaning: 'воскресенье' }
    ]
  },
  {
    id: '12',
    char: '月',
    onyomi: ['ゲツ', 'ガツ'],
    kunyomi: ['つき'],
    meaning: 'Месяц / Луна',
    jlptLevel: 'N5',
    strokeCount: 4,
    radical: '月',
    learned: true,
    examples: [
      { word: '月曜日', reading: 'げつようび', meaning: 'понедельник' },
      { word: '今月', reading: 'こんげつ', meaning: 'этот месяц' },
      { word: '一月', reading: 'いちがつ', meaning: 'январь' }
    ]
  },
  {
    id: '13',
    char: '火',
    onyomi: ['カ'],
    kunyomi: ['ひ', '-び', 'ほo'],
    meaning: 'Огонь',
    jlptLevel: 'N5',
    strokeCount: 4,
    radical: '火',
    learned: true,
    examples: [
      { word: '火曜日', reading: 'かようび', meaning: 'вторник' },
      { word: '火山', reading: 'かざん', meaning: 'вулкан' },
      { word: '火花', reading: 'ひばな', meaning: 'искра' }
    ]
  },
  {
    id: '14',
    char: '水',
    onyomi: ['スイ'],
    kunyomi: ['みず'],
    meaning: 'Вода',
    jlptLevel: 'N5',
    strokeCount: 4,
    radical: '水',
    learned: true,
    examples: [
      { word: '水曜日', reading: 'すいようび', meaning: 'среда' },
      { word: 'お水', reading: 'おみず', meaning: 'вода (вежл.)' },
      { word: '水泳', reading: 'すいえい', meaning: 'плавание' }
    ]
  },
  {
    id: '15',
    char: '木',
    onyomi: ['モク', 'ボク'],
    kunyomi: ['き', 'こ-'],
    meaning: 'Дерево',
    jlptLevel: 'N5',
    strokeCount: 4,
    radical: '木',
    learned: true,
    examples: [
      { word: '木曜日', reading: 'もくようび', meaning: 'четверг' },
      { word: '木立', reading: 'こだち', meaning: 'роща' },
      { word: '大木', reading: 'たいぼく', meaning: 'большое дерево' }
    ]
  },
  {
    id: '16',
    char: '金',
    onyomi: ['キン', 'コン'],
    kunyomi: ['かね', 'かな-'],
    meaning: 'Золото / Деньги',
    jlptLevel: 'N5',
    strokeCount: 8,
    radical: '金',
    learned: false,
    examples: [
      { word: '金曜日', reading: 'きんようび', meaning: 'пятница' },
      { word: 'お金', reading: 'おかね', meaning: 'деньги' },
      { word: '金持ち', reading: 'かねもち', meaning: 'богач' }
    ]
  },
  {
    id: '17',
    char: '土',
    onyomi: ['ド', 'ト'],
    kunyomi: ['つち'],
    meaning: 'Земля / Почва',
    jlptLevel: 'N5',
    strokeCount: 3,
    radical: '土',
    learned: false,
    examples: [
      { word: '土曜日', reading: 'どようび', meaning: 'суббота' },
      { word: '土地', reading: 'とち', meaning: 'участок земли' },
      { word: '粘土', reading: 'ねんど', meaning: 'глина' }
    ]
  },
  {
    id: '18',
    char: '人',
    onyomi: ['ジン', 'ニン'],
    kunyomi: ['ひと'],
    meaning: 'Человек',
    jlptLevel: 'N5',
    strokeCount: 2,
    radical: '人',
    learned: true,
    examples: [
      { word: '日本人', reading: 'にほんじん', meaning: 'японец' },
      { word: '大人', reading: 'おとな', meaning: 'взрослый' },
      { word: 'あの人', reading: 'あのひと', meaning: 'тот человек' }
    ]
  },
  {
    id: '19',
    char: '大',
    onyomi: ['ダイ', 'タイ'],
    kunyomi: ['おお', 'おお.きい', 'おお.いに'],
    meaning: 'Большой',
    jlptLevel: 'N5',
    strokeCount: 3,
    radical: '大',
    learned: true,
    examples: [
      { word: '大きい', reading: 'おおきい', meaning: 'большой' },
      { word: '大学', reading: 'だいがく', meaning: 'университет' },
      { word: '大人', reading: 'おとな', meaning: 'взрослый' }
    ]
  },
  {
    id: '20',
    char: '小',
    onyomi: ['ショウ'],
    kunyomi: ['ちい.さい', 'こ-', 'お-', 'さ-'],
    meaning: 'Маленький',
    jlptLevel: 'N5',
    strokeCount: 3,
    radical: '小',
    learned: true,
    examples: [
      { word: '小さい', reading: 'ちいさい', meaning: 'маленький' },
      { word: '小学校', reading: 'しょうがっこう', meaning: 'начальная школа' },
      { word: '小屋', reading: 'こや', meaning: 'хижина / будка' }
    ]
  },
  {
    id: '21',
    char: '中',
    onyomi: ['チュウ'],
    kunyomi: ['なか', 'うち', 'あた.る'],
    meaning: 'Центр / Внутри',
    jlptLevel: 'N5',
    strokeCount: 4,
    radical: '丨',
    learned: false,
    examples: [
      { word: '一日中', reading: 'いちにちじゅう', meaning: 'весь день напролет' },
      { word: '中国', reading: 'ちゅうごく', meaning: 'Китай' },
      { word: '中身', reading: 'なかみ', meaning: 'содержимое' }
    ]
  },
  {
    id: '22',
    char: '上',
    onyomi: ['ジョウ', 'ショウ'],
    kunyomi: ['うえ', '-うえ', 'うわ-', 'かみ', 'あ.げる', 'あ.がる'],
    meaning: 'Вверх / Сверху',
    jlptLevel: 'N5',
    strokeCount: 3,
    radical: '一',
    learned: false,
    examples: [
      { word: '上がる', reading: 'あがる', meaning: 'подниматься' },
      { word: '上手', reading: 'じょうず', meaning: 'умелый / искусный' },
      { word: '屋上', reading: 'おくじょう', meaning: 'крыша (здания)' }
    ]
  },
  {
    id: '23',
    char: '下',
    onyomi: ['カ', 'ゲ'],
    kunyomi: ['した', 'しも', 'もと', 'さ.げる', 'さ.がる', 'くだ.る'],
    meaning: 'Вниз / Снизу',
    jlptLevel: 'N5',
    strokeCount: 3,
    radical: '一',
    learned: false,
    examples: [
      { word: '下がる', reading: 'さがる', meaning: 'спускаться' },
      { word: '下手', reading: 'へた', meaning: 'неумелый' },
      { word: '地下鉄', reading: 'ちかてつ', meaning: 'метро' }
    ]
  },
  {
    id: '24',
    char: '山',
    onyomi: ['サン', 'ザン'],
    kunyomi: ['やま'],
    meaning: 'Гора',
    jlptLevel: 'N5',
    strokeCount: 3,
    radical: '山',
    learned: false,
    examples: [
      { word: '富士山', reading: 'ふじさん', meaning: 'гора Фудзи' },
      { word: '山林', reading: 'さんりん', meaning: 'горный лес' },
      { word: '山火事', reading: 'やまかじ', meaning: 'лесной пожар' }
    ]
  },
  {
    id: '25',
    char: '川',
    onyomi: ['セン'],
    kunyomi: ['かわ'],
    meaning: 'Река',
    jlptLevel: 'N5',
    strokeCount: 3,
    radical: '巛',
    learned: false,
    examples: [
      { word: '小川', reading: 'おがわ', meaning: 'ручей' },
      { word: '川岸', reading: 'かわぎし', meaning: 'берег реки' },
      { word: '川遊び', reading: 'かわあそび', meaning: 'катание по реке' }
    ]
  },
  {
    id: '26',
    char: '口',
    onyomi: ['コウ', 'ク'],
    kunyomi: ['くち'],
    meaning: 'Рот / Вход',
    jlptLevel: 'N5',
    strokeCount: 3,
    radical: '口',
    learned: false,
    examples: [
      { word: '入り口', reading: 'いりぐち', meaning: 'вход' },
      { word: '出口', reading: 'でぐち', meaning: 'выход' },
      { word: '人口', reading: 'じんこう', meaning: 'население' }
    ]
  },
  {
    id: '27',
    char: '目',
    onyomi: ['モク', 'ボク'],
    kunyomi: ['め', '-め', 'ま-'],
    meaning: 'Глаз',
    jlptLevel: 'N5',
    strokeCount: 5,
    radical: '目',
    learned: false,
    examples: [
      { word: '目次', reading: 'もくじ', meaning: 'оглавление' },
      { word: '目覚まし', reading: 'めざまし', meaning: 'будильник' },
      { word: '目的', reading: 'もくてき', meaning: 'цель / намерение' }
    ]
  },
  {
    id: '28',
    char: '手',
    onyomi: ['シュ', 'ズ'],
    kunyomi: ['て', 'て-'],
    meaning: 'Рука',
    jlptLevel: 'N5',
    strokeCount: 4,
    radical: '手',
    learned: false,
    examples: [
      { word: '歌手', reading: 'かしゅ', meaning: 'певец' },
      { word: '手紙', reading: 'てがみ', meaning: 'письмо' },
      { word: '握手', reading: 'あくしゅ', meaning: 'рукопожатие' }
    ]
  },
  {
    id: '29',
    char: '足',
    onyomi: ['ソク'],
    kunyomi: ['あし', 'た.りる', 'た.る', 'た.す'],
    meaning: 'Нога / Достаточно',
    jlptLevel: 'N5',
    strokeCount: 7,
    radical: '足',
    learned: false,
    examples: [
      { word: '足りる', reading: 'たりる', meaning: 'быть достаточным' },
      { word: '一足', reading: 'いっそく', meaning: 'одна пара обуви' },
      { word: '遠足', reading: 'えんそく', meaning: 'пикник / экскурсия' }
    ]
  },
  {
    id: '30',
    char: '本',
    onyomi: ['ホン'],
    kunyomi: ['moto'],
    meaning: 'Книга / Основа',
    jlptLevel: 'N5',
    strokeCount: 5,
    radical: '木',
    learned: true,
    examples: [
      { word: '日本語', reading: 'にほんご', meaning: 'японский язык' },
      { word: '本当に', reading: 'ほんとうに', meaning: 'в самом деле / действительно' },
      { word: '一本', reading: 'いっぽん', meaning: 'одна штука (для длинных предметов)' }
    ]
  }
];
