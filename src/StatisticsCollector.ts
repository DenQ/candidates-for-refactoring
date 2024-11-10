enum BytePrefix {
  B = 'B',
  K = 'KB',
  M = 'MB',
  G = 'GB',
  T = 'TB',
};
enum ByteSteps {
  B = 1,
  KB = 1_024,
  MB = 1_048_576,
  GB = 1_073_741_824,
  TB = 1_099_511_627_776
};

const determinateTrafficFormat = (traffic: number): BytePrefix => {
  if (traffic < ByteSteps.KB) return BytePrefix.B;
  if (traffic < ByteSteps.MB) return BytePrefix.K;
  if (traffic < ByteSteps.GB) return BytePrefix.M;
  if (traffic < ByteSteps.TB) return BytePrefix.G;

  return BytePrefix.T;
}

const formatTraffic = (traffic: number, format: BytePrefix): string => {
  const byteStepSize = ByteSteps[format];
  const sentTraffic = Number(traffic / byteStepSize).toFixed(1);

  return `${sentTraffic} ${format}`;
}

class UserVideoTrafficFormatter  {
  private videoTraffic= 0;
  private shareVideoTraffic= 0;
  private isAutoFormatTraffic= false;

  constructor(videoTraffic: number, shareVideoTraffic: number, isAutoFormatTraffic: boolean) {
    if (videoTraffic >= 0 && shareVideoTraffic >= 0) {
      this.videoTraffic = videoTraffic;
      this.shareVideoTraffic = shareVideoTraffic;
      this.isAutoFormatTraffic = isAutoFormatTraffic;
    } else {
      throw new Error('Negative traffic values');
    }
  }

  private getFormat(sentTraffic: number): BytePrefix {
    if (!this.isAutoFormatTraffic) return BytePrefix.B;

    return determinateTrafficFormat(sentTraffic);
  }

  public toggleAutoFormatTraffic = () => {
    this.isAutoFormatTraffic = !this.isAutoFormatTraffic;
  }

  public getVideoTraffic(): string {
    const sentVideoTrafficInBytes = this.videoTraffic + this.shareVideoTraffic;
    const format = this.getFormat(sentVideoTrafficInBytes);

    return formatTraffic(sentVideoTrafficInBytes, format);
  }

}

// Comments
// 1. Не ясно как с этим классом работать. Все свойства и методы публичные. Нет конструктора.
// Это может быть опасно. У экземпляра такого класса можно когда угодно и как угодно менять
// свойства - обычно хорошим это не заканчивается. Слишком много свободы.
// Этот класс словно "проходной двор" - "Заходи кто хочешь, бери что хочешь!"
// Философия решения: мне показалось, что этот класс должен просто хранить информацию о тратах трафика
// пользователем и уметь форматно выводить эту информацию. При этом иметь тумблер для переключения
// формата. Таким образом, данные пользователя будут инкапсулированы, а доступ к ним будет через спец
// метод форматного вывода. Так же сам класс стоит облегчить от расчетов. Так же добавить некоторые
// проверки. В итоге останется только 1 публичный метод для получения данных и 1 публичный метод-тумблер.

// 2. Зацепился глаз за TFormatType. Название имеет префикс T, что кажется избыточным. Содержимое типа
// union вдохновило на то, что могут быть и другие размерности кроме 'bytes' | 'Mb' и что enum тут
// "приживется" лучше. И можно будет по ключу получать пороговые значения такие как 1_024 - что повысит
// гибкость

// 3. 'bytes' | 'Mb' - смутило, так как речь о байтах. Байты указываются заглавными буквами. Исправил

// 4. Я решил убрать switch так как логику в нем можно оформить одной функцией из 2-3 строк. Иначе в
// каждом case была бы очень похожая логика. К слову о логике в switch - я увидел простое примитивное
// деление, без вывода размерности и с вероятностью увидеть большое количество цифр после запятой. И
// все это в методе под названием `formatTraffic` - содержимое не очень соответствует названию. После
// такого форматирования придется снова форматировать. :)

// 5. Еще про switch. Я заметил 1_048_576 и решил что нужно это вынести в enum. А иначе это какое-то
// магическое число. Следует избегать таких магических значений. Это засоряет код и усложняет его
// понимание и поддержку. Обычно такие вещи выносят в константы из названия которых становится ясно
// о чем число. И повышается вероятность использования в другом месте.

// 6. Глядя на 1_048_576 стало ясно, что в будущем велика вероятность появления 1_073_741_824 или
// 1_099_511_627_776 и так далее. Тут я утвердился в том, что нужен какой-то enum. И просто добавил
// эти кейсы как пример расширения. Конечно бизнесу сейчас это возможно не нужно, следует исходить из
// задачи. Однако, сегодня МБ да И ГБ никого не удивишь в виде трат, а тут еще и пропущен KB.

// 7. Я так же заметил, что мы можем установить отрицательные значения. Это кажется странным. И может
// привести к нежелательным последствиям с точки зрения бизнеса. Я добавил проверку для этого в
// конструкторе и бросаю исключение в противном случае. Возможно это спасет репутацию

// 8. Всю логику с расчетами я вынес за пределы класса, а сам класс постарался сделать тонким.
// Возможно логику и типы можно будет применить еще где-то в проекте. И конечно же такие простые
// функции проще тестировать

// 9. Выделил функцию formatTraffic. Позаботился о том, чтобы она выводила корректные значения. Формата
// `10.1 MB` или `333.2 GB`. Думаю, что пробел нужен - в большинстве пользовательских утилит он есть.
// Так же урезаю длину после точки до 1 разряда при помощи toFixed(1) - помню что он округляет. Это не
// кажется плохой идеей

// 10. `StatisticsCollector` слишком общее название класса. Не ясно назначение класса. Ясно только что
// он собирает какую-то статистику. Да и к слову статистика слишком громкое слово глядя на содержимое
// класса. Иначе говоря название класса не только не дает понять о чем сущность, но и даже запутывает.
// Поменял на `UserVideoTrafficFormatter` - уверен, что можно придумать лучше название, но теперь ясно
// о чем класс - его основная задача это форматный вывод информации о видео трафике пользователя.
// Его задача не собирать или коллекционировать статистику, а именно отражать трафик конкретного
// пользователя
