// ---shared utils layer---
const getBaseApiUrl = () => {
  return process.env.REACT_APP_API_URL;
}
const getToken = () => localStorage.getItem('token');

const buildHeaders = (headers?: HeadersInit): HeadersInit => {
  const token = getToken();

  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(headers || {}),
    Authorization: `Bearer ${token}`,
    // ....
  };
}
type ID = string;
type HttpClientOptions = {
  headers?: HeadersInit;
}

const httpClient = (options?: HttpClientOptions) => {
  const headers = buildHeaders(options?.headers);

  return {
    update: async <T extends Object>(uri: string, payload: T) : Promise<T | void>=> {
      try {
        const response = await fetch(`${getBaseApiUrl()}${uri}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            payload,
          }),
        });
        if (!response.ok) {
          throw new Error(String(response.status));
        }
        return await response.json();
      } catch (e) {
        if (e === '401') {
          toLoginPage();
        }
        return void '0';
      }
    },
    // also we can make to create other CRUD methods -> `read, create, delete` methods
  }
}


// ---special api layer---
type UserHandlePayload = {
  handle: string;
}
type UserInterestsPayload = {
  interests: ID[];
}
const updateUserHandleAPI = (userId: ID, handle: string) => {
  return httpClient().update<UserHandlePayload>(`/v1/users/${userId}/handle`, { handle });
};
const updateUserInterestsAPI = (userId: ID, uuids: ID[]) => {
  return httpClient().update<UserInterestsPayload>(`/v1/users/${userId}/interests`, {
    interests: uuids
  });
};


// ---actions layer---
const updateUserHandleAction = () => {
  const { userId, handle } = store.get();
  store.set({ userHandleUpdating: true, error: undefined });

  updateUserHandleAPI(userId, handle)
    .then((response) => {
      // ... code
    })
    .catch((error) => {
      // handle error
      store.set({ error: 'Some error occurred' });
    })
    .finally(() => {
      store.set({ userHandleUpdating: false });
    });
}
const updateUserInterestsAction = async () => {
  const { userId, interests } = store.get();

  try {
    store.set({ userInterestsUpdating: true, error: undefined });
    const response = await updateUserInterestsAPI(userId, interests);

    // ... code
  } catch (error) {
    store.set({ error: 'Some error occurred' });
    // show notify about it
  } finally {
    store.set({ userInterestsUpdating: false });
  }
}

// ---view layer---
const SomeComponent = () => {
  return (
    <>
      {isLoggedIn() && <Button ...>}
    </>
  );
}

// Comments
// 1. Первое, что бросилось в глаза - нет централизованного слоя обеспечивающего клиент серверное общение.
// Из-за этого, во всех местах проекта придется писать очень похожий код и если мы захотим что-то поменять
// велика вероятность, что придется менять везде. Это может стоить дорого.
// Для решения этой проблемы я завел httpClient. Который в перспективе будет иметь все необходимые
// методы для CRUD и сопутствующую логику.

// 2. Следом бросилась в глаза логика редиректа на страницу loginPage, если пользователь не авторизован
// - Я думаю, что в этом слое не нужна такая логика. Ей место в слое View как минимум
// - В целом, странно запрещать запросы к апи(со стороны фронта) на основании чего угодно. Бек априори
// должен сам понимать на основе запроса, доступна ли логика этого ендпоинта для данного пользователя/гостя
// и выдать ответ соответствующий ситуации. 20х/404/400/401/403/50х

// 3. Я не видел обработки ошибок.  Если что-то пойдет не так, пользователь не узнает об этом.
// - Добавил проверку на статус ответа. Если 401 тогда редиректа на страницу логина
// - В целом в дальнейшем можно основываться на опциях HttpClientOptions расширив их таким образом, чтобы
// можно было влиять на стратегию поведения при тех или иных случаях

// 4. Так же я не увидел типизации запросов и ожидаемых ответов. Хотелось бы сделать код более
// контролируемым и чтобы IDE подсказывала что мы получаем в ответе. Для этого подарил методу
// httpClient.update дженерики. Теперь из разных мест можно использовать этот метод гибче и надежнее

// 5. Так же я не увидел response.json(). Если не сделать это централизовано, то во многих местах
// использования пришлось бы писать похожий код. А если будем редизайнить систему - то придется о5 же
// во всех местах это менять.

// 6. Логику с isLoggedIn вынес в компонент. На примере кнопки - показываем ее только если пользователь
// авторизован. Возможно есть смысл переименовать эту переменную...

// 7. Так же сильно бросился в глаза дизайн ендпоинтов. Я полагаю, что нам нужно поменять интересы
// только у конкретного пользователя. Или дернуть ручку у конкретного пользователя... В любом случае
// это выглядит подозрительно и как ошибка. После исправления ендпоинты выглядят как по REST.

// 8. Так же я не увидел места использования и решил отобразить слой Acitons. Где мы можем проводить
// разную бизнес логику. К примеру, использовать серию запросов, влиять на состояние стора, ловить ошибки
// и так далее.

// 9. Были мысли добавить mock mode. Но мне показалось меня и так сильно занесло) буду рад обсудить
// разные кейсы

// 10. Получилось больше не как рефакторинг, а скорее как редизайн. Я верю, что так будет хоть и
// не много, но лучше. Можно еще долго улучшать. Сделал на колонке пока так.
