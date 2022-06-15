import React, { useEffect, useState } from 'react';
import { PageHeader, Row, Button } from 'antd';
import { useParams } from 'react-router';
import { useSelector,useDispatch } from 'react-redux';
import  SupplyPlant  from './SupplyPlant/SupplyPlant';
import './MultiPlant.css';
import { Content } from 'antd/lib/layout/layout';
import PropTypes from 'prop-types';
import DemandPlant from './DemanPlant/DemandPlant';
import _ from 'lodash';
import allActions from '../../../actions';
import { createNewDataSource } from './util';
import { createIOTAPayload } from '../MaterialDetails/components/SummaryComponents/Recommendations/Generators';

const MultiPlant = (props) => {
    const { plant, material,mrparea,erp } = useParams();
    const data = useSelector((state) => state.materialDetailsState.material);
    let relatedPlants = useSelector((state) => state.materialDetailsState.plantRelationships);
    const dispatch = useDispatch();
    const [isReset, setReset] = useState(false);
    const userState = useSelector((state) => state.authState?.userDetails);
    const supplyPlantInfo = useSelector((state) => state.multiPlantState.supplyPlantInfo);
    const demandPlantInfo = useSelector((state) => state.multiPlantState.demandPlantInfo);

    const plantData = data?.find(
        (entry) => entry?.PLANT_FACILITY_SAP_ID === plant && entry?.MATERIAL_TYPE_SAP_ID === material
    );

    relatedPlants = _.reduce(relatedPlants?.[plant], (relatedPlants, eachPlant)=>{
        const relatedPlantData = _.find(data, {'PLANT_FACILITY_SAP_ID':eachPlant.Plant_ID })
        if(relatedPlantData){
            relatedPlants.push(relatedPlantData)
        }
        return relatedPlants
    },[]) 

    useEffect(()=>{
        dispatch(allActions.MaterialDetailsActions.fetchMaterial(plant,material,mrparea,erp));
        dispatch(allActions.MaterialDetailsActions.fetchPlantRelationships(plant))
    },[isReset])

    const reset = () => {
        setReset(!isReset)
    }

    const multiPlants = _.concat([],relatedPlants,plantData);

    const SupplyPlantData = _.find(multiPlants, {'PLANT_TYPE':'Supply'});
    const demandPlants = _.filter(multiPlants, {'PLANT_TYPE': 'Demand'});


    const saveRec = () => {
        _.forEach([SupplyPlantData, ...demandPlants], (eachPlant)=>{
            let singlePlantRecRop;
            let userDefined;
            let recommended;
            let plant = eachPlant?.PLANT_FACILITY_SAP_ID;

            if(_.get(eachPlant, 'PLANT_TYPE') === 'Supply'){
                 singlePlantRecRop = _.get(supplyPlantInfo, 'singlePlantRecRop');
                 userDefined = _.get(supplyPlantInfo, 'userDefined');
                 recommended = _.get(supplyPlantInfo, 'recommended');
            }else{
                singlePlantRecRop = _.get(demandPlantInfo, 'singlePlantRecRop');
                userDefined = _.get(demandPlantInfo, 'userDefined');
                recommended = _.get(demandPlantInfo, 'recommended');
            }

            const relatedSinglePlantRecRop = _.get(singlePlantRecRop, `${plant}`);
            const relatedUserDefined = _.get(userDefined, `${plant}`);
            const relatedRecommended = _.get(recommended, `${plant}`);

            if(relatedSinglePlantRecRop && relatedUserDefined && relatedRecommended) {
                const newDataSource = createNewDataSource(_.cloneDeep(eachPlant), relatedSinglePlantRecRop,relatedUserDefined,relatedRecommended);
                const iotaPayload = createIOTAPayload(plant, material, newDataSource, userState, eachPlant);
                console.log(iotaPayload)
                // dispatch(allActions.MaterialDetailsActions.createChangelog(plant, material, mrparea, erp, iotaPayload));
            }
        }) 
    }

    return (
        <>
            <PageHeader
                onBack={props.switchMultiPlant}
                title="MultiPlant"
                extra={[
                    <Button key="2" type="primary" onClick={saveRec}>Accept rec. for all plants</Button>,
                    <Button key="1" onClick={reset}>Reset to initial rec.</Button>
                  ]}
                className="multiplant_header"
            > 
            </PageHeader>
            <div style={{overflow: "scroll"}} id="multi_plant">
                <Content>
                    <Row gutter={6} wrap={false}>
                        <SupplyPlant plantData={SupplyPlantData} relatedPlants={demandPlants}/>
                        {demandPlants.map((eachRelatedPlant, key) => {
                            return <DemandPlant plantData={eachRelatedPlant} MAP={SupplyPlantData?.CC_UNIT_COST_AMT} key={key}></DemandPlant>
                        })}
                    </Row>
                </Content>
            </div>
        </>
    )
}

export default MultiPlant;

MultiPlant.propTypes = {
    switchMultiPlant: PropTypes.func.isRequired
};
