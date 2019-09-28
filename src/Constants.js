export const status = {
  error: -1,
  ok: 200,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
}

export const preferences = {
  cookie: {
    name: 'browsify-preferences',
    separator: '|',
  },
  hidden: {
    name: 'showHidden',
    displayName: 'Hidden',
  },
  protected: {
    name: 'showProtected',
    displayName: 'Protected',
  },
}
