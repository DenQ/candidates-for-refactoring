enum UserRoles {
  Admin = 'admin',
  Moderator = 'moderator',
  User = 'user',
}
enum UserInterests {
  Reading = 'reading',
  Racing = 'racing',
  Traveling = 'traveling',
}

type UserInfo = {
  name: string,
  age: number,
  address: string,
  phoneNumber: string,
  email: string,
  role: UserRoles,
  isActive: boolean,
  isVerified: boolean,
  isPremium: boolean,
  lastLoginDate?: number,
  registrationDate: number,
  profilePicture: string,
  bio: string,
  interests: UserInterests[]
}

class UserPresenter {
  userInfo: UserInfo;

  constructor(userInfo: UserInfo) {
    this.userInfo = userInfo
  }

  getUserName(): string {
    return this.userInfo.name;
  }

  getUserAvatar(): string {
    if (this.userInfo.isPremium) {
      return decoratePhotoWithVIPLabel(this.userInfo.profilePicture);
    }

    return this.userInfo.profilePicture;
  }

  // ... (other methods)
}

// 1. Название класса было слишком общим - дал более подходящее название.
// Это название лучше отражает назначение класса
// PS. Были мысли насчет модели - если будет нужно, раскрою тему...

// 2. Достаточно объёмные "портянки" с полями - такое тяжело поддерживать и ухаживать
// Инкапсулировал эти поля в одно свойство которое прежде типизировал. Теперь если нужно будет
// поменять набор полей, достаточно будет сделать это в одном месте. Методы конечно тоже придется менять,
// но их и раньше тоже пришлось бы менять

// 3. Роль и интересы пользователя указаны как строка и массив строк соотвественно.
// Что в общем-то не так уж и плохо. Но не очень надежно. Завел enums для большего контроля

// 4. lastLogin - не отражает в полной мере свое назначение. И так же смущает тип.
// Предпочитаю использовать timestamp для дат и времени. Конечно, СУБД умеют индексировать даты, но
// с числами значительно проще в плане сортировок. Как минимум они точнее :)
// И конечно же это поле может быть опциональным, так как факт регистрации пользователя в системе не
// гарантирует его визит в систему(он может просто не захотеть зайти)
