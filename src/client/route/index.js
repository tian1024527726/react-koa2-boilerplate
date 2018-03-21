import importDll from '@importDll'

module.exports = {
  path: '/',
  component: require('../app/App'),
  childRoutes: [
    {
      path: 'One',
      component: require('../pages/one/index'),
    }, {
      path: 'Two',
      getComponent(location, cb) {
        require.ensure([],(require) => {
          Promise.all([importDll('paScrollDll')]).then(function(){
            cb(null, require('../pages/two/index'));
          })
        }, 'Two')
      }
    }, {
      path: 'Three',
      getComponent(location, cb) {
        require.ensure([],(require) => {
          Promise.all([importDll('paChartDll')]).then(function(){
            cb(null, require('../pages/three/index'));
          })
        }, 'Three')
      }
    }
  ],
  indexRoute: {
    component: require('../pages/one/index'),
  }
}
