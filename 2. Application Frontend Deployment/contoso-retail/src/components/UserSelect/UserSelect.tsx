// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import * as React from 'react';
import { Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import '../UserSelect/UserSelect.scss';
import { EventSender } from '../EventSender/EventSender';

interface IData {
    id?: string;
    userID?: string;
    name?: string;
    profileImageURL?: string;
}

class UserSelect extends React.Component<{}, {
    personaData?: IData[]
}> {
    constructor(props: any) {
        super(props);

        this.state = {
            personaData: [{
                id: "0",
                profileImageURL: "",
                name: ""
            }]
        }
    }

    componentDidMount() {
        fetch('https://contosoretail.azurefd.net/profile/ContosoRetail/Users')
            .then(response => response.json())
            .then(data => this.setState({ personaData: data }));
    }

    private async userSelected(_id: string, _name: string, _imgHref: string) {
        let confirm = window.confirm("Are you sure you want to switch users?  This will wipe your order and cart history.");

        var eventClient = new EventSender();
        await eventClient.SendEvent({ "userID": _id, "httpReferer": window.location.href });

        if (confirm) {
            const key = "ContosoSynapseDemo";

            let storeData = {
                "id": _id,
                "userName": _name,
                "userImg": "https://contosoretailimages.blob.core.windows.net/profile/" + _imgHref,
                "modifiedUser": true,
                "cart": new Array(),
                "orders": new Array()
            }
            sessionStorage.setItem(key, JSON.stringify(storeData));

            window.alert("User changed");
            window.location.href = "/";
        }
    }

    render() {
        return (
            <div id="UserSelect">
                <h1>Switch User</h1>
                <section>
                    {
                        this.state.personaData.map((value, index) => {
                            return (
                                <div
                                    onClick={async () => await this.userSelected(value.userID, value.name, value.profileImageURL)}
                                    className="user-item" key={value.id}>
                                    <Persona
                                        size={PersonaSize.size40}
                                        presence={PersonaPresence.none}
                                        imageAlt={value.name}
                                        imageUrl={"https://contosoretailimages.blob.core.windows.net/profile/" + value.profileImageURL}
                                        text={value.name}
                                        secondaryText={"User ID " + value.userID}
                                    />
                                </div>
                            );
                        })
                    }
                </section>
            </div>
        )
    }
}

export default UserSelect;