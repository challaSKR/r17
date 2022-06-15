import * as actions from './MultiPlantActionTypes';

const updateSupplyPlantInfo = (supplyPlantInfo) => ({
    type: actions.setRecDetails,
    payload: supplyPlantInfo
})

const updateDemandPlantInfo = (demandPlantInfo) => ({
    type: actions.updateRecDetails,
    payload: demandPlantInfo
})

export default {
    updateSupplyPlantInfo,
    updateDemandPlantInfo
}