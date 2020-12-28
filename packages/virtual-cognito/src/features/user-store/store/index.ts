type User = {
  readonly isInvalid?: boolean;
  readonly username: string;
  readonly password: string;
};

type Store = {
  [key: string]: User;
};

type IsValidCredentialsInput = {
  readonly store: Store;
  readonly username: string;
  readonly password: string;
};

const INVALID_USER = { isInvalid: true, username: ``, password: `` };

const createStore = (): Store => ({
  [`jearle@rcanalytics.com`]: {
    username: `jearle@rcanalytics.com`,
    password: `=Z9-xW%7`,
  },
});

const isValidCredentials = ({
  store,
  username,
  password,
}: IsValidCredentialsInput): boolean => {
  const user = store[username];

  if (user && user.password === password) return true;

  return false;
};

const userStore = ({ store }) => ({
  getValidatedUser({ username, password }: User): User {
    if (isValidCredentials({ store, username, password }))
      return store[username];

    return { ...INVALID_USER };
  },

  createUser({ username, password }: User): User {
    if (store[username]) {
      throw Error(`User already exits`);
    }

    const newUser = {
      username,
      password,
    };

    store[username] = newUser;

    return newUser;
  },
});

export type UserStore = ReturnType<typeof userStore>;

export const createUserStore = (): UserStore => {
  const store = createStore();

  return userStore({ store });
};
