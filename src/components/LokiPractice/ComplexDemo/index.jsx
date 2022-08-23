import React, { Component } from 'react';
import swal from "@sweetalert/with-react";

import Loki from 'react-loki';

import UserForm from './UserForm';
import PasswordForm from './PasswordForm';
import NewsletterForm from './NewsletterForm';

export default class ComplexDemo extends Component {
    state = {
        user: {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            receiveNewsletter: false,
        },
        person: {
            firstName: true,
            lastName: 25
        }
    }

    _mergeValues(values) {
        
        this.setState({
            user: {
                ...this.state.user,
                ...values
            },
        });
    }

    _finishWizard() {
        const data = JSON.stringify(this.state.user);
        swal(`This is your data ${data}`);
    }

    render() {
        const complexSteps = [
            {
                label: 'Step 1',

                component: <UserForm user={this.state.user} person={this.state.person} />,
            },
            {
                label: 'Step 2',

                component: <PasswordForm user={this.state.user}/>,
            },
            {
                label: 'Step 3',

                component: <NewsletterForm user={this.state.user} />,
            },
        ];

        return (
            <div className="Demo">
                <Loki
                    steps={complexSteps}
                    onNext={this._mergeValues.bind(this)}
                    onBack={this._mergeValues.bind(this)}
                    onFinish={this._finishWizard.bind(this)}
                    finishLabel="submit"
                    noActions />
            </div>
        );
    }
}