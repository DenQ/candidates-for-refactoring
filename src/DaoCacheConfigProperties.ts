type DaoCacheConfig = {
  ALIVE_CACHE_TIME: number; // in days
  MAX_ELEMENTS: number; // maximum elements in cache
}

export const DevelopCacheConfig: DaoCacheConfig = {
  ALIVE_CACHE_TIME: 123,
  MAX_ELEMENTS: 456,
}

// 1. Не ясно зачем тут класс... Можно просто обойтись обычным объектом.

// 2. Имена свойств очень уж обобщенные

// 3. Ну и сам объект конфига можно типизировать

// 4. Именование ключей конфигов в той или иной нотации - дело вкуса.
// Я привык, что они в верхнем регистре с подчеркиваниями. Но это совсем не критично
