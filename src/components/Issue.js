import React, {useRef} from 'react';
import graphql from 'babel-plugin-relay/macro';
import RelayEnvironment from '../RelayEnvironment';
import {QueryRenderer} from 'react-relay';
import IssueCommentCommit from "./IssueCommentCommit";

// Define a query
const IssueQuery = graphql`
    query IssueQuery {
        repository(name:"relay-demo-1",owner:"polly-foz"){
            name
            issues(first: 1) {
                totalCount
                edges {
                    node {
                        author {
                            login
                        }
                        body
                        id
                        url
                        comments(first:100){
                            edges{
                                node{
                                    id
                                    body
                                    author{
                                        login
                                    }
                                    url
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;



function Issue() {
    return (
        <QueryRenderer
            environment={RelayEnvironment}
            query={IssueQuery}
            variables={{}}
            render={({error, props}) => {
                if (props) {
                    const node = props.repository.issues.edges[0].node
                    const body = props.repository.issues.edges[0].node.body
                    const url = props.repository.issues.edges[0].node.url
                    return (
                        <div>
                            <p>{props.repository.name}</p>
                            <div>issue:<a href={url}>{body}</a></div>
                            <div>
                                comments:<br/>
                                {
                                    node.comments.edges.map(edge => {
                                        const comment = edge.node
                                        const {url, body, id} = comment
                                        return (
                                            <div key={id}><a href={url}>{body}</a></div>
                                        )
                                    })
                                }
                            </div>
                            <IssueCommentCommit/>
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

export default Issue;