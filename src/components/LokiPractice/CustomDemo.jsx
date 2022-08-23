import React from 'react';

/* import FaUser from 'react-icons/lib/fa/user';
import FaPaw from 'react-icons/lib/fa/paw';
import FaEnvelope from 'react-icons/lib/fa/envelope'; */
import swal from "@sweetalert/with-react";
import Loki from 'react-loki';

const customSteps = [
    {
        label: 'Step 1',

        component: <h1>step 1</h1>,
    },
    {
        label: 'Step 2',

        component: <h1>step 2</h1>,
    },
    {
        label: 'Step 3',

        component: <h1>step 3</h1>,
    },
];

const CustomDemo = () => {
    const _customRenderer = ({ currentStep }) => {
        const steps = customSteps.map((step, index) => {
            const isActive = currentStep === index + 1;
            return <li key={index} className="custom-step">{`${step.label} ${isActive && 'active'}`}</li>
        });

        return <ul className="custom-step-renderer">{steps}</ul>;
    };

    const _customActions = ({ isComplete, cantBack, isInFinalStep, backHandler, nextHandler }) => {
        return (
            <div className="button-group">
                <button type="button" className="btn btn-secondary btn-sm" onClick={backHandler} disabled={cantBack || isComplete}>
                    {`Go back`}
                </button>
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={nextHandler} disabled={isComplete}>
                    {isInFinalStep ? `Finish HIM` : `Go Next`}
                </button>
            </div>
        );
    };

    const _onFinish = () => {
        swal('Custom Demo Finished', {
            icon: "success",
         });
    };

    return (
        <div className="Demo">
            <Loki
                steps={customSteps}
                renderSteps={_customRenderer}
                renderActions={_customActions}
                onFinish={_onFinish} />
        </div>
    );
};

export default CustomDemo;