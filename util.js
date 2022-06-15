export const createNewDataSource = (plantData, relatedSinglePlantRecRop,relatedUserDefinedData,relatedRecommended) => {
    const newDataSource = defaultData(plantData);
    _.set(newDataSource[0], 'current', plantData?.CC_REC_ROP);
    _.set(newDataSource[0], 'userDefined', relatedUserDefinedData?.inputRop);
    _.set(newDataSource[0], 'recommended', relatedRecommended?.recRop);
    newDataSource.push({
      current : plantData?.REC_SL,
      key:"RecommendedSL",
      name: "Recommended SL",
      recommended: 'n/a',
      userDefined: relatedSinglePlantRecRop?.singlePlantRecRop ? relatedSinglePlantRecRop?.singlePlantRecRo : plantData?.REC_SL
    })
    newDataSource["comments"] = "-";
    return newDataSource
}
