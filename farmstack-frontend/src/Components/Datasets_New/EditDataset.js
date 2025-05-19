import React from 'react'
import { useParams } from 'react-router-dom'
import AddDataSet from './AddDataSet';
const EditDataset = () => {
    const { id } = useParams();
    return (
        <div>
            <AddDataSet
                isEditModeOn={true}
                datasetIdForEdit={id}
            />
        </div>
    )
}

export default EditDataset