import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Col, Descriptions,InputNumber,Space,Row,Alert } from 'antd';
import PropTypes from 'prop-types';
import '../MultiPlant.css';
import _ from 'lodash';
import MultiPlantRecommendations from '../MultiPlantRecommondations/MultiPlantRecommendations';
import { getRecRopForSupplyPlant, getRecLotSize, getMonetaryImpact, getRecMaxLVL, getFMI } from '../util';

const SupplyPlant = (props) => {

    const { plantData, relatedPlants } = props;
    const iotaCriticalFlag = _.find(relatedPlants, ['CRITICALITY_IND', 'Y']) ? 'Yes' : 'No';
    const maxAdvancedCI = _.maxBy(relatedPlants, 'CC_MAX_CRITICALITY');
    const maxRecommendedServiceLvL = _.maxBy(relatedPlants, 'RECOMMENDED_SERVICE_LEVEL');
    const maxBOMQnty = _.maxBy(relatedPlants, 'CC_MAX_BOM_QTY');
    const EOQ = _.get(plantData, 'CC_ECONOMIC_ORDER_BASE_UOM_QTY');
    const roundingValue = _.get(plantData, 'EDAM_ROUNDING_VALUE_FOR_PO');
    const map = _.get(plantData, 'CC_UNIT_COST_AMT');
    const currentRop = _.get(plantData, 'EDAM_REORDER_POINT_QTY');
    const [singlePlantRecRop, setSinglePlantRecRop] = useState(null);
    const [recRop, setRecRop] = useState(0);
    const demandPlants = useSelector((state) => state.multiPlantState.demandPlants);
    const setInputRopFromDemandPlants = _.map(_.values(_.get(demandPlants, 'userDefined')), 'inputRop');
    const sumOfSinglePlantRecRop = _.sum(_.map(_.values(_.get(demandPlants, 'singlePlantRecRop')), 'singlePlantRecRop'));
    const sumOfSetRoP = _.sum(setInputRopFromDemandPlants);
    const [recLotSize,setRecLotSize] = useState(getRecLotSize(EOQ, roundingValue, recRop));
    const [recMaxLvl, setRecInputMaxLvL] = useState(getRecMaxLVL(recRop, recLotSize));
    const monetaryImpact = getMonetaryImpact(recRop, plantData?.EDAM_REORDER_POINT_QTY, map);
    const finalMonetaryImpact = getFMI(recRop, plantData?.EDAM_REORDER_POINT_QTY, map);
    const [inputRop, setInputRop] = useState(null);
    const [inputMaxLvL,setInputMaxLvl] = useState(null);
    const [inputLotSize, setInputLotSize] = useState(null);


    useEffect(() => {
        dispatch(allActions.MultiPlantActions.updateSupplyPlantInfo({ "userDefined" : {[plantData?.PLANT_FACILITY_SAP_ID]: { inputRop, inputLotSize, inputMaxLvL }}}));
    }, [inputRop, inputLotSize, inputMaxLvL]);

    useEffect(() => {
        dispatch(allActions.MultiPlantActions.updateSupplyPlantInfo({ "recommended": {[plantData?.PLANT_FACILITY_SAP_ID]: { recRop: currentRop, recLotSize, recMaxLvl } }}));
    }, []);
    
    useEffect(() => {
        setRecRop(getRecRopForSupplyPlant(singlePlantRecRop, sumOfSetRoP, sumOfSinglePlantRecRop));
    }, [sumOfSetRoP,demandPlants,setInputRopFromDemandPlants])

    const changeDefaultSelectedSL = (recRop) => {
        setSinglePlantRecRop(recRop);
        dispatch(allActions.MultiPlantActions.updateSupplyPlantInfo({"singlePlantRecRop":{ [plantData?.PLANT_FACILITY_SAP_ID]: { singlePlantRecRop } }}))
    }

    const changeUserSelectedSL = (userSelectedSL) => {
        setSinglePlantRecRop(userSelectedSL);
        dispatch(allActions.MultiPlantActions.updateSupplyPlantInfo({"singlePlantRecRop":{ [plantData?.PLANT_FACILITY_SAP_ID]: { singlePlantRecRop } }}))
    }

    const onChangeValues = name => value =>  {
        switch (name) {
            case 'recRop':{
                setRecRop(value);
                setInputRop(value);
                break;
            }
            case 'inputLotSize':{
                setRecLotSize(value);
                setInputLotSize(value);
                break;
            }
            case 'inputMaxLvL':{
                setRecInputMaxLvL(value);
                setInputMaxLvl(value);
                break;
            }
            case 'default':
                break;
        }
    }

    return (
        <>
            {plantData &&
                <Col className="gutter-row" span={8} key={plantData?.PLANT_TYPE}>
                    <Card style={{ background: "#ccddff" }} size='small' title={`${plantData?.PLANT_TYPE}: ${plantData?.PLANT_FACILITY_SAP_ID} (${plantData?.PLANT_FACILITY_SAP_NM})`}>
                    <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                        <Descriptions title="General Information" layout='horizontal' bordered column={1} size="small" labelStyle={{ background: "#ccddff", width: "50%" }}>
                            <Descriptions.Item label="Map">{map
                            }</Descriptions.Item>
                            <Descriptions.Item label="MRP area MRP type">{plantData?.MRP_AREA_SAP_CD}</Descriptions.Item>
                            <Descriptions.Item label="SAP Critical Part Indicator">{plantData?.CRITICALITY_IND}</Descriptions.Item>
                            <Descriptions.Item label="IOTA Critical Flag Offshore">{iotaCriticalFlag}</Descriptions.Item>
                            <Descriptions.Item label="Max Advanced CI Offshore">{maxAdvancedCI?.CC_MAX_CRITICALITY}</Descriptions.Item>
                            <Descriptions.Item label="Max Rec. Service Level offshore">{maxRecommendedServiceLvL?.RECOMMENDED_SERVICE_LEVEL
                            }</Descriptions.Item>
                            <Descriptions.Item label="Max BOM Qty offshore">{maxBOMQnty?.CC_MAX_BOM_QTY}</Descriptions.Item>
                            <Descriptions.Item label="Single Plant Rec. ROP">{singlePlantRecRop}</Descriptions.Item>
                            <Descriptions.Item label="Rounding Value">{roundingValue
                            }</Descriptions.Item>
                            <Descriptions.Item label="Current RoP">{currentRop}
                            </Descriptions.Item>
                        </Descriptions>
                        <MultiPlantRecommendations data={plantData} isEditable={true}
                            changeDefaultSelectedSL={changeDefaultSelectedSL} changeUserSelectedSL={changeUserSelectedSL}
                            isSupplyPlant={true}
                            >
                        </MultiPlantRecommendations>
                        <Descriptions layout='horizontal' bordered column={1} size="small" labelStyle={{ background: "#ccddff", width: "50%" }}>
                        <Descriptions.Item  label="Rec. ROP">
                                <Row justify="space-evenly">
                                    <Col  span={8}>{recRop}</Col>
                                    <Col  span={8}><InputNumber name='recRop' placeholder='set Rec. Rop' onChange={onChangeValues("recRop")}></InputNumber></Col>
                                </Row>
                        </Descriptions.Item>
                            <Descriptions.Item label="Rec. Lot size">
                                <Row justify="space-evenly">
                                    <Col  span={8}>{recLotSize}</Col>
                                    <Col  span={8}><InputNumber name='inputLotSize' placeholder='set Input Lot Size' onChange={onChangeValues("inputLotSize")}></InputNumber></Col>
                                </Row>
                            </Descriptions.Item>
                            <Descriptions.Item label="Rec. Max level">
                                <Row justify="space-evenly">
                                    <Col  span={8}>{recMaxLvl}</Col>
                                    <Col  span={8}><InputNumber name='inputMaxLvL' placeholder='set Rec. Max Level' onChange={onChangeValues("inputMaxLvL")}></InputNumber></Col>
                                </Row>
                            </Descriptions.Item> 
                        </Descriptions>
                        <Descriptions layout='horizontal' bordered column={1} size="small" labelStyle={{ background: "#ccddff", width: "50%" }}>
                        <Descriptions.Item label=" Monetary impact">{monetaryImpact}</Descriptions.Item>
                            <Descriptions.Item label="Final Monetary Impact">
                                {finalMonetaryImpact}
                            </Descriptions.Item>
                        </Descriptions>
                        {_.some(setInputRopFromDemandPlants, (eachDemandPlant)=>{
                                if(_.get(eachDemandPlant, 'inputRop') > recRop){
                                    return true
                                }
                            }) && <Alert
                        description="Supply Plant rec. RoP < than demand plants set RoP"
                        type="error"
                        />}
                        </Space>
                    </Card>
                </Col>
            }
        </>
    )
}

export default SupplyPlant;

SupplyPlant.propTypes = {
    plantData: PropTypes.object.isRequired,
    relatedPlants: PropTypes.object.isRequired
};
