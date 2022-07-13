import { Button } from 'antd';
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmModal from '../../../Common/ConfirmModal';
import allActions from '../../../../actions';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
//import {createNewDataSourceForBulkApproval} from '../../MultiPlant/util';
//import { createIOTAPayloadForBulkApproval } from '../../MaterialDetails/components/SummaryComponents/Recommendations/Generators';

const DestockRecForSelectedMaterils = (props) => {

    const selectedItems = _.get(props, 'selectedMaterials', []);
    const [confirmationData, setConfirmationData] = useState({});
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.authState?.userDetails);

    const desctockRec = () => {
        let selectedMaterials = _.cloneDeep(selectedItems);
        let changeLogPayload = [];
        setConfirmationVisible(false);
        selectedMaterials = _.map(selectedMaterials, eachMaterial => _.extend({reviewdBy: authState?.uid}, eachMaterial));
        _.forEach(selectedMaterials, (eachPlantMaterial)=>{
            //need to check which data needs to passed to 
            //changeLogPayload.push(iotaPayload);
        })
        const destockPayaload = {changes: changeLogPayload, changedBy: authState?.uid, changedByEmail: authState?.mail}
        //dispatch(allActions.MaterialDetailsActions.bulkApprove(bulkApprovePayload));
      };

    const confirmData = {
        desctockRec: {
            message: 'Are you sure you want to destock rec. for all selected materials?',
            title: 'Destock Recommendations',
            onOK: desctockRec,
        }
    };

    const openReviewConfirmationModal = () => {
        setConfirmationData(confirmData?.desctockRec);
        setConfirmationVisible(true)
    }

    return (
        <>
            <Button
                type="primary"
                className="matlist-button"
                onClick={() => openReviewConfirmationModal()}
            >
                Destock Rec
            </Button>

            {
                confirmationVisible
                    ? (
                        <ConfirmModal
                            message={confirmationData?.message}
                            title={confirmationData?.title}
                            onOK={confirmationData?.onOK}
                            visible={confirmationVisible}
                            onCancel={() => setConfirmationVisible(false)}
                        />
                    )
                    : <></>
            }
        </>

    )
}

export default memo(DestockRecForSelectedMaterils);

AcceptRecForAllMaterials.defaultProps = {
    selectedMaterials: []
};

AcceptRecForAllMaterials.propTypes = {
    selectedMaterials: PropTypes.arrayOf(PropTypes.object),
};
