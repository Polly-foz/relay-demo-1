import React from 'react';
import graphql from 'babel-plugin-relay/macro';
import RelayEnvironment from '../RelayEnvironment';
import {QueryRenderer} from 'react-relay';
import RepositoryCommits from "./RepositoryCommits";
// Define a query
const RepositoryNameQuery = graphql`
    query RepositoryNameQuery($owner:String!, $name:String!) {
        repository(owner: $owner name: $name) {
            name
            owner{
                login
                url
            }
            description
            homepageUrl
            ...RepositoryCommits_repository
        }
    }
`;

function Repository(props) {
    return (
        <QueryRenderer
            environment={RelayEnvironment}
            query={RepositoryNameQuery}
            variables={{
                owner: 'facebook',
                name: 'relay'
            }}
            render={({error, props}) => {
                if (props) {
                    const {repository} = props
                    const {name,owner,description,homepageUrl} = repository
                    return (
                        <div className="Repository">
                            <header className="Repository">
                                <h1>Repository</h1>
                                <p>repository: <a href={homepageUrl}>{name}</a></p>
                                <p>owner: <a href={owner.url}>{owner.login}</a></p>
                                <p>description: {description}</p>
                            </header>
                            <RepositoryCommits repository={props.repository}/>
                        </div>
                    )
                } else if (error) {
                    return <div>{error.message}</div>
                }
                return <div>Loading</div>
            }}
        />
    );
}

export default Repository;