import * as  multiplantActionTypes from '../actions/MultiPlantDomain/MultiPlantActionTypes';

const initialState = {
  "supplyPlant":{
    "userDefined": [],
    "recommended": [],
    "singlePlantRecRop": [],
    "userSelectedServiceLevel": []
  },
  "demandPlants": {
    "userDefined": [],
    "recommended": [],
    "singlePlantRecRop": [],
    "userSelectedServiceLevel": []
  }
}

export default function multiPlantReducer(state=initialState, action) {

  switch (action.type) {
    case multiplantActionTypes.updateSupplyPlantInfo:
      return {
        ...state,
        supplyPlant: {
          ...state.supplyPlant,
          "userDefined": {
            ...state.supplyPlant.userDefined,
            ...action.payload.userDefined
          },
          "recommended": {
            ...state.supplyPlant.recommended,
            ...action.payload.recommended
          },
          "singlePlantRecRop":{
            ...state.supplyPlant.singlePlantRecRop,
            ...action.payload.singlePlantRecRop
          },
          "userSelectedServiceLevel": {
            ...state.supplyPlant.userSelectedServiceLevel,
            ...action.payload.userSelectedServiceLevel
          }
        }
      }
    case multiplantActionTypes.updateDemandPlantInfo:
      return {
        ...state,
        demandPlants: {
          ...state.demandPlants,
          "userDefined": {
            ...state.demandPlants.userDefined,
            ...action.payload.userDefined
          },
          "recommended": {
            ...state.demandPlants.recommended,
            ...action.payload.recommended
          },
          "singlePlantRecRop":{
            ...state.demandPlants.singlePlantRecRop,
            ...action.payload.singlePlantRecRop
          },
          "userSelectedServiceLevel": {
            ...state.demandPlants.userSelectedServiceLevel,
            ...action.payload.userSelectedServiceLevel
          }
        }
      }
    case multiplantActionTypes.resetMultiPlantState:
      return initialState;
    default:
      return state;
  }
}