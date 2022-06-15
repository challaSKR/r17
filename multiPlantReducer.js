import * as  multiplantActionTypes from '../actions/MultiPlantDomain/MultiPlantActionTypes';

const initialState = {
  "supplyPlant":{
    "userDefined": [],
    "recommended": [],
    "singlePlantRecRop": []
  },
  "demandPlants": {
    "userDefined": [],
    "recommended": [],
    "singlePlantRecRop": []
  }
}

export default function multiPlantReducer(initialState, action) {

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
          }
        }
      }
    default:
      return state;
  }
}
