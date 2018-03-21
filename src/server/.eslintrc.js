module.exports = {
  env: {
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:node/recommended'
  ],
  plugins: [
    'node'
  ],
  //设置eslint的代码规范
  'rules': {
    //不允许使用var
    'no-var': 1,
    //允许箭头函数省略小括号()
    'arrow-parens': 0,
    //允许使用async、await函数
    'generator-star-spacing': 0,
    //允许使用最新ECMAScript规范
    'node/no-unsupported-features': 0
  }
}
