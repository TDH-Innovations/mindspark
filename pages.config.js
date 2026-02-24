export const pagesConfig = {
  Pages: {
    Home: {
      path: '/',
      component: () => import('./src/App.tsx')
    }
  },
  mainPage: 'Home'
}
