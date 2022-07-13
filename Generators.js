import _ from 'lodash';

const simulatedToRecommendedMapper = {
  MRPGroup: 'MRP_GROUP',
  ABCIndicator: '',
  MRPType: 'MRP_TYPE_SAP_CD',
  ReorderPoint: 'EDAM_REORDER_POINT_QTY',
  LotSize: 'LOT_SIZE_SAP_CD',
  MinimumLotSize: 'MINIMUM_LOT_SIZE',
  MaximumLotSize: '',
  MaximumStockLevel: 'EDAM_MAXIMUM_STOCK_QTY',
  RoundingValue: '',
  PlantMaterialStatus: '',
  StorageLocation: '',
  MRPController: '',
};
function isNumeric(value) {
   if(/^\d*(\.\d+)?$/.test(value)){
     return value;
   }else{
     return 0;
   }
}
function isValue(value){
  if(/^\d*(\.\d+)?$/.test(value)){
    return parseFloat(value);
  }else if(value=="-"){
    return null;
  }else{
    return 0;
  }
}
function isVal(value){
  if(value=="-"){
    return null;
  }else{
    return value;
  }
}
export const createIOTAPayload = (plant, material, dataSource, user,data) => {
  const changeArray = [];
      changeArray.push({
        [dataSource[0].key+"_OLD"]: isVal(dataSource[0].current),
        [dataSource[0].key+"_NEW"]: isVal(dataSource[0].userDefined),
        [dataSource[1].key+"_OLD"]: isVal(dataSource[1].current),
        [dataSource[1].key+"_NEW"]: isVal(dataSource[1].userDefined),
        [dataSource[2].key+"_OLD"]: isVal(dataSource[2].current),
        [dataSource[2].key+"_NEW"]: isVal(dataSource[2].userDefined),
        [dataSource[3].key+"_OLD"]: isValue(dataSource[3].current),
        [dataSource[3].key+"_NEW"]: isValue(dataSource[3].userDefined),
        //[dataSource[4].key+"_OLD"]: dataSource[4].current,
        [dataSource[4].key+"_NEW"]: dataSource[4].userDefined,
        ["BASE_UNIT_OF_MEASURE_SAP_ID"]:data?.BASE_UNIT_OF_MEASURE_SAP_ID,
        ["COMMENTS"]:dataSource["comments"],
        ["MONITORY_IMPACT"]: (parseFloat(isNumeric(dataSource[0].current))-parseFloat(isNumeric(dataSource[0].userDefined)))*parseFloat(isNumeric(data?.CC_UNIT_COST_AMT)),
        ["MONITORY_IMPACT_INDICATOR"] :(parseFloat(isNumeric(dataSource[0].current))-parseFloat(isNumeric(dataSource[0].userDefined)))*parseFloat(isNumeric(data?.CC_UNIT_COST_AMT)) <0 ? "Investment":(parseFloat(isNumeric(dataSource[0].current))-parseFloat(isNumeric(dataSource[0].userDefined)))*parseFloat(isNumeric(data?.CC_UNIT_COST_AMT)) >0 ? "Reduction" :"No Impact",
        ["CURRENCY"]:data?.COMPANY_CURRENCY_SAP_CD,
        ["UNIT_COST"]:data?.CC_UNIT_COST_AMT,
        ["TOTAL_STOCK"]:isValue(data?.EDAM_VALUATED_UNRESTRICTED_USE_STOCK_QTY)
    })
  const changeObject = {
    plant,
    material,
    changedBy: user?.uid,
    changedByEmail: user?.mail,
    changes: changeArray,
  };
  return changeObject;
};

export const createIOTAPayloadForBulkAPI = (plant, material, dataSource,data) => {
      const changeObject = {
        [dataSource[0].key+"_OLD"]: isVal(dataSource[0].current),
        [dataSource[0].key+"_NEW"]: isVal(dataSource[0].recommended),
        [dataSource[1].key+"_OLD"]: isVal(dataSource[1].current),
        [dataSource[1].key+"_NEW"]: isVal(dataSource[1].recommended),
        [dataSource[2].key+"_OLD"]: isVal(dataSource[2].current),
        [dataSource[2].key+"_NEW"]: isVal(dataSource[2].recommended),
        [dataSource[3].key+"_OLD"]: isValue(dataSource[3].current),
        [dataSource[3].key+"_NEW"]: isValue(dataSource[3].recommended),
        [dataSource[4].key+"_NEW"]: dataSource[4].recommended,
        ["BASE_UNIT_OF_MEASURE_SAP_ID"]:data?.BASE_UNIT_OF_MEASURE_SAP_ID,
        ["COMMENTS"]:dataSource["comments"],
        ["MONITORY_IMPACT"]: (parseFloat(isNumeric(dataSource[0].current))-parseFloat(isNumeric(dataSource[0].recommended)))*parseFloat(isNumeric(data?.CC_UNIT_COST_AMT)),
        ["MONITORY_IMPACT_INDICATOR"] :(parseFloat(isNumeric(dataSource[0].current))-parseFloat(isNumeric(dataSource[0].recommended)))*parseFloat(isNumeric(data?.CC_UNIT_COST_AMT)) <0 ? "Investment":(parseFloat(isNumeric(dataSource[0].current))-parseFloat(isNumeric(dataSource[0].recommended)))*parseFloat(isNumeric(data?.CC_UNIT_COST_AMT)) >0 ? "Reduction" :"No Impact",
        ["CURRENCY"]:data?.COMPANY_CURRENCY_SAP_CD,
        ["UNIT_COST"]:data?.CC_UNIT_COST_AMT,
        ["TOTAL_STOCK"]:isValue(data?.EDAM_VALUATED_UNRESTRICTED_USE_STOCK_QTY),
        plant,
        material,
        mrparea: data?.MRP_AREA_SAP_ID,
        erp: data?.ERP_CD
    }
  return changeObject;
};


export const createSapPayload = (dataSource) => {
  const payload = {};
  dataSource.forEach((source) => {
    if (source.userDefined !== '-') {
      payload[source.key] = source.userDefined;
    }
  });
  return payload;
};

export const addSimulatedToDataSource = (dataSource, simulatedValues) => {
  const newDataSource = _.clone(dataSource);
  dataSource.forEach((value, index) => {
    newDataSource[index].simulated = simulatedValues[simulatedToRecommendedMapper[value.key]];
  });
  return newDataSource;
};
