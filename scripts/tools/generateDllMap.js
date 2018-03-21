const fs = require('fs');

module.exports = (outputPath,err) => {
  if(process.env.NODE_ENV === 'development'){
    let dllAliasMap = {}, file;
    fs.readdirSync(outputPath,'utf8').filter(item => {
      if(/pa(\S)+.js$/.test(item) && !/paReactDll/.test(item)){
        return item;
      }
    }).forEach(item => {
      let key = item.split('_')[0];
      dllAliasMap[key] = `h5_commonr/@react_dll/dev_dll/${item}`;
    })
    file = `module.exports=${JSON.stringify(dllAliasMap)}`
    fs.writeFileSync(`${outputPath}/dllAliasMap.js`,file,'utf8')
  }else{
    let dllAliasMap = {}, file;
    fs.readdirSync(outputPath,'utf8').filter(item => {
      if(/pa(\S)+.js$/.test(item) && !/paReactDll/.test(item)){
        return item;
      }
    }).forEach(item => {
      let key = item.split('_')[0];
      dllAliasMap[key] = `./js/${item}`;
    })
    file = `module.exports=${JSON.stringify(dllAliasMap)}`
    fs.writeFileSync(`${outputPath}/dllAliasMap.js`,file,'utf8')
  }
}
