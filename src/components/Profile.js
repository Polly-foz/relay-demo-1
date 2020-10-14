import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import RelayEnvironment from '../RelayEnvironment';
import {QueryRenderer} from 'react-relay';

// Define a query
const ProfileNameQuery = graphql`
    query ProfileNameQuery {
        viewer{
            login
        }
    }
`;

function Profile(props) {
    return (
        <QueryRenderer
            environment={RelayEnvironment}
            query={ProfileNameQuery}
            variables={{}}
            render={({error, props})=>{
                if(props){
                    return (
                        <div className="Profile">
                            <header className="Profile-header">
                                <p>{props.viewer.login}</p>
                            </header>
                        </div>
                    )
                }else if(error){
                    return <div>{error.message}</div>
                }
                return <div>Loading</div>
            }}
        />
    );
}

export default Profile;