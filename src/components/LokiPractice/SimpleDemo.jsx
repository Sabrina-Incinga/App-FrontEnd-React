import React from 'react';
import swal from "@sweetalert/with-react";
import Loki from 'react-loki';

const simpleSteps = [
    {
        label: 'Step 1',
        component: <h1>step 1</h1>,
    },
    {
        label: 'Step 2',
        component: <h1>step 2</h1>,
    },
];

const SimpleDemo = () => {
    const _onFinish = () => {
        swal('Simple Demo Finished', {
            icon: "success",
         });
    };

    return (
        <div className="Demo">
            <Loki
                steps={simpleSteps}
                onFinish={_onFinish} />
        </div>
    );
}

export default SimpleDemo;