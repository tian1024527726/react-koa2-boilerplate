const name = 'My_project';

//pm2的配置参数
module.exports = {
  name: name,
  script: 'main.js',
  cwd: `${process.cwd()}/dist/${name}/server`,
  instances: '2',
  exec_mode: 'cluster',
  max_memory_restart: '1G',
  'autorestart': true,
  'out_file': '../log/server.log',
  'error_file': '../log/error.log',
  'merge_logs': true,
  'env_testing': {
    'PORT': 2334,
    'NODE_ENV': 'testing'
  },
  'env_production': {
    'PORT': 2334,
    'NODE_ENV': 'production'
  }
}
