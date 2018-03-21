// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    //es6的module模式
    sourceType: "module"
  },
  'rules': {
    //允许箭头函数可以省略小括号
    'arrow-parens': 0,
    //允许使用async-await函数
    'generator-star-spacing': 0,
    //在开发环境开启debugger功能,生产环境禁止使用debugger
    'no-debugger': process.env.NODE_ENV === 'development' ? 0 : 2
  }
}
