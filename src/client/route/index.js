import importDll from '@importDll'

module.exports = {
  path: '/',
  component: require('../app/App'),
  childRoutes: [
    {
      path: 'HomePage',
      getComponent(location, cb) {
        require.ensure([], (require) => {
          Promise.all([]).then(function () {
            cb(null, require('../pages/HomePage'));
          })
        }, 'HomePage')
      }
    }
  ],
  indexRoute: {
    getComponent(location, cb) {
      require.ensure([], (require) => {
        Promise.all([]).then(function () {
          cb(null, require('../pages/HomePage'));
        })
      }, 'HomePage')
    }
  }
};
