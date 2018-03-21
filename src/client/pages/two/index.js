import React from 'react';
import ProtocolPage from 'ProtocolPage';
import ProductDetail from '../../../../mock/productDetail';

class Two extends React.Component {
  constructor(props){
    super(props);
  }
  getProtocolData(){
    let ProtocolData = [];
    ProductDetail.responseData.annexationList[0].list.forEach(item => {
      let itemData = {};
      itemData['title'] = item.name;
      itemData['href'] = item.content;
      itemData['hasArrow'] = item.infoType == '02';
      ProtocolData.push(itemData);
    })
    return ProtocolData
  }

  render(){
    return (
      <ProtocolPage data={this.getProtocolData()}></ProtocolPage>
    )
  }
}

export default Two
