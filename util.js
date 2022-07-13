import _ from 'lodash';

export const getRecRopForSupplyPlant = (singlePlantRecRopSL, setRop, sumOfRecRop) => {
    if((_.min([singlePlantRecRopSL, sumOfRecRop]) - _.sum([setRop])) > 0){
        return _.min([singlePlantRecRopSL, sumOfRecRop]) - _.sum([setRop])
    }else{
        return 1
    }
}

export const getRecMaxLVL = (RecROP, RecLotSize) => {
    return _.max([(RecROP+RecLotSize-1),1])
}

export const getRecLotSize = (EOQ, RVA, recRop) => {
    if(_.round((EOQ/RVA), 0)*EOQ < recRop){
        return _.max([(_.round((recRop/RVA), 0)*RVA), 1])
    }else{
        return _.max([(_.round((EOQ/RVA), 0)*RVA), 1])
    }
}

export const getRecLotSizeDemandPlant = (EOQ, RVA) => {
    
    return _.max([(_.round((EOQ/RVA), 0)*RVA), 1])
    
}
export const getMonetaryImpact = (RecROP, CurROP, MAP) => {

    return ((CurROP-RecROP)*MAP).toFixed(2)
}

export const getFMI = (setROP, curROP, MAP) => {

    return ((curROP-setROP)*MAP).toFixed(2)
}

export const createNewDataSource = (plantData, relatedUserSelectedServiceLevel,relatedUserDefinedData,relatedRecommended) => {
    const newDataSource = defaultData(plantData);

    const reOrderPoint = _.find(newDataSource, {'key':'ReorderPoint'})

    if(reOrderPoint){
      _.set(reOrderPoint, 'userDefined',  relatedUserDefinedData?.inputRop)
      _.set(reOrderPoint, 'current', relatedRecommended?.recRop);
    }

    const maximumStockLevel = _.find(newDataSource, {'key':'MaximumStockLevel'})

    if(maximumStockLevel){
      _.set(maximumStockLevel, 'userDefined',  relatedUserDefinedData?.inputMaxLvL)
      _.set(maximumStockLevel, 'current', relatedRecommended?.recMaxLvl);
    }

    const minimumLotSize = _.find(newDataSource, {'key':'MinimumLotSize'})

    if(minimumLotSize){
      _.set(minimumLotSize, 'userDefined',  relatedUserDefinedData?.inputLotSize)
      _.set(minimumLotSize, 'current', relatedRecommended?.recLotSize);
    }

    newDataSource.push({
      current : plantData?.REC_SL,
      key:"RecommenedSL",
      name: "Recommened SL",
      recommended: plantData?.REC_SL,
      userDefined: relatedUserSelectedServiceLevel?.userSelectedServiceLevel ? relatedUserSelectedServiceLevel?.userSelectedServiceLevel.toString() : plantData?.REC_SL
    })
    _.set(newDataSource, 'comments','-')

    console.log(newDataSource, 'newDataSource');
    return newDataSource
}


export const createNewDataSourceForDestock = (plantData) => {
  const newDataSource = defaultData(plantData);

  const reOrderPoint = _.find(newDataSource, {'key':'ReorderPoint'})

  if(reOrderPoint){
    _.set(reOrderPoint, 'recommended',  0)
    _.set(reOrderPoint, 'current', plantData?.EDAM_REORDER_POINT_QTY);
  }

  const maximumStockLevel = _.find(newDataSource, {'key':'MaximumStockLevel'})

  if(maximumStockLevel){
    _.set(maximumStockLevel, 'recommended',  0)
    _.set(maximumStockLevel, 'current', plantData?.EDAM_MAXIMUM_STOCK_QTY);
  }

  const minimumLotSize = _.find(newDataSource, {'key':'MinimumLotSize'})

  if(minimumLotSize){
    _.set(minimumLotSize, 'recommended',  0);
    _.set(minimumLotSize, 'current', plantData?.MINIMUM_LOT_SIZE);
  }
    
  const roundingValue = _.find(newDataSource, {'key':'RoundingValue'})

  if(roundingValue){
    _.set(roundingValue, 'recommended',  0);
    _.set(roundingValue, 'current', plantData?.EDAM_ROUNDING_VALUE_FOR_PO_QTY);
  }

  newDataSource.push({
    current : plantData?.REC_SL,
    key:"RecommenedSL",
    name: "Recommened SL",
    recommended: 'n/a',
    userDefined: plantData?.REC_SL
  })
    
  _.set(newDataSource, 'comments','-')

  return newDataSource
}

export default function defaultData(data) {

    return [
      {
        key: 'ReorderPoint',
        name: 'Reorder Point',
        current: data.EDAM_REORDER_POINT_QTY||'-',
        recommended: data.CC_REC_ROP || '-',
        userDefined: '-',
      },
      {
        key: 'MaximumStockLevel',
        name: 'Maximum Stock Level',
        current: data.EDAM_MAXIMUM_STOCK_QTY||'-',
        recommended: data.CC_REC_MAX || '-',
        userDefined: '-',
      },
      {
        key: 'MinimumLotSize',
        name: 'Minimum Lot Size',
        current: data.MINIMUM_LOT_SIZE||'-',
        recommended: data.CC_REC_MLS || '-',
        userDefined: '-',
      },
      {
        key: 'RoundingValue',
        name: 'Rounding Value',
        current: data.EDAM_ROUNDING_VALUE_FOR_PO_QTY||'-',
        recommended: data.ROUNDING_VALUE_ADJUSTED||'-',
        userDefined: '-',
      }
    ];
  }
  
