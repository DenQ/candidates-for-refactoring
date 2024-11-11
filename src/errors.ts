const hasNotFoundStatus = (response: Response) => {
  return response.status === HttpStatusCode.NOT_FOUND_404;
};

const hasForbiddenStatus = (response: Response) => {
  return response.status === HttpStatusCode.FORBIDDEN_403;
};

const hasServiceUnavailableStatus = (response: Response) => {
  return response.status === HttpStatusCode.FORBIDDEN_503;
};

// Тут почти все ок!
// Инкапсуляция библиотеки открывает шанс скрыть низко уровневую реализацию
// и в случае чего легко заменить библиотеку на другую. Иначе придется во всех местах использования
// старой библиотеки менять как минимум импорты этой библиотеки на другую - это может оказаться дорого
// и трудно
