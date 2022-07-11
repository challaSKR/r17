import { Button } from 'antd';
import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmModal from '../../../Common/ConfirmModal';
import allActions from '../../../../actions';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';

const ReviewData = (props) => {

    const selectedItems = _.get(props, 'selectedItems', []);
    const [confirmationData, setConfirmationData] = useState({});
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const dispatch = useDispatch();
    const authState = useSelector((state) => state.authState?.userDetails);

    const review = () => {
        let selectedMaterials = _.cloneDeep(selectedItems);
        setConfirmationVisible(false);
        selectedMaterials = _.map(selectedMaterials, eachMaterial => _.extend({reviewedBy: authState?.uid}, eachMaterial));
        dispatch(allActions.MaterialDetailsActions.bulkReview(selectedMaterials));
      };

    const confirmData = {
        review: {
            message: 'Are you sure you want to mark as reviewed?',
            title: 'Mark as reviewed',
            onOK: review,
        }
    };

    const openReviewConfirmationModal = () => {
        setConfirmationData(confirmData?.review);
        setConfirmationVisible(true)
    }

    return (
        <>
            <Button
                type="primary"
                className="matlist-button"
                onClick={() => openReviewConfirmationModal()}
            >
                Mark as reviewed
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

export default memo(ReviewData);

ReviewData.defaultProps = {
    selectedItems: []
};

ReviewData.propTypes = {
    selectedItems: PropTypes.arrayOf(PropTypes.object),
};