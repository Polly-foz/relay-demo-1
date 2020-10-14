import React, {useRef} from 'react';
import graphql from "babel-plugin-relay/macro";
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
function IssueCommentCommit(){
    const inputEl = useRef(null)
    const onButtonClick = ()=>{
        console.log(inputEl.current.value)
    }
    return (
        <div>
            <input type="text" placeholder="enter a comment" ref={inputEl}/>
            <button onClick={()=>onButtonClick()}>submit</button>
        </div>
    )
}

export default IssueCommentCommit