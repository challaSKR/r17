export const createNewDataSource(plantData, singlePlantRecRop,userDefinedData,recommended) {
    const newDataSource = defaultData(plantData);
    newDataSource.push({
      current : plantData?.REC_SL,
      key:"RecommendedSL",
      name: "Recommended SL",
      recommended: 'n/a',
      userDefined: singlePlantRecRop ? singlePlantRecRop : plantData?.REC_SL
    })
    newDataSource["comments"]="-";
    return newDataSource
}
