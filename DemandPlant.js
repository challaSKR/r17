import React, { useEffect, useState } from 'react';
import { Col, Card, Descriptions, InputNumber, Space, Row, Alert } from 'antd';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import MultiPlantRecommendations from '../MultiPlantRecommondations/MultiPlantRecommendations';
import allActions from '../../../../actions';
import { getFMI, getMonetaryImpact, getRecLotSizeDemandPlant, getRecMaxLVL } from '../util';
import _ from 'lodash';
import '../MultiPlant.css';

const DemandPlant = (props) => {
    const { plantData, MAP: SupplyPlantMAP } = props;
    const EOQ = _.get(plantData, 'CC_ECONOMIC_ORDER_BASE_UOM_QTY');
    const roundingValue = _.get(plantData, 'EDAM_ROUNDING_VALUE_FOR_PO');
    const map = _.get(plantData, 'CC_UNIT_COST_AMT');
    const currentRop = _.get(plantData, 'EDAM_REORDER_POINT_QTY');

    const dispatch = useDispatch();
    const [singlePlantRecRop, setSinglePlantRecRop] = useState();
    const [recRop, setRecRop] = useState();
    const [inputRop, SetInputRop] = useState(currentRop);
    const [inputMaxLvL, setInputMaxLvl] = useState(null);
    const [inputLotSize, setInputLotSize] = useState(null);
    const [recLotSize, setRecLotSize] = useState(getRecLotSizeDemandPlant(EOQ, roundingValue));
    const [recMaxLvl, setRecMaxLvl] = useState(getRecMaxLVL(recRop, recLotSize));

    useEffect(() => {
        dispatch(allActions.MultiPlantActions.updateDemandPlantInfo({ "userDefined" : {[plantData?.PLANT_FACILITY_SAP_ID]: { inputRop, inputLotSize, inputMaxLvL }}}));
    }, [inputRop, inputLotSize, inputMaxLvL]);

    useEffect(() => {
        dispatch(allActions.MultiPlantActions.updateDemandPlantInfo({ "recommended": {[plantData?.PLANT_FACILITY_SAP_ID]: { recRop: currentRop, recLotSize, recMaxLvl } }}));
    }, []);

    const changeDefaultSelectedSL = (singlePlantRecRop) => {
        setSinglePlantRecRop(singlePlantRecRop);
        setRecRop(singlePlantRecRop);
        dispatch(allActions.MultiPlantActions.updateDemandPlantInfo({"singlePlantRecRop":{ [plantData?.PLANT_FACILITY_SAP_ID]: { singlePlantRecRop } }}))
    }

    const changeUserSelectedSL = (singlePlantRecRop) => {
        setSinglePlantRecRop(singlePlantRecRop);
        setRecRop(singlePlantRecRop);
        dispatch(allActions.MultiPlantActions.updateDemandPlantInfo({"singlePlantRecRop":{ [plantData?.PLANT_FACILITY_SAP_ID]: { singlePlantRecRop } }}))
    }

    const monetaryImpact = getMonetaryImpact(recRop, currentRop, SupplyPlantMAP);

    const finalMonetaryImpact = getFMI(recRop, currentRop, SupplyPlantMAP);

    const onChangeValues = name => value => {
        switch (name) {
            case 'inputRoP':
                SetInputRop(value);
                break;
            case 'inputLotSize': {
                setRecLotSize(value);
                setInputLotSize(value);
                break;
            }
            case 'inputMaxLvL': {
                setRecMaxLvl(value);
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
                    <Card size='small' title={`${plantData?.PLANT_TYPE}: ${plantData?.PLANT_FACILITY_SAP_ID} (${plantData?.PLANT_FACILITY_SAP_NM})`}>
                        <Space direction="vertical" size="small" style={{ display: 'flex' }}>
                            <Descriptions title="General Information" layout='horizontal' bordered column={1} size="small" labelStyle={{ width: "50%" }}>
                                <Descriptions.Item label="Map">{map}</Descriptions.Item>
                                <Descriptions.Item label="MRP area MRP type">{plantData?.MRP_TYPE_SAP_CD}
                                </Descriptions.Item>
                                <Descriptions.Item label="SAP Critical Part Indicator">{plantData?.CRITICAL_PART_IND}
                                </Descriptions.Item>
                                <Descriptions.Item label="IOTA Critical Flag">{plantData?.CRITICALITY_IND}
                                </Descriptions.Item>
                                <Descriptions.Item label="Advanced CI">{plantData?.CC_MAX_CRITICALITY}
                                </Descriptions.Item>
                                <Descriptions.Item label="Rec. Service Level">{plantData?.RECOMMENDED_SERVICE_LEVEL}
                                </Descriptions.Item>
                                <Descriptions.Item label="BOM Qty">{plantData?.CC_MAX_BOM_QTY}
                                </Descriptions.Item>
                                <Descriptions.Item label="Single Plant Rec. ROP">{singlePlantRecRop}</Descriptions.Item>
                                <Descriptions.Item label="Rounding Value">{plantData?.EDAM_ROUNDING_VALUE_FOR_PO}
                                </Descriptions.Item>
                                <Descriptions.Item label="Current RoP">{currentRop}
                                </Descriptions.Item>
                            </Descriptions>
                            <MultiPlantRecommendations data={plantData} isEditable={true} isSupplyPlant={false}
                                changeDefaultSelectedSL={changeDefaultSelectedSL} changeUserSelectedSL={changeUserSelectedSL}>
                            </MultiPlantRecommendations>
                            <Descriptions layout='horizontal' bordered column={1} size="small" labelStyle={{ width: "50%" }}>
                                <Descriptions.Item label="Rec. ROP">
                                    <Row justify="space-evenly">
                                        <Col span={8}>{recRop}</Col>
                                        <Col span={8} className='plant_input'><InputNumber name='inputRoP' defaultValue={inputRop} placeholder='set Rec. Rop' onChange={onChangeValues("inputRoP")}></InputNumber></Col>
                                    </Row>
                                </Descriptions.Item>
                                <Descriptions.Item label="Rec. Lot size">
                                    <Row>
                                        <Col span={8}>{recLotSize}</Col>
                                        <Col span={8} className='plant_input'><InputNumber name='inputLotSize' placeholder='set Input Lot Size' onChange={onChangeValues("inputLotSize")}></InputNumber></Col>
                                    </Row>
                                </Descriptions.Item>
                                <Descriptions.Item label="Rec. Max level">
                                    <Row>
                                        <Col span={8}>{recMaxLvl}</Col>
                                        <Col span={8} className='plant_input'><InputNumber name='inputMaxLvL' placeholder='set Rec. Max Level' onChange={onChangeValues("inputMaxLvL")}></InputNumber></Col>
                                    </Row>
                                </Descriptions.Item>
                            </Descriptions>
                            <Descriptions layout='horizontal' bordered column={1} size="small" labelStyle={{ width: "50%" }}>
                                <Descriptions.Item label=" Monetary impact">{monetaryImpact}
                                </Descriptions.Item>
                                <Descriptions.Item label="Final Monetary Impact">
                                    {finalMonetaryImpact}
                                </Descriptions.Item>
                            </Descriptions>
                            {plantData?.CC_MAX_BOM_QTY > recRop && <Alert
                                description="Max BOM qty > Recommeded ROP"
                                type="error"
                            />}
                        </Space>
                    </Card>
                </Col>
            }
        </>
    )
}

export default DemandPlant;

DemandPlant.propTypes = {
    plantData: PropTypes.object.isRequired,
    MAP: PropTypes.object.isRequired
};