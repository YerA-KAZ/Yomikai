import type { DictionaryEntry } from '../../entities/dictionary/types';

export const dictionaryEntries: DictionaryEntry[] = [
  // Приветствия и вежливость (Greetings & Politeness)
  {
    id: 'd1',
    word: 'こんにちは',
    reading: 'konnichiwa',
    meaning: 'Здравствуйте / Добрый день',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['приветствия', 'разговорный'],
    examples: [
      { japanese: '皆さん、こんにちは。', russian: 'Всем здравствуйте.' }
    ]
  },
  {
    id: 'd2',
    word: 'さようなら',
    reading: 'sayounara',
    meaning: 'До свидания / Прощайте',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['приветствия', 'разговорный'],
    examples: [
      { japanese: '先生、さようなら。', russian: 'До свидания, учитель.' }
    ]
  },
  {
    id: 'd3',
    word: 'ありがとう',
    reading: 'arigatou',
    meaning: 'Спасибо',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['вежливость', 'разговорный'],
    examples: [
      { japanese: '手伝ってくれてありがとう。', russian: 'Спасибо, что помог.' }
    ]
  },
  {
    id: 'd4',
    word: 'すみません',
    reading: 'sumimasen',
    meaning: 'Извините / Прошу прощения',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['вежливость', 'разговорный'],
    examples: [
      { japanese: '遅れてすみません。', russian: 'Извините за опоздание.' }
    ]
  },
  {
    id: 'd5',
    word: 'おはようございます',
    reading: 'ohayou gozaimasu',
    meaning: 'Доброе утро',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['приветствия', 'вежливый'],
    examples: [
      { japanese: 'お父さん、おはようございます。', russian: 'Доброе утро, отец.' }
    ]
  },
  {
    id: 'd6',
    word: 'こんばんは',
    reading: 'konbanwa',
    meaning: 'Добрый вечер',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['приветствия', 'разговорный'],
    examples: [
      { japanese: 'こんばんは、お元気ですか？', russian: 'Добрый вечер, как ваши дела?' }
    ]
  },
  {
    id: 'd7',
    word: 'おやすみなさい',
    reading: 'oyasuminasai',
    meaning: 'Спокойной ночи',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['приветствия', 'разговорный'],
    examples: [
      { japanese: 'もう遅いので、おやすみなさい。', russian: 'Уже поздно, спокойной ночи.' }
    ]
  },
  {
    id: 'd8',
    word: 'はじめまして',
    reading: 'hajimemashite',
    meaning: 'Рад встрече / Приятно познакомиться',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['приветствия', 'вежливый'],
    examples: [
      { japanese: 'はじめまして、山田です。', russian: 'Приятно познакомиться, я Ямада.' }
    ]
  },
  {
    id: 'd9',
    word: 'よろしくおねがいします',
    reading: 'yoroshiku onegaishimasu',
    meaning: 'Прошу любить и жаловать / Надеюсь на сотрудничество',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['вежливость', 'вежливый'],
    examples: [
      { japanese: 'これからよろしくおねがいします。', russian: 'Надеюсь на плодотворную работу в будущем.' }
    ]
  },
  {
    id: 'd10',
    word: 'いただきます',
    reading: 'itadakimasu',
    meaning: 'Приятного аппетита (перед едой)',
    partOfSpeech: 'Междометие',
    jlptLevel: 'N5',
    tags: ['вежливость', 'еда'],
    examples: [
      { japanese: 'おいしそうですね。いただきます。', russian: 'Выглядит вкусно. Приступаем к еде.' }
    ]
  },

  // Животные (Animals)
  {
    id: 'd11',
    word: '猫',
    reading: 'ねこ',
    meaning: 'Кот / Кошка',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['животные'],
    examples: [
      { japanese: '私の家には黒い猫がいます。', russian: 'В моем доме живет черный кот.' }
    ]
  },
  {
    id: 'd12',
    word: '犬',
    reading: 'いぬ',
    meaning: 'Собака',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['животные'],
    examples: [
      { japanese: 'あの犬はとても大きいです。', russian: 'Та собака очень большая.' }
    ]
  },
  {
    id: 'd13',
    word: '鳥',
    reading: 'とり',
    meaning: 'Птица',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['животные'],
    examples: [
      { japanese: '空に白い鳥が飛んでいます。', russian: 'В небе летит белая птица.' }
    ]
  },
  {
    id: 'd14',
    word: '魚',
    reading: 'さかな',
    meaning: 'Рыба',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['животные', 'еда'],
    examples: [
      { japanese: '川で魚を釣りました。', russian: 'Я поймал рыбу в реке.' }
    ]
  },
  {
    id: 'd15',
    word: '馬',
    reading: 'うま',
    meaning: 'Лошадь',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N4',
    tags: ['животные'],
    examples: [
      { japanese: '馬に乗ったことがありますか？', russian: 'Вы когда-нибудь катались на лошади?' }
    ]
  },

  // Еда и Напитки (Food & Drinks)
  {
    id: 'd16',
    word: 'ご飯',
    reading: 'ごはん',
    meaning: 'Рис / Еда',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['еда'],
    examples: [
      { japanese: '朝ご飯を食べましたか？', russian: 'Ты позавтракал?' }
    ]
  },
  {
    id: 'd17',
    word: '水',
    reading: 'みず',
    meaning: 'Вода',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['напитки', 'еда'],
    examples: [
      { japanese: 'お水を一杯ください。', russian: 'Дайте, пожалуйста, стакан воды.' }
    ]
  },
  {
    id: 'd18',
    word: 'お茶',
    reading: 'おちゃ',
    meaning: 'Зеленый чай',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['напитки', 'еда'],
    examples: [
      { japanese: '温かいお茶はいかがですか？', russian: 'Как насчет горячего зеленого чая?' }
    ]
  },
  {
    id: 'd19',
    word: '林檎',
    reading: 'りんご',
    meaning: 'Яблоко',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['фрукты', 'еда'],
    examples: [
      { japanese: '毎日りんごを食べます。', russian: 'Каждый день ем яблоки.' }
    ]
  },
  {
    id: 'd20',
    word: '肉',
    reading: 'にく',
    meaning: 'Мясо',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['еда'],
    examples: [
      { japanese: '私は肉を食べません。', russian: 'Я не ем мясо.' }
    ]
  },
  {
    id: 'd21',
    word: '卵',
    reading: 'たまご',
    meaning: 'Яйцо',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['еда'],
    examples: [
      { japanese: '朝食には卵が欠かせません。', russian: 'На завтрак яйца незаменимы.' }
    ]
  },
  {
    id: 'd22',
    word: '野菜',
    reading: 'やさい',
    meaning: 'Овощи',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['еда'],
    examples: [
      { japanese: '新鮮な野菜を買いましょう。', russian: 'Давайте купим свежих овощей.' }
    ]
  },
  {
    id: 'd23',
    word: 'パン',
    reading: 'ぱん',
    meaning: 'Хлеб',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['еда'],
    examples: [
      { japanese: '毎朝パンにバターを塗ります。', russian: 'Каждое утро мажу масло на хлеб.' }
    ]
  },
  {
    id: 'd24',
    word: '牛乳',
    reading: 'ぎゅうにゅう',
    meaning: 'Молоко',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['напитки', 'еда'],
    examples: [
      { japanese: '牛乳は体に良いです。', russian: 'Молоко полезно для здоровья.' }
    ]
  },
  {
    id: 'd25',
    word: '酒',
    reading: 'さけ',
    meaning: 'Саке / Алкоголь',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['напитки'],
    examples: [
      { japanese: '日本の伝統的なお酒です。', russian: 'Это традиционный японский алкоголь.' }
    ]
  },

  // Числа и Время (Numbers & Time)
  {
    id: 'd26',
    word: '時間',
    reading: 'じかん',
    meaning: 'Время / Час',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['время'],
    examples: [
      { japanese: '勉強する時間がありません。', russian: 'У меня нет времени учиться.' }
    ]
  },
  {
    id: 'd27',
    word: '今日',
    reading: 'きょう',
    meaning: 'Сегодня',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['время'],
    examples: [
      { japanese: '今日はとても天気がいいですね。', russian: 'Сегодня отличная погода, не правда ли?' }
    ]
  },
  {
    id: 'd28',
    word: '明日',
    reading: 'あした',
    meaning: 'Завтра',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['время'],
    examples: [
      { japanese: '明日は学校が休みです。', russian: 'Завтра в школе выходной.' }
    ]
  },
  {
    id: 'd29',
    word: '昨日',
    reading: 'きのう',
    meaning: 'Вчера',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['время'],
    examples: [
      { japanese: '昨日は映画を見ました。', russian: 'Вчера я смотрел фильм.' }
    ]
  },
  {
    id: 'd30',
    word: '毎月',
    reading: 'まいつき',
    meaning: 'Каждый месяц',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['время'],
    examples: [
      { japanese: '毎月一回、映画館に行きます。', russian: 'Раз в месяц я хожу в кинотеатр.' }
    ]
  },

  // Повседневная жизнь (Daily Life)
  {
    id: 'd31',
    word: '家',
    reading: 'いえ',
    meaning: 'Дом / Жилище',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['дом'],
    examples: [
      { japanese: '私の家は駅から近いです。', russian: 'Мой дом близко от станции.' }
    ]
  },
  {
    id: 'd32',
    word: '学校',
    reading: 'がっこう',
    meaning: 'Школа',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['места'],
    examples: [
      { japanese: '毎日自転車で学校に行きます。', russian: 'Каждый день езжу в школу на велосипеде.' }
    ]
  },
  {
    id: 'd33',
    word: '友達',
    reading: 'ともだち',
    meaning: 'Друг / Друзья',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['люди'],
    examples: [
      { japanese: '明日は友達と遊びます。', russian: 'Завтра я буду гулять с друзьями.' }
    ]
  },
  {
    id: 'd34',
    word: '本',
    reading: 'ほん',
    meaning: 'Книга',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['предметы'],
    examples: [
      { japanese: '図書館で本を借りました。', russian: 'Я одолжил книгу в библиотеке.' }
    ]
  },
  {
    id: 'd35',
    word: '車',
    reading: 'くるま',
    meaning: 'Машина / Автомобиль',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['транспорт'],
    examples: [
      { japanese: '新しい車を買いたいです。', russian: 'Я хочу купить новую машину.' }
    ]
  },
  {
    id: 'd36',
    word: '電車',
    reading: 'でんしゃ',
    meaning: 'Поезд / Электричка',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['транспорт'],
    examples: [
      { japanese: '電車が急に止まりました。', russian: 'Поезд внезапно остановился.' }
    ]
  },
  {
    id: 'd37',
    word: '日本語',
    reading: 'にほんご',
    meaning: 'Японский язык',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['язык'],
    examples: [
      { japanese: '日本語の勉強は面白いです。', russian: 'Изучать японский язык интересно.' }
    ]
  },
  {
    id: 'd38',
    word: '先生',
    reading: 'せんせい',
    meaning: 'Учитель / Профессор',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['люди'],
    examples: [
      { japanese: '田中先生はとても優しいです。', russian: 'Господин Танака (учитель) очень добрый.' }
    ]
  },
  {
    id: 'd39',
    word: '辞書',
    reading: 'じしょ',
    meaning: 'Словарь',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['предметы'],
    examples: [
      { japanese: '電子辞書を使っています。', russian: 'Я пользуюсь электронным словарем.' }
    ]
  },
  {
    id: 'd40',
    word: '切符',
    reading: 'きっぷ',
    meaning: 'Билет (на транспорт)',
    partOfSpeech: 'Существительное',
    jlptLevel: 'N5',
    tags: ['предметы', 'транспорт'],
    examples: [
      { japanese: '電車の切符をなくしました。', russian: 'Я потерял билет на поезд.' }
    ]
  }
];
