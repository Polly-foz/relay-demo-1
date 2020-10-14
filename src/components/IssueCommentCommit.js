import React, {useRef} from 'react';
import graphql from "babel-plugin-relay/macro";
import {commitMutation} from 'react-relay';
import RelayEnvironment from '../RelayEnvironment';

const mutation = graphql`
    mutation IssueCommentCommitMutation($body: String!){
        addComment(input:{body:$body,subjectId:"MDU6SXNzdWU3MjEyNDYyNzA="}){
            clientMutationId
            subject{
                id
            }
            commentEdge{
                node{
                    author{
                        login
                    }
                    body
                }
            }
        }
    }
`

function addComment(environment, body, retry) {
    const variables = {
        body,
    };

    commitMutation(
        environment,
        {
            mutation,
            variables,
            onCompleted: (response, errors) => {
                console.log('Response received from server.')
                retry()
            },
            onError: err => console.error(err),
        },
    );
}


function IssueCommentCommit({retry}) {
    const inputEl = useRef(null)
    const onButtonClick = () => {
        const value = inputEl.current.value
        if (!value || value.trim() === '') {
            alert("请输入要提交的comment")
            return
        }
        addComment(RelayEnvironment, value, retry)
    }
    return (
        <div>
            <input type="text" placeholder="enter a comment" ref={inputEl}/>
            <button onClick={() => onButtonClick()}>submit</button>
        </div>
    )
}

export default IssueCommentCommit