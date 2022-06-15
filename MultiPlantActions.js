import * as actions from './MultiPlantActionTypes';

const updateSupplyPlantInfo = (supplyPlantInfo) => ({
    type: actions.updateSupplyPlantInfo,
    payload: supplyPlantInfo
})

const updateDemandPlantInfo = (demandPlantInfo) => ({
    type: actions.updateDemandPlantInfo,
    payload: demandPlantInfo
})

export default {
    updateSupplyPlantInfo,
    updateDemandPlantInfo
}
